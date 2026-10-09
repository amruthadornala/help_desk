import express from 'express';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFaqs);
router.get('/search', getFaqs);
router.post('/', authenticateToken, requireAdmin, createFaq);
router.put('/:id', authenticateToken, requireAdmin, updateFaq);
router.delete('/:id', authenticateToken, requireAdmin, deleteFaq);

export default router;
