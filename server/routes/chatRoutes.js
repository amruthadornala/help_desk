import express from 'express';
import { askQuestion, getChatHistory, deleteChatItem, clearChatHistory } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', askQuestion);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);
router.delete('/:id', deleteChatItem);

export default router;
