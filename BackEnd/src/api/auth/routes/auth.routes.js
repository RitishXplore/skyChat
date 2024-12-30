import express from "express";
const app = express();
app.use(express.json());
import User from "../models/auth.model.js";
import mongoose from "mongoose";
const router = express.Router();

router.get("/", async (req,res)=>{
    //res.status(201).send("auth Api is running...");
    //console.log(User);
    const userdata = await User.find();
    res.status(201).send(userdata);
})


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
router.post('/login', async (req ,res)=>{
    const {email , password } = req.body;
    const user = await User.findOne({email : email});
    if(!user && !(await User.compare(password))){
        return res.status(400).json({message : 'Invalid email or password'});
    }
    res.json({message : 'User logged in successfully'});
})

export default router;