import { db } from '../database/db.js';

export function getDashboardStats(req, res) {
  try {
    const studentCount = db.prepare("SELECT count(*) as count FROM users WHERE role = 'student'").get().count;
    const faqCount = db.prepare('SELECT count(*) as count FROM faqs').get().count;
    const kbCount = db.prepare('SELECT count(*) as count FROM knowledge_base').get().count;
    const deptCount = db.prepare('SELECT count(*) as count FROM departments').get().count;
    const annCount = db.prepare('SELECT count(*) as count FROM announcements').get().count;
    const chatCount = db.prepare('SELECT count(*) as count FROM chat_history').get().count;

    const feedbackStats = db.prepare(`
      SELECT 
        count(*) as total,
        SUM(CASE WHEN rating = 'helpful' THEN 1 ELSE 0 END) as helpful,
        SUM(CASE WHEN rating = 'not_helpful' THEN 1 ELSE 0 END) as not_helpful
      FROM feedback
    `).get();

    const recentQuestions = db.prepare(`
      SELECT 
        ch.id,
        ch.question,
        ch.answer,
        ch.created_at,
        u.name as student_name,
        u.email as student_email,
        u.department as student_department
      FROM chat_history ch
      LEFT JOIN users u ON ch.user_id = u.id
      ORDER BY ch.id DESC
      LIMIT 6
    `).all();

    const recentAnnouncements = db.prepare(`
      SELECT id, title, category, priority, date
      FROM announcements
      ORDER BY date DESC, id DESC
      LIMIT 4
    `).all();

    const faqCategories = db.prepare(`
      SELECT category, count(*) as count
      FROM faqs
      GROUP BY category
      ORDER BY count DESC
    `).all();

    res.json({
      total_students: studentCount,
      total_faqs: faqCount,
      total_knowledge: kbCount,
      total_departments: deptCount,
      total_announcements: annCount,
      total_questions: chatCount,
      feedback: {
        total: feedbackStats.total || 0,
        helpful: feedbackStats.helpful || 0,
        not_helpful: feedbackStats.not_helpful || 0,
        satisfaction_rate: feedbackStats.total ? Math.round((feedbackStats.helpful / feedbackStats.total) * 100) : 100
      },
      recent_questions: recentQuestions,
      recent_announcements: recentAnnouncements,
      faq_categories: faqCategories
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to compute dashboard statistics.' });
  }
}

export function getAllStudents(req, res) {
  try {
    const students = db.prepare(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.student_id,
        u.department,
        u.created_at,
        (SELECT count(*) FROM chat_history ch WHERE ch.user_id = u.id) as questions_asked
      FROM users u
      WHERE u.role = 'student'
      ORDER BY u.id DESC
    `).all();

    res.json(students);
  } catch (error) {
    console.error('Fetch students error:', error);
    res.status(500).json({ error: 'Failed to retrieve students list.' });
  }
}

export function getAllQuestions(req, res) {
  try {
    const { search } = req.query;
    let query = `
      SELECT 
        ch.id,
        ch.user_id,
        ch.question,
        ch.answer,
        ch.sources,
        ch.created_at,
        u.name as student_name,
        u.email as student_email,
        u.department as student_department,
        u.student_id
      FROM chat_history ch
      LEFT JOIN users u ON ch.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim()) {
      query += ' AND (lower(ch.question) LIKE ? OR lower(ch.answer) LIKE ? OR lower(u.name) LIKE ?)';
      const term = `%${search.trim().toLowerCase()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY ch.id DESC LIMIT 100';

    const rows = db.prepare(query).all(...params);
    const questions = rows.map(r => ({
      ...r,
      sources: r.sources ? JSON.parse(r.sources) : []
    }));

    res.json(questions);
  } catch (error) {
    console.error('Fetch all questions error:', error);
    res.status(500).json({ error: 'Failed to fetch student questions.' });
  }
}
