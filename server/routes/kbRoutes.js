import express from 'express';
import { getKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/kbController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getKnowledge);
router.post('/', authenticateToken, requireAdmin, createKnowledge);
router.put('/:id', authenticateToken, requireAdmin, updateKnowledge);
router.delete('/:id', authenticateToken, requireAdmin, deleteKnowledge);

export default router;
