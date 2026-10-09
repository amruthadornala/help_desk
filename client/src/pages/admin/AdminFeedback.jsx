import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ThumbsUp, ThumbsDown, Trash2, Calendar, User, MessageSquare } from 'lucide-react';

export function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const data = await api.getFeedback();
      setFeedbackList(data);
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this feedback submission?')) {
      try {
        await api.deleteFeedback(id);
        setFeedbackList(prev => prev.filter(f => f.id !== id));
      } catch (err) {
        alert('Failed to delete feedback: ' + err.message);
      }
    }
  };

  const helpfulCount = feedbackList.filter(f => f.rating === 'helpful').length;
  const unhelpfulCount = feedbackList.filter(f => f.rating === 'not_helpful').length;
  const satisfactionRate = feedbackList.length > 0 ? Math.round((helpfulCount / feedbackList.length) * 100) : 100;

  return (
    <div className="admin-feedback-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box feedback-box">
          <ThumbsUp size={24} />
        </div>
        <div>
          <h2>Student Quality Feedback & Reviews</h2>
          <p>Monitor student ratings and qualitative comments on AI help desk responses</p>
        </div>
      </div>

      {/* Summary Score Strip */}
      <div className="feedback-score-strip">
        <div className="score-card">
          <span className="score-digit">{satisfactionRate}%</span>
          <span className="score-label">Satisfaction Rate</span>
        </div>
        <div className="score-card">
          <span className="score-digit text-emerald">{helpfulCount}</span>
          <span className="score-label">Helpful Votes (👍)</span>
        </div>
        <div className="score-card">
          <span className="score-digit text-danger">{unhelpfulCount}</span>
          <span className="score-label">Needs Improvement (👎)</span>
        </div>
        <div className="score-card">
          <span className="score-digit">{feedbackList.length}</span>
          <span className="score-label">Total Feedbacks</span>
        </div>
      </div>

      {/* Feedback Stream */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading student reviews...</p>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ThumbsUp size={28} />
          </div>
          <h3>No feedback submitted yet</h3>
          <p>Student ratings will appear here as they interact with the AI assistant.</p>
        </div>
      ) : (
        <div className="feedback-stream-list">
          {feedbackList.map((item) => (
            <div key={item.id} className="feedback-item-card">
              <div className="feedback-card-top">
                <div className="feedback-user-info">
                  <div className="user-avatar-small">
                    {item.student_name ? item.student_name[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <strong>{item.student_name || 'Student'}</strong>
                    <span className="user-sub">
                      {item.student_email} • {item.student_department || 'General'}
                    </span>
                  </div>
                </div>

                <div className="feedback-badge-and-date">
                  {item.rating === 'helpful' ? (
                    <span className="badge badge-success">
                      <ThumbsUp size={12} /> Helpful Response
                    </span>
                  ) : (
                    <span className="badge badge-danger">
                      <ThumbsDown size={12} /> Needs Improvement
                    </span>
                  )}

                  <span className="timestamp-text">
                    <Calendar size={13} />
                    {new Date(item.created_at).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn-icon text-danger"
                    title="Delete Entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {item.related_question && (
                <div className="feedback-question-reference">
                  <span className="ref-tag">Related Student Question:</span>
                  <p>"{item.related_question}"</p>
                </div>
              )}

              {item.comment ? (
                <div className="feedback-comment-quote">
                  <span className="comment-tag">Student Comment:</span>
                  <p>"{item.comment}"</p>
                </div>
              ) : (
                <span className="no-comment-text">(No text comment provided)</span>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-feedback-page {
          max-width: 1100px;
          margin: 0 auto;
        }
        .admin-page-header {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 1.75rem 2rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .header-icon-box.feedback-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #e11d48, #f43f5e);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .admin-page-header h2 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .admin-page-header p {
          color: var(--neutral-500);
          font-size: 0.875rem;
        }

        .feedback-score-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .score-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }
        .score-digit {
          font-size: 2rem;
          font-weight: 800;
          font-family: var(--font-heading);
          display: block;
          line-height: 1.1;
          color: var(--neutral-900);
        }
        .score-label {
          font-size: 0.78rem;
          color: var(--neutral-500);
          font-weight: 600;
          text-transform: uppercase;
        }
        .text-emerald { color: var(--success-600) !important; }
        .text-danger { color: var(--danger-600) !important; }

        .feedback-stream-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .feedback-item-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .feedback-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--neutral-100);
          margin-bottom: 0.85rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .feedback-user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar-small {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .user-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--neutral-500);
        }
        .feedback-badge-and-date {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .timestamp-text {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--neutral-400);
        }

        .feedback-question-reference {
          background: var(--neutral-50);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 0.75rem;
          border: 1px solid var(--neutral-200);
        }
        .ref-tag {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--neutral-500);
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.2rem;
        }
        .feedback-question-reference p {
          font-size: 0.85rem;
          color: var(--neutral-800);
          font-weight: 500;
        }

        .feedback-comment-quote {
          background: #eff6ff;
          border-left: 4px solid var(--primary-600);
          padding: 0.85rem 1.15rem;
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
        .comment-tag {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--primary-700);
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
        }
        .feedback-comment-quote p {
          font-size: 0.9375rem;
          color: var(--neutral-800);
          font-style: italic;
        }
        .no-comment-text {
          font-size: 0.8125rem;
          color: var(--neutral-400);
          font-style: italic;
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
