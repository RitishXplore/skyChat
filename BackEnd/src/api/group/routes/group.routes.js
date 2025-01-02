
// **Routes File (routes/chatRoutes.js)**
import express from 'express';
import { startGroup , getGroup , getGroupConversation } from '../controllers/group.controller.js';

const router = express.Router();


router.post('/groupchat', startGroup);
router.get('/grouplist/:userId' , getGroup )
router.get('/groupconversation/:chatId',getGroupConversation)


export default router;
