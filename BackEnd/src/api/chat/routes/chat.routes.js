
// **Routes File (routes/chatRoutes.js)**
import express from 'express';
import {
    startChat,
    sendMessage,
    getChatsForUser,
    getMessagesInChat,
    reactToMessage,
    markMessagesAsRead,
    getChatListForUser,
    getConversation
} from '../controllers/chat.controller.js';

const router = express.Router();

// Chat Routes
router.post('/', startChat);
router.get('/:userId', getChatsForUser);
router.get('/list/:userId',getChatListForUser);
router.get('/conversation/:chatId',getConversation)

// Message Routes
router.post('/messages', sendMessage);
router.get('/messages/:chatId', getMessagesInChat);
router.patch('/messages/:messageId/reaction', reactToMessage);
router.patch('/messages/:chatId/read', markMessagesAsRead);

export default router;
