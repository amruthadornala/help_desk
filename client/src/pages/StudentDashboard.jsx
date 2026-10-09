import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Bot,
  HelpCircle,
  Bell,
  Building2,
  BookOpen,
  History,
  Sparkles,
  ArrowRight,
  Clock,
  ChevronRight,
  TrendingUp,
  FileQuestion,
  Calendar,
  AlertCircle
} from 'lucide-react';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    questionsAsked: 0,
    totalFaqs: 0,
    totalAnnouncements: 0,
    totalDepartments: 0
  });

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [popularFaqs, setPopularFaqs] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Parallel fetch of announcements, faqs, departments, and user's chat history
        const [annRes, faqRes, deptRes, chatRes] = await Promise.all([
          api.getAnnouncements(),
          api.getFaqs(),
          api.getDepartments(),
          api.getChatHistory()
        ]);

        setRecentAnnouncements(annRes.slice(0, 3));
        setPopularFaqs(faqRes.slice(0, 4));
        setRecentChats(chatRes.slice(0, 3));

        setStats({
          questionsAsked: chatRes.length,
          totalFaqs: faqRes.length,
          totalAnnouncements: annRes.length,
          totalDepartments: deptRes.length
        });
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Ask AI Help Desk',
      desc: 'Ask any question about exams, fees, rules, or certificates',
      icon: Bot,
      color: 'blue',
      to: '/chat',
      badge: 'Interactive'
    },
    {
      title: 'Browse FAQs',
      desc: 'Verified answers to common academic & campus inquiries',
      icon: HelpCircle,
      color: 'amber',
      to: '/faqs'
    },
    {
      title: 'Announcements',
      desc: 'Latest notices regarding exams, events, and holidays',
      icon: Bell,
      color: 'emerald',
      to: '/announcements'
    },
    {
      title: 'Departments',
      desc: 'Academic blocks, HOD information, contacts & lab details',
      icon: Building2,
      color: 'purple',
      to: '/departments'
    },
    {
      title: 'Campus Info',
      desc: 'Key administrative cells, clinic hours & campus guide',
      icon: BookOpen,
      color: 'indigo',
      to: '/college-info'
    },
    {
      title: 'Chat History',
      desc: 'Review and manage your previous AI consultations',
      icon: History,
      color: 'rose',
      to: '/history'
    }
  ];

  return (
    <div className="student-dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>Virtual Student Support Center</span>
          </div>
          <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p>
            Department of <strong>{user?.department || 'Engineering'}</strong> • ID:{' '}
            <strong>{user?.student_id || 'Enrolled'}</strong>
          </p>
        </div>

        <Link to="/chat" className="btn btn-primary btn-lg prominent-chat-btn">
          <Bot size={22} />
          <span>Ask the AI Help Desk</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* Useful Statistics Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FileQuestion size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.questionsAsked}</span>
            <span className="stat-label">Questions Asked</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <HelpCircle size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.totalFaqs}</span>
            <span className="stat-label">FAQs Available</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <Bell size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.totalAnnouncements}</span>
            <span className="stat-label">New Announcements</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Building2 size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.totalDepartments}</span>
            <span className="stat-label">Available Departments</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="section-block">
        <div className="section-title-row">
          <h2>Quick Actions</h2>
          <span className="section-hint">Explore core university portals</span>
        </div>

        <div className="action-cards-grid">
          {quickActions.map((act, i) => {
            const Icon = act.icon;
            return (
              <Link key={i} to={act.to} className="action-card">
                <div className="action-card-header">
                  <div className={`action-icon-box bg-${act.color}`}>
                    <Icon size={22} />
                  </div>
                  {act.badge && <span className="badge badge-primary">{act.badge}</span>}
                </div>
                <h3>{act.title}</h3>
                <p>{act.desc}</p>
                <div className="action-card-footer">
                  <span>Open Section</span>
                  <ChevronRight size={15} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Recent Announcements & Recent Chat / Popular FAQs */}
      <div className="dashboard-grid-2">
        {/* Left Col: Announcements */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <Bell size={18} className="text-primary" />
              <h3>Recent Announcements</h3>
            </div>
            <Link to="/announcements" className="panel-link">
              View All &rarr;
            </Link>
          </div>

          <div className="announcements-mini-list">
            {recentAnnouncements.length === 0 ? (
              <p className="no-data-text">No announcements published yet.</p>
            ) : (
              recentAnnouncements.map((ann) => (
                <div key={ann.id} className="ann-item-card">
                  <div className="ann-item-top">
                    <span className="badge badge-primary">{ann.category}</span>
                    {ann.priority === 'Urgent' && <span className="badge badge-danger">Urgent</span>}
                    {ann.priority === 'High' && <span className="badge badge-warning">High</span>}
                    <span className="ann-date-text">
                      <Calendar size={13} />
                      {ann.date}
                    </span>
                  </div>
                  <h4 className="ann-item-title">{ann.title}</h4>
                  <p className="ann-item-snippet">{ann.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Popular FAQs & Recent Chat */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <HelpCircle size={18} className="text-primary" />
              <h3>Frequently Asked Questions</h3>
            </div>
            <Link to="/faqs" className="panel-link">
              All FAQs &rarr;
            </Link>
          </div>

          <div className="faqs-mini-list">
            {popularFaqs.map((faq) => (
              <div key={faq.id} className="faq-mini-item">
                <span className="faq-mini-q">{faq.question}</span>
                <Link
                  to={`/chat?initialPrompt=${encodeURIComponent(faq.question)}`}
                  className="ask-pill-btn"
                  title="Ask this question to AI"
                >
                  <Bot size={13} />
                  <span>Ask AI</span>
                </Link>
              </div>
            ))}
          </div>

          {recentChats.length > 0 && (
            <div className="recent-chats-preview-box">
              <div className="panel-title-group mb-2">
                <History size={16} className="text-neutral-500" />
                <h4 className="subpanel-title">Your Recent AI Queries</h4>
              </div>
              <div className="recent-chats-list">
                {recentChats.map((c) => (
                  <div key={c.id} className="chat-mini-preview">
                    <span className="chat-preview-q">"{c.question}"</span>
                    <span className="chat-preview-date">
                      {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .student-dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Welcome Banner */
        .welcome-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #38bdf8 100%);
          border-radius: var(--radius-xl);
          padding: 2.25rem 2.5rem;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.35);
          margin-bottom: 2rem;
        }
        .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(8px);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .welcome-text h1 {
          color: #ffffff;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .welcome-text p {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.95rem;
        }
        .prominent-chat-btn {
          background: #ffffff;
          color: var(--primary-700);
          border: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
        }
        .prominent-chat-btn:hover {
          background: #f8fafc;
          color: var(--primary-800);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        /* Stats Row */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .stat-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon-wrapper.blue { background: #dbeafe; color: #2563eb; }
        .stat-icon-wrapper.amber { background: #fef3c7; color: #d97706; }
        .stat-icon-wrapper.emerald { background: #d1fae5; color: #059669; }
        .stat-icon-wrapper.purple { background: #ede9fe; color: #7c3aed; }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--neutral-900);
          display: block;
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.8125rem;
          color: var(--neutral-500);
          font-weight: 500;
        }

        /* Section Block */
        .section-block {
          margin-bottom: 2.5rem;
        }
        .section-title-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }
        .section-hint {
          font-size: 0.875rem;
          color: var(--neutral-500);
        }

        /* Action Cards Grid */
        .action-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .action-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
          display: flex;
          flex-direction: column;
        }
        .action-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-300);
        }
        .action-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .action-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-card h3 {
          font-size: 1.125rem;
          margin-bottom: 0.35rem;
        }
        .action-card p {
          color: var(--neutral-500);
          font-size: 0.85rem;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .action-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary-600);
          padding-top: 0.75rem;
          border-top: 1px solid var(--neutral-100);
        }

        /* Dashboard 2 Column */
        .dashboard-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.75rem;
        }
        .dashboard-panel {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 1.75rem;
          box-shadow: var(--shadow-sm);
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--neutral-100);
        }
        .panel-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .panel-title-group h3 {
          font-size: 1.15rem;
        }
        .panel-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary-600);
        }

        /* Announcements Mini List */
        .announcements-mini-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .ann-item-card {
          padding: 1rem;
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
        }
        .ann-item-top {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.4rem;
        }
        .ann-date-text {
          margin-left: auto;
          font-size: 0.75rem;
          color: var(--neutral-400);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .ann-item-title {
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        .ann-item-snippet {
          font-size: 0.8125rem;
          color: var(--neutral-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* FAQs Mini List */
        .faqs-mini-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .faq-mini-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          padding: 0.75rem;
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
        }
        .faq-mini-q {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--neutral-800);
        }
        .ask-pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.6rem;
          background: var(--primary-50);
          color: var(--primary-700);
          border: 1px solid var(--primary-200);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .ask-pill-btn:hover {
          background: var(--primary-600);
          color: #ffffff;
        }

        .recent-chats-preview-box {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--neutral-200);
        }
        .subpanel-title {
          font-size: 0.9rem;
          color: var(--neutral-700);
        }
        .recent-chats-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .chat-mini-preview {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8125rem;
          color: var(--neutral-600);
          padding: 0.4rem 0.6rem;
          background: var(--neutral-100);
          border-radius: var(--radius-sm);
        }
        .chat-preview-q {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 75%;
          font-weight: 500;
        }
        .chat-preview-date {
          font-size: 0.725rem;
          color: var(--neutral-400);
        }

        @media (max-width: 992px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .dashboard-grid-2 { grid-template-columns: 1fr; }
          .welcome-banner { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .stats-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
