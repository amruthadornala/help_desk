import express from 'express';
import { submitFeedback, getFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, submitFeedback);
router.get('/', authenticateToken, requireAdmin, getFeedback);
router.delete('/:id', authenticateToken, requireAdmin, deleteFeedback);

export default router;
