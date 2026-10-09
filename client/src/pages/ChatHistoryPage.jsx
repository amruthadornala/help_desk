import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { History, Search, Trash2, Bot, Calendar, ArrowRight, MessageSquare, BookOpen } from 'lucide-react';

export function ChatHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (searchTerm = search) => {
    try {
      setLoading(true);
      const data = await api.getChatHistory(searchTerm);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHistory(search);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Delete this conversation item from your history?')) {
      try {
        await api.deleteChat(id);
        setHistory(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        alert('Failed to delete item: ' + err.message);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL your chat history?')) {
      try {
        await api.clearChatHistory();
        setHistory([]);
      } catch (err) {
        alert('Failed to clear history: ' + err.message);
      }
    }
  };

  return (
    <div className="history-page-container">
      {/* Header Banner */}
      <div className="page-header-card">
        <div className="header-icon-box history-box">
          <History size={24} />
        </div>
        <div>
          <h2>Your AI Consultation History</h2>
          <p>Review past queries, verified answers, and knowledge sources</p>
        </div>

        {history.length > 0 && (
          <button onClick={handleClearAll} className="btn btn-danger btn-sm clear-all-btn">
            <Trash2 size={15} />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search previous questions or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search History
          </button>
        </form>
      </div>

      {/* History Stream */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Retrieving chat records...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <MessageSquare size={28} />
          </div>
          <h3>No conversation history</h3>
          <p>You haven't asked any questions yet or cleared your history.</p>
          <Link to="/chat" className="btn btn-primary">
            <Bot size={16} />
            Ask Your First Question
          </Link>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item-card">
              <div className="history-item-top">
                <div className="question-headline">
                  <span className="question-q-badge">Q</span>
                  <h3>{item.question}</h3>
                </div>

                <div className="history-actions">
                  <span className="timestamp-badge">
                    <Calendar size={13} />
                    {new Date(item.created_at).toLocaleString([], {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="btn-icon-danger"
                    title="Delete conversation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="answer-box">
                <div className="answer-header">
                  <Bot size={16} className="text-primary" />
                  <span>AI Help Desk Response</span>
                </div>
                <p className="answer-text">{item.answer}</p>

                {item.sources && item.sources.length > 0 && (
                  <div className="sources-list">
                    <BookOpen size={12} className="text-neutral-400" />
                    <span>Sources:</span>
                    {item.sources.map((s, idx) => (
                      <span key={idx} className="badge badge-neutral">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="history-card-footer">
                <Link
                  to={`/chat?initialPrompt=${encodeURIComponent(item.question)}`}
                  className="btn btn-secondary btn-sm"
                >
                  <Bot size={14} />
                  Ask AI Again
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .history-page-container {
          max-width: 960px;
          margin: 0 auto;
        }
        .page-header-card {
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
        .header-icon-box.history-box {
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
        .page-header-card h2 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }
        .page-header-card p {
          color: var(--neutral-500);
          font-size: 0.875rem;
        }
        .clear-all-btn {
          margin-left: auto;
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
        .search-input-field:focus {
          border-color: var(--primary-600);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .history-item-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .history-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .question-headline {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .question-q-badge {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--primary-600);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.8125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .question-headline h3 {
          font-size: 1.15rem;
          color: var(--neutral-900);
        }
        .history-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .timestamp-badge {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          color: var(--neutral-400);
        }
        .btn-icon-danger {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          border: 1px solid var(--neutral-200);
          background: #ffffff;
          color: var(--neutral-400);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-icon-danger:hover {
          background: var(--danger-50);
          color: var(--danger-600);
          border-color: #fecaca;
        }

        .answer-box {
          background: var(--neutral-50);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          border: 1px solid var(--neutral-200);
          margin-bottom: 1rem;
        }
        .answer-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--neutral-700);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        .answer-text {
          font-size: 0.9375rem;
          color: var(--neutral-700);
          line-height: 1.6;
        }
        .sources-list {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          border-top: 1px dashed var(--neutral-200);
          font-size: 0.75rem;
          color: var(--neutral-500);
          flex-wrap: wrap;
        }

        .history-card-footer {
          display: flex;
          justify-content: flex-end;
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
