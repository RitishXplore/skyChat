import express from "express";
const app = express();
app.use(express.json());
import bcrypt from "bcryptjs";

import mongoose from "mongoose";
const router = express.Router();
import jwt from 'jsonwebtoken';
import { User } from "../models/auth.model.js";

router.get("/get", async (req,res)=>{
    const userdata = await User.find({_id:'677431104180f3af040c5c02'}) ;
    res.status(200).json(userdata);
})

// Assuming you have already defined and imported your User model
// Make sure this is the correct path to your model

router.get("/getquery", async (req, res) => {
  try {
    const userId = '677431104180f3af040c5c02';  // Static user ID, you can make it dynamic based on the request

    // Convert the user ID string into an ObjectId
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    // Using the User model's aggregate method for aggregation
    const userdata = await User.aggregate([
      {
        $match: {
          _id: objectIdUserId  // Match the user by ObjectId
        }
      },
      {
        $project: {
          _id: 1,
          username: 1,
          profilePicture: 1,
          callHistory: 1,
          chats: 1,
          groups: 1,
          isActive: 1,
          lastActive: 1
        }
      },
      {
        $unwind: "$chats"
      },
      {
        $lookup: {
          from: "chats",  // Chat collection name (assumes "chats" collection exists)
          localField: "chats",  // Reference to chats in the User model
          foreignField: "_id",  // Match with _id in the chats collection
          as: "chatDetails"
        }
      },
      {
        $match: {
          "chatDetails": { $ne: [] }  // Ensure that chatDetails is not empty
        }
      },
      {
        $unwind: "$chatDetails"
      },
      {
        $lookup: {
          from: "messages",  // Messages collection
          localField: "chatDetails.lastMessage",  // Match lastMessage field
          foreignField: "_id",  // Match with _id in the messages collection
          as: "lastMessage"
        }
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true  // Preserve chats even if there's no last message
        }
      },
      {
        $lookup: {
          from: "users",  // Users collection to get participant details
          localField: "chatDetails.participants",  // Participants in the chat
          foreignField: "_id",  // Match participants _id with users collection
          as: "participants"
        }
      },
      {
        $project: {
          userId: "$_id",
          username: 1,
          profilePicture: 1,
          callHistory: 1,
          groups: 1,
          chatId: "$chatDetails._id",
          isGroupChat: "$chatDetails.isGroupChat",
          groupId: "$chatDetails.groupId",
          lastMessage: {
            content: "$lastMessage.content",
            sender: "$lastMessage.sender",
            createdAt: "$lastMessage.createdAt",
            status: "$lastMessage.status",
            media: "$lastMessage.media",
            reactions: "$lastMessage.reactions"
          },
          participants: {
            $map: {
              input: "$participants",
              as: "user",
              in: {
                _id: "$$user._id",
                username: "$$user.username",
                profilePicture: "$$user.profilePicture",
                status: "$$user.status"
              }
            }
          }
        }
      }
    ]);

    // Send the response with the aggregated data
    res.status(200).json(userdata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user data" });
  }
});





//signup
router.post('/signup', async (req,res)=>{
    const { username , email , password } = req.body;
    const existingUser = await User.findOne({email : email})
    if(existingUser){
        return res.status(400).json({message : 'User already exists'});
    }
    try {
        const newUser = new User({username, email ,password});
        await newUser.save();
        res.status(201).json({message : 'User Signed in successfully'});
    } catch (error) {
        res.status(400).json({message : error.message});    
    }
})

//login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if(!user && !(await User.comparePassword(password))){
        return res.status(400).json({message : 'Invalid email or password'});
    }
    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 1000, 
        });
        res.json({ message: 'User logged in successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


export default router;