import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MessageSquareQuote, Search, Trash2, Bot, User, Calendar, BookOpen } from 'lucide-react';

export function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async (query = search) => {
    try {
      setLoading(true);
      const data = await api.getAllQuestions(query);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadQuestions(search);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this question inquiry record?')) {
      try {
        await api.deleteChat(id);
        setQuestions(prev => prev.filter(q => q.id !== id));
      } catch (err) {
        alert('Failed to delete question log: ' + err.message);
      }
    }
  };

  return (
    <div className="admin-questions-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box questions-box">
          <MessageSquareQuote size={24} />
        </div>
        <div>
          <h2>Student Inquiries & AI Consultation Logs</h2>
          <p>Audit questions submitted by students, AI answers generated, and verified knowledge sources</p>
        </div>
      </div>

      {/* Search */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search by student name, question, or answer keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search Inquiries</button>
        </form>
      </div>

      {/* Stream */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading consultation logs...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <h3>No student questions found</h3>
          <p>No student inquiries match your current search.</p>
        </div>
      ) : (
        <div className="questions-stream-list">
          {questions.map((item) => (
            <div key={item.id} className="audit-question-card">
              <div className="audit-card-top">
                <div className="student-badge-info">
                  <div className="student-avatar-small">
                    {item.student_name ? item.student_name[0].toUpperCase() : 'S'}
                  </div>
                  <div>
                    <strong>{item.student_name || 'Enrolled Student'}</strong>
                    <span className="student-sub">
                      {item.student_email} • {item.student_department || 'General'}
                      {item.student_id ? ` • ID: ${item.student_id}` : ''}
                    </span>
                  </div>
                </div>

                <div className="audit-actions">
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
                    title="Delete Record"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="question-content-box">
                <span className="label-q">Question:</span>
                <h4>"{item.question}"</h4>
              </div>

              <div className="answer-content-box">
                <div className="ai-label-strip">
                  <Bot size={15} className="text-primary" />
                  <span>AI Help Desk Response:</span>
                </div>
                <p>{item.answer}</p>

                {item.sources && item.sources.length > 0 && (
                  <div className="sources-audit-list">
                    <BookOpen size={12} className="text-neutral-400" />
                    <span>Cited Sources:</span>
                    {item.sources.map((s, idx) => (
                      <span key={idx} className="badge badge-neutral">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-questions-page {
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
        .header-icon-box.questions-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #4f46e5, #6366f1);
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

        .filter-controls-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
          box-shadow: var(--shadow-sm);
        }
        .search-form-row {
          display: flex;
          gap: 0.75rem;
        }
        .search-input-wrapper {
          position: relative;
          flex: 1;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
        }
        .search-input-field {
          width: 100%;
          padding: 0.7rem 1rem 0.7rem 2.6rem;
          border: 1px solid var(--neutral-300);
          border-radius: var(--radius-md);
          font-size: 0.9375rem;
          outline: none;
        }

        .questions-stream-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .audit-question-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .audit-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--neutral-100);
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .student-badge-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .student-avatar-small {
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
        .student-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--neutral-500);
        }
        .audit-actions {
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

        .question-content-box {
          margin-bottom: 0.85rem;
        }
        .label-q {
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--primary-700);
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.2rem;
        }
        .question-content-box h4 {
          font-size: 1.1rem;
          color: var(--neutral-900);
        }

        .answer-content-box {
          background: var(--neutral-50);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          border: 1px solid var(--neutral-200);
        }
        .ai-label-strip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--neutral-600);
          margin-bottom: 0.4rem;
          text-transform: uppercase;
        }
        .answer-content-box p {
          font-size: 0.9rem;
          color: var(--neutral-700);
          line-height: 1.6;
        }
        .sources-audit-list {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.65rem;
          padding-top: 0.5rem;
          border-top: 1px dashed var(--neutral-200);
          font-size: 0.725rem;
          color: var(--neutral-500);
          flex-wrap: wrap;
        }

        .text-danger {
          color: var(--danger-600) !important;
        }
        .text-danger:hover {
          background: var(--danger-50) !important;
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
