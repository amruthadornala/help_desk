import express from 'express';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAnnouncements);
router.post('/', authenticateToken, requireAdmin, createAnnouncement);
router.put('/:id', authenticateToken, requireAdmin, updateAnnouncement);
router.delete('/:id', authenticateToken, requireAdmin, deleteAnnouncement);

export default router;
