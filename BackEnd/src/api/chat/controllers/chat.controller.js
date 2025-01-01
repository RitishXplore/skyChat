// **Controller File (controllers/chatController.js)**
import { Chat, Message } from "../models/singleChat.model.js"

// Start a new chat or retrieve an existing one
export const startChat = async (req, res) => {
    const { userId1, userId2 } = req.body;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId1, userId2] },
            isGroupChat: false
        });

        if (!chat) {
            chat = new Chat({
                participants: [userId1, userId2]
            });
            await chat.save();
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Failed to start chat', error: error.message });
    }
};

// Send a new message
export const sendMessage = async (req, res) => {
    const { chatId, sender, content, media, isEncrypted, encryptionKey } = req.body;

    try {
        const message = new Message({
            chatId,
            sender,
            content,
            media,
            isEncrypted,
            encryptionKey
        });

        const savedMessage = await message.save();

        await Chat.findByIdAndUpdate(chatId, { lastMessage: savedMessage._id });

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
};

// Get all chats for a specific user
export const getChatsForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const chats = await Chat.find({ participants: userId })
            .populate('participants', 'name email')
            .populate('lastMessage');

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chats', error: error.message });
    }
};
export const getChatListForUser = async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all chats involving the user and sort by the last message timestamp in descending order
        const chats = await Chat.find({ participants: userId })
            .populate({
                path: 'participants',
                select: 'username email profilePicture status',
            })
            .populate({
                path: 'lastMessage',
                populate: {
                    path: 'sender',
                    select: 'name profilePicture',
                },
            })
            .sort({ 'lastMessage.createdAt': -1 }); // Sort by the last message's creation time in descending order

        // Transform the data to create the user list
        const chatList = chats.map(chat => {
            // Find the other user in the participants list
            const otherUser = chat.participants.find(
                participant => participant._id.toString() !== userId
            );

            return {
                userId: otherUser?._id,
                username: otherUser?.username,
                email: otherUser?.email,
                profilePicture: otherUser?.profilePicture,
                status: otherUser?.status,
                lastMessage: chat.lastMessage ? {
                    content: chat.lastMessage.content,
                    sender: chat.lastMessage.sender?.name,
                    timestamp: chat.lastMessage.createdAt,
                } : null,
                chatId: chat._id,
            };
        });

        res.status(200).json(chatList);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch chat list', error: error.message });
    }
};



// Get all messages in a chat
export const getMessagesInChat = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.find({ chatId })
            .populate('sender', 'name email')
            .populate('reactions.userId', 'name email');

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
    }
};

// React to a message
export const reactToMessage = async (req, res) => {
    const { messageId } = req.params;
    const { userId, reaction } = req.body;

    try {
        const message = await Message.findByIdAndUpdate(
            messageId,
            { $push: { reactions: { userId, reaction } } },
            { new: true }
        );

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Failed to react to message', error: error.message });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
    const { chatId } = req.params;
    const { userId } = req.body;

    try {
        await Message.updateMany(
            { chatId, sender: { $ne: userId }, status: { $ne: 'read' } },
            { $set: { status: 'read' } }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to mark messages as read', error: error.message });
    }
};
// **Controller File (controllers/chatController.js)**
export const getConversation = async (req, res) => {
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
                message: message.content,
                type: 'msg',
                outgoing: isSender,
                incoming: !isSender,
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
