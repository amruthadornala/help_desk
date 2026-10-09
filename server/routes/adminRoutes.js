import express from 'express';
import { getDashboardStats, getAllStudents, getAllQuestions } from '../controllers/adminController.js';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';
import { getKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from '../controllers/kbController.js';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/deptController.js';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController.js';
import { getFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireAdmin);

// Dashboard Overview & Metrics
router.get('/dashboard', getDashboardStats);

// Students Directory
router.get('/students', getAllStudents);

// Student Questions Log
router.get('/questions', getAllQuestions);

// Admin FAQs Management
router.get('/faqs', getFaqs);
router.post('/faqs', createFaq);
router.put('/faqs/:id', updateFaq);
router.delete('/faqs/:id', deleteFaq);

// Admin Knowledge Base Management
router.get('/knowledge', getKnowledge);
router.post('/knowledge', createKnowledge);
router.put('/knowledge/:id', updateKnowledge);
router.delete('/knowledge/:id', deleteKnowledge);

// Admin Departments Management
router.get('/departments', getDepartments);
router.post('/departments', createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

// Admin Announcements Management
router.get('/announcements', getAnnouncements);
router.post('/announcements', createAnnouncement);
router.put('/announcements/:id', updateAnnouncement);
router.delete('/announcements/:id', deleteAnnouncement);

// Admin Feedback Management
router.get('/feedback', getFeedback);
router.delete('/feedback/:id', deleteFeedback);

export default router;
