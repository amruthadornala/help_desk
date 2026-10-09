import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  User,
  Send,
  Trash2,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  HelpCircle,
  Clock,
  BookOpen,
  MessageSquare,
  AlertCircle,
  CornerDownLeft
} from 'lucide-react';

export function ChatHelpDesk() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋\n\nI am your AI College Help Desk Assistant. How can I help you today? You can ask me about examination dates, fee deadlines, attendance rules, bonafide certificates, department contacts, or college facilities.`,
      sources: ['College Knowledge Base & Academic Regulations'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackState, setFeedbackState] = useState({}); // { [chatId]: { rating, comment, submitted } }
  const [activeFeedbackModal, setActiveFeedbackModal] = useState(null); // { chatId, rating }
  const [feedbackComment, setFeedbackComment] = useState('');

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestedQuestions = [
    'What is the exam schedule?',
    'When is the fee payment deadline?',
    'How can I apply for a bonafide certificate?',
    'What are the library timings?',
    'Where is the CSE department?',
    'How can I contact the examination cell?',
    'What is the attendance requirement?'
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load chat history or handle initial prompt query param
  useEffect(() => {
    const initialPrompt = searchParams.get('initialPrompt');
    if (initialPrompt) {
      setInputQuestion(initialPrompt);
      sendMessage(initialPrompt);
    } else {
      loadRecentHistory();
    }
  }, [searchParams]);

  const loadRecentHistory = async () => {
    try {
      const history = await api.getChatHistory();
      if (history && history.length > 0) {
        // Reverse to show oldest first in chat flow
        const formatted = history.slice(0, 10).reverse().flatMap(item => [
          {
            id: `user-${item.id}`,
            sender: 'user',
            text: item.question,
            timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: item.id, // numeric chatId for feedback
            sender: 'ai',
            text: item.answer,
            sources: item.sources || [],
            timestamp: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        setMessages([
          {
            id: 'welcome-1',
            sender: 'ai',
            text: `Welcome back, ${user?.name || 'Student'}! 👋\nHere are your recent conversations. How can I assist you with your college queries today?`,
            sources: [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...formatted
        ]);
      }
    } catch (err) {
      console.warn('Could not load previous chat history:', err);
    }
  };

  const sendMessage = async (textToSend) => {
    const q = (textToSend || inputQuestion).trim();
    if (!q || loading) return;

    setInputQuestion('');

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await api.askQuestion(q);
      const aiMsg = {
        id: data.id, // backend DB chat_history id
        sender: 'ai',
        text: data.answer,
        sources: data.sources || [],
        timestamp: new Date(data.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'The AI service is temporarily unavailable. Please try again.',
        sources: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm('Clear your conversation display and chat history?')) {
      try {
        await api.clearChatHistory();
      } catch (err) {
        console.warn('Could not clear history on server:', err);
      }
      setMessages([
        {
          id: 'welcome-reset',
          sender: 'ai',
          text: 'Chat history cleared. What question can I help you with now?',
          sources: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleRatingClick = (chatId, rating) => {
    setActiveFeedbackModal({ chatId, rating });
    setFeedbackComment('');
  };

  const submitFeedbackRating = async () => {
    if (!activeFeedbackModal) return;
    const { chatId, rating } = activeFeedbackModal;

    try {
      await api.submitFeedback({
        chat_id: typeof chatId === 'number' ? chatId : null,
        rating,
        comment: feedbackComment.trim() || null
      });

      setFeedbackState(prev => ({
        ...prev,
        [chatId]: { rating, comment: feedbackComment, submitted: true }
      }));
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setActiveFeedbackModal(null);
      setFeedbackComment('');
    }
  };

  return (
    <div className="chat-page-container">
      {/* Top Header Card */}
      <div className="chat-header-bar">
        <div className="chat-header-info">
          <div className="chat-header-avatar">
            <Bot size={24} />
          </div>
          <div>
            <h2>AI College Help Desk</h2>
            <div className="chat-status-indicator">
              <span className="online-indicator"></span>
              <span>Intelligent RAG Assistant • Active</span>
            </div>
          </div>
        </div>

        <button onClick={handleClearChat} className="btn btn-secondary btn-sm" title="Clear current conversation">
          <Trash2 size={15} />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Pill Scroller */}
      <div className="suggested-questions-tray">
        <span className="tray-label">
          <Sparkles size={14} className="text-amber" />
          Suggested:
        </span>
        <div className="pills-scroll-wrapper">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              className="suggested-pill"
              onClick={() => sendMessage(q)}
              disabled={loading}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="messages-stream-box">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
            <div className="message-avatar">
              {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            <div className="message-bubble-wrapper">
              <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'} ${msg.isError ? 'error-bubble' : ''}`}>
                <div className="bubble-text">
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx}>{line || '\u00A0'}</p>
                  ))}
                </div>

                {/* Cited Sources Badge */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="bubble-sources-panel">
                    <span className="sources-title">
                      <BookOpen size={12} />
                      Verified Sources:
                    </span>
                    <div className="sources-chips">
                      {msg.sources.map((s, i) => (
                        <span key={i} className="source-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bubble-meta">
                  <span className="bubble-time">{msg.timestamp}</span>

                  {/* Feedback Buttons for AI responses */}
                  {msg.sender === 'ai' && !msg.isError && (
                    <div className="feedback-buttons-group">
                      {feedbackState[msg.id]?.submitted ? (
                        <span className="feedback-submitted-badge">
                          <CheckCircle size={13} />
                          Feedback recorded
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleRatingClick(msg.id, 'helpful')}
                            className="btn-feedback helpful"
                            title="Helpful"
                          >
                            <ThumbsUp size={13} />
                            <span>Helpful</span>
                          </button>
                          <button
                            onClick={() => handleRatingClick(msg.id, 'not_helpful')}
                            className="btn-feedback not-helpful"
                            title="Not Helpful"
                          >
                            <ThumbsDown size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="message-row ai-row">
            <div className="message-avatar">
              <Bot size={18} />
            </div>
            <div className="message-bubble-wrapper">
              <div className="message-bubble ai-bubble thinking-bubble">
                <div className="thinking-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="thinking-text">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="chat-input-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="chat-input-form"
        >
          <input
            ref={inputRef}
            type="text"
            className="chat-text-input"
            placeholder="Type your question... (e.g. When is the exam schedule or fee deadline?)"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn btn-primary chat-send-btn"
            disabled={!inputQuestion.trim() || loading}
          >
            <span>Send</span>
            <Send size={16} />
          </button>
        </form>
        <span className="chat-disclaimer-text">
          AI answers are grounded in official college database records. Contact the Examination Cell or HOD for disputed matters.
        </span>
      </div>

      {/* Optional Feedback Modal */}
      {activeFeedbackModal && (
        <div className="modal-overlay" onClick={() => setActiveFeedbackModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {activeFeedbackModal.rating === 'helpful' ? '👍 Helpful Response' : '👎 Report Unhelpful Response'}
              </h3>
            </div>
            <div className="modal-body">
              <p className="modal-prompt-text">
                Your feedback helps our college administrative team refine the campus knowledge base.
              </p>
              <div className="form-group">
                <label className="form-label">Optional Comments or Suggestions:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Very clear instructions! Or: Missing specific room number..."
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setActiveFeedbackModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitFeedbackRating}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .chat-page-container {
          max-width: 980px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 120px);
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        /* Header */
        .chat-header-bar {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--neutral-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }
        .chat-header-avatar {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
        }
        .chat-header-info h2 {
          font-size: 1.25rem;
          line-height: 1.2;
        }
        .chat-status-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--success-600);
          font-weight: 500;
        }
        .online-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success-500);
        }

        /* Suggested Tray */
        .suggested-questions-tray {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1.25rem;
          background: var(--neutral-50);
          border-bottom: 1px solid var(--neutral-200);
          overflow-x: auto;
        }
        .tray-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--neutral-600);
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .text-amber { color: var(--warning-600); }
        .pills-scroll-wrapper {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          white-space: nowrap;
          padding-bottom: 2px;
        }
        .suggested-pill {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-full);
          padding: 0.3rem 0.75rem;
          font-size: 0.78rem;
          color: var(--neutral-700);
          cursor: pointer;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }
        .suggested-pill:hover:not(:disabled) {
          background: var(--primary-50);
          color: var(--primary-700);
          border-color: var(--primary-300);
        }

        /* Messages stream */
        .messages-stream-box {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: #f8fafc;
        }
        .message-row {
          display: flex;
          gap: 0.75rem;
          max-width: 85%;
        }
        .user-row {
          align-self: flex-end;
          flex-direction: row-reverse;
        }
        .ai-row {
          align-self: flex-start;
        }
        .message-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .user-row .message-avatar {
          background: var(--neutral-800);
          color: #ffffff;
        }
        .ai-row .message-avatar {
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
        }
        .message-bubble-wrapper {
          display: flex;
          flex-direction: column;
        }
        .message-bubble {
          padding: 1rem 1.25rem;
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          line-height: 1.6;
          box-shadow: var(--shadow-sm);
        }
        .user-bubble {
          background: var(--primary-600);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }
        .ai-bubble {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          color: var(--neutral-800);
          border-bottom-left-radius: 4px;
        }
        .error-bubble {
          background: var(--danger-50);
          border-color: #fecaca;
          color: var(--danger-600);
        }
        .bubble-sources-panel {
          margin-top: 0.75rem;
          padding-top: 0.65rem;
          border-top: 1px solid var(--neutral-100);
        }
        .sources-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--neutral-500);
          margin-bottom: 0.35rem;
          text-transform: uppercase;
        }
        .sources-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .source-chip {
          background: var(--primary-50);
          color: var(--primary-700);
          border: 1px solid var(--primary-200);
          border-radius: var(--radius-sm);
          font-size: 0.725rem;
          padding: 0.15rem 0.45rem;
        }
        .bubble-meta {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .bubble-time {
          font-size: 0.7rem;
          color: var(--neutral-400);
        }
        .user-bubble .bubble-time {
          color: rgba(255, 255, 255, 0.75);
        }

        .feedback-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .btn-feedback {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--neutral-200);
          background: var(--neutral-50);
          color: var(--neutral-600);
          font-size: 0.725rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .btn-feedback:hover {
          background: #ffffff;
          border-color: var(--primary-300);
          color: var(--primary-600);
        }
        .feedback-submitted-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.725rem;
          color: var(--success-600);
          font-weight: 600;
        }

        /* Thinking indicator */
        .thinking-bubble {
          display: inline-flex;
          align-items: center;
          padding: 0.85rem 1.25rem;
        }
        .thinking-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .thinking-text {
          font-size: 0.85rem;
          color: var(--neutral-500);
          margin-left: 0.35rem;
        }

        /* Chat Input */
        .chat-input-bar {
          padding: 1rem 1.5rem;
          background: #ffffff;
          border-top: 1px solid var(--neutral-200);
        }
        .chat-input-form {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .chat-text-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--neutral-300);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          outline: none;
          transition: all var(--transition-fast);
        }
        .chat-text-input:focus {
          border-color: var(--primary-600);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
        .chat-send-btn {
          border-radius: var(--radius-lg);
          padding: 0.75rem 1.25rem;
        }
        .chat-disclaimer-text {
          font-size: 0.725rem;
          color: var(--neutral-400);
          display: block;
          text-align: center;
        }

        .modal-prompt-text {
          font-size: 0.875rem;
          color: var(--neutral-600);
          margin-bottom: 1rem;
        }

        @media (max-width: 600px) {
          .chat-page-container {
            height: calc(100vh - 100px);
            border-radius: 0;
            border: none;
          }
          .message-row {
            max-width: 92%;
          }
        }
      `}</style>
    </div>
  );
}
