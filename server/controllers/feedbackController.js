import { db } from '../database/db.js';

export function submitFeedback(req, res) {
  try {
    const { chat_id, rating, comment } = req.body;

    if (!rating || !['helpful', 'not_helpful'].includes(rating)) {
      return res.status(400).json({ error: 'Rating must be either helpful or not_helpful.' });
    }

    const insert = db.prepare(`
      INSERT INTO feedback (user_id, chat_id, rating, comment, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `);

    insert.run(
      req.user.id,
      chat_id || null,
      rating,
      comment ? comment.trim() : null
    );

    res.status(201).json({ message: 'Thank you for your feedback! It helps us improve our College Help Desk.' });
  } catch (error) {
    console.error('Feedback submit error:', error);
    res.status(500).json({ error: 'Failed to record feedback.' });
  }
}

export function getFeedback(req, res) {
  try {
    const feedbackList = db.prepare(`
      SELECT 
        f.id,
        f.user_id,
        f.chat_id,
        f.rating,
        f.comment,
        f.created_at,
        u.name as student_name,
        u.email as student_email,
        u.department as student_department,
        ch.question as related_question
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
      LEFT JOIN chat_history ch ON f.chat_id = ch.id
      ORDER BY f.id DESC
    `).all();

    res.json(feedbackList);
  } catch (error) {
    console.error('Fetch feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback logs.' });
  }
}

export function deleteFeedback(req, res) {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM feedback WHERE id = ?').run(id);
    res.json({ message: 'Feedback entry deleted successfully.' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback entry.' });
  }
}
