import { Group } from "../models/group.model.js";
import { Chat, Message } from "../../chat/models/singleChat.model.js";
import mongoose from "mongoose";

export const startGroup = async (req, res) => {
    const { groupName, userIds, icon, status, isAdminOnly, createdBy } = req.body;

    // Validate the inputs
    if (!groupName || !userIds || !userIds.length || !createdBy) {
        return res.status(400).json({ message: "Group name, users, and creator are required." });
    }

    try {
        // Step 1: Ensure the createdBy user is included in the userIds array
        if (!userIds.includes(createdBy)) {
            userIds.push(createdBy); // Add the createdBy user to the participants array
        }

        // Step 2: Create the Group with members, including the createdBy user
        const group = new Group({
            name: groupName,
            icon: icon || null,
            members: userIds.map(userId => ({
                userId: new mongoose.Types.ObjectId(userId),
                role: userId === createdBy ? 'admin' : 'member',
            })),
            createdBy: new mongoose.Types.ObjectId(createdBy),
            status: status || 'active',
            isAdminOnly: isAdminOnly || false,
        });

        // Save the group
        const savedGroup = await group.save();

        // Step 3: Create the Chat and assign the groupId
        const chat = new Chat({
            participants: userIds,  // Include all participants, including createdBy
            isGroupChat: true,
            groupId: savedGroup._id, // Pass the groupId here
        });

        // Save the chat
        await chat.save();

        res.status(201).json({ message: "Group created successfully", group: savedGroup, chat });
    } catch (error) {
        res.status(500).json({ message: "Failed to create group", error: error.message });
    }
};

export const getGroup = async (req, res) => {
    const { userId } = req.params; 
    try {
        // Fetch all chats where the user is a participant and it's a group chat
        const chats = await Chat.find({
            participants: userId,
            isGroupChat: true
        });

        if (chats.length === 0) {
            return res.status(404).json({ message: 'No group chats found for this user.' });
        }

        // Create a mapping of groupId to chatId for reference
        const groupChatMap = chats.reduce((acc, chat) => {
            acc[chat.groupId.toString()] = chat._id;
            return acc;
        }, {});

        // Fetch details of all the groups
        const groups = await Group.find({
            _id: { $in: chats.map(chat => chat.groupId) } // Match groups from chat's groupId
        })
        .populate({
            path: 'members.userId',
            select: 'username email profilePicture status role',
        })
        .select('name icon members status isAdminOnly createdBy');

        if (groups.length === 0) {
            return res.status(404).json({ message: 'No groups found for the chats.' });
        }

        // Format the response as an array of groups with their corresponding chatId
        const response = groups.map(group => ({
            groupId: group._id,
            name: group.name,
            icon: group.icon,
            status: group.status,
            isAdminOnly: group.isAdminOnly,
            createdBy: group.createdBy,
            chatId: groupChatMap[group._id.toString()] || null,
        }));

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch group details', error: error.message });
    }
};


export const getGroupConversation = async (req, res) => {
    const { chatId } = req.params;
    const { userId } = req.query; // Get userId from query parameters

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        const transformedMessages = messages.map(message => {
            const isSender = message.sender.toString() === userId;

            return {
                chatId: chat._id,
                userId :userId,
                message: message.content,
                messageId: message._id,
                type: 'msg',
                outgoing: !isSender,
                incoming: isSender,
                timestamp: message.createdAt,
                isSender,
            };
        });

        res.status(200).json({
            chatId: chat._id,
            messages: transformedMessages,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch conversation', error: error.message });
    }
};





