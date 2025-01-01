// **Model File (models/chatModel.js)**
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
}, {
    timestamps: true,
    collection: 'Chat'
});

const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    media: {
        type: String
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent'
    },
    reactions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reaction: {
            type: String
        }
    }],
    isEncrypted: {
        type: Boolean,
        default: false
    },
    encryptionKey: {
        type: String
    },
    decryptionKey: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'Message'
});

export const Chat = mongoose.model('Chat', chatSchema);
export const Message = mongoose.model('Message', messageSchema);

