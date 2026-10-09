import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Users,
  HelpCircle,
  MessageSquareQuote,
  Bell,
  Database,
  ThumbsUp,
  Building2,
  TrendingUp,
  PlusCircle,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="empty-state">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <p className="mt-2">Aggregating campus administrative metrics...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      {/* Top Banner */}
      <div className="admin-hero-banner">
        <div className="admin-hero-text">
          <div className="admin-badge-strip">
            <ShieldCheck size={14} />
            <span>Central Campus Administrator Console</span>
          </div>
          <h1>System Overview & Live Insights</h1>
          <p>Real-time analytics across knowledge repositories, student inquiries, and campus circulars</p>
        </div>

        <div className="quick-actions-strip">
          <Link to="/admin/faqs" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} /> Add FAQ
          </Link>
          <Link to="/admin/knowledge" className="btn btn-secondary btn-sm">
            <PlusCircle size={15} /> Add KB Entry
          </Link>
          <Link to="/admin/announcements" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Publish Notice
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-icon blue"><Users size={22} /></div>
          <div className="metric-content">
            <span className="metric-digit">{stats.total_students}</span>
            <span className="metric-title">Enrolled Students</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon amber"><HelpCircle size={22} /></div>
          <div className="metric-content">
            <span className="metric-digit">{stats.total_faqs}</span>
            <span className="metric-title">Published FAQs</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon purple"><Database size={22} /></div>
          <div className="metric-content">
            <span className="metric-digit">{stats.total_knowledge}</span>
            <span className="metric-title">Knowledge Base Records</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon indigo"><MessageSquareQuote size={22} /></div>
          <div className="metric-content">
            <span className="metric-digit">{stats.total_questions}</span>
            <span className="metric-title">AI Questions Answered</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon emerald"><Bell size={22} /></div>
          <div className="metric-content">
            <span className="metric-digit">{stats.total_announcements}</span>
            <span className="metric-title">Active Announcements</span>
          </div>
        </div>

        <div className="metric-box">
          <div className="metric-icon rose"><ThumbsUp size={22} /></div>
          <div className="metric-content">
            <span className="metric-digit">{stats.feedback.satisfaction_rate}%</span>
            <span className="metric-title">Student Satisfaction ({stats.feedback.total} ratings)</span>
          </div>
        </div>
      </div>

      {/* 2 Column Section: Recent Student Questions & Recent Announcements */}
      <div className="admin-grid-2">
        {/* Left Column: Recent Student Questions */}
        <div className="admin-panel-card">
          <div className="panel-top-row">
            <div className="panel-title-with-icon">
              <MessageSquareQuote size={18} className="text-primary" />
              <h3>Recent Student Inquiries</h3>
            </div>
            <Link to="/admin/questions" className="panel-link">
              View All Questions &rarr;
            </Link>
          </div>

          <div className="questions-stream">
            {stats.recent_questions.length === 0 ? (
              <p className="no-data-hint">No questions recorded yet.</p>
            ) : (
              stats.recent_questions.map((q) => (
                <div key={q.id} className="admin-question-item">
                  <div className="question-user-meta">
                    <strong>{q.student_name || 'Student'}</strong>
                    <span className="dept-tag">({q.student_department || 'General'})</span>
                    <span className="q-time">
                      {new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="q-text">"{q.question}"</p>
                  <p className="q-ans-preview">{q.answer}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Announcements & FAQ Category Breakdown */}
        <div className="admin-right-column">
          <div className="admin-panel-card mb-4">
            <div className="panel-top-row">
              <div className="panel-title-with-icon">
                <Bell size={18} className="text-emerald" />
                <h3>Active Announcements</h3>
              </div>
              <Link to="/admin/announcements" className="panel-link">
                Manage &rarr;
              </Link>
            </div>

            <div className="announcements-admin-list">
              {stats.recent_announcements.map((ann) => (
                <div key={ann.id} className="admin-ann-row">
                  <div>
                    <span className="ann-row-title">{ann.title}</span>
                    <div className="ann-row-meta">
                      <span className="badge badge-primary">{ann.category}</span>
                      <span className="ann-date">{ann.date}</span>
                    </div>
                  </div>
                  {ann.priority === 'Urgent' && <span className="badge badge-danger">Urgent</span>}
                  {ann.priority === 'High' && <span className="badge badge-warning">High</span>}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Category Breakdown */}
          <div className="admin-panel-card">
            <div className="panel-top-row">
              <div className="panel-title-with-icon">
                <HelpCircle size={18} className="text-amber" />
                <h3>FAQ Category Breakdown</h3>
              </div>
              <Link to="/admin/faqs" className="panel-link">
                All FAQs &rarr;
              </Link>
            </div>

            <div className="category-counts-list">
              {stats.faq_categories.map((c, idx) => (
                <div key={idx} className="category-count-row">
                  <span className="cat-name">{c.category}</span>
                  <span className="badge badge-neutral">{c.count} FAQs</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard-container {
          max-width: 1240px;
          margin: 0 auto;
        }

        .admin-hero-banner {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #334155 100%);
          color: #ffffff;
          border-radius: var(--radius-xl);
          padding: 2rem 2.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-lg);
        }
        .admin-badge-strip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.12);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #cbd5e1;
        }
        .admin-hero-text h1 {
          color: #ffffff;
          font-size: 1.85rem;
          margin-bottom: 0.25rem;
        }
        .admin-hero-text p {
          color: #94a3b8;
          font-size: 0.875rem;
        }
        .quick-actions-strip {
          display: flex;
          gap: 0.65rem;
          flex-shrink: 0;
          flex-wrap: wrap;
        }

        /* Metrics */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2.25rem;
        }
        .metric-box {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
        }
        .metric-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .metric-icon.blue { background: #dbeafe; color: #2563eb; }
        .metric-icon.amber { background: #fef3c7; color: #d97706; }
        .metric-icon.purple { background: #ede9fe; color: #7c3aed; }
        .metric-icon.indigo { background: #e0e7ff; color: #4f46e5; }
        .metric-icon.emerald { background: #d1fae5; color: #059669; }
        .metric-icon.rose { background: #ffe4e6; color: #e11d48; }

        .metric-digit {
          font-size: 1.6rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--neutral-900);
          display: block;
          line-height: 1.1;
        }
        .metric-title {
          font-size: 0.75rem;
          color: var(--neutral-500);
          font-weight: 600;
        }

        /* Grid 2 */
        .admin-grid-2 {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 1.75rem;
        }
        .admin-panel-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .panel-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--neutral-100);
          margin-bottom: 1rem;
        }
        .panel-title-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .panel-title-with-icon h3 {
          font-size: 1.15rem;
        }
        .panel-link {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--primary-600);
        }

        /* Question items */
        .questions-stream {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .admin-question-item {
          padding: 0.85rem;
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
        }
        .question-user-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          margin-bottom: 0.25rem;
        }
        .dept-tag {
          color: var(--neutral-500);
        }
        .q-time {
          margin-left: auto;
          color: var(--neutral-400);
        }
        .q-text {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-900);
          margin-bottom: 0.25rem;
        }
        .q-ans-preview {
          font-size: 0.8rem;
          color: var(--neutral-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Announcements */
        .announcements-admin-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .admin-ann-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: var(--neutral-50);
          border-radius: var(--radius-md);
          border: 1px solid var(--neutral-200);
        }
        .ann-row-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--neutral-800);
          display: block;
          margin-bottom: 0.2rem;
        }
        .ann-row-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ann-date {
          font-size: 0.725rem;
          color: var(--neutral-400);
        }

        /* Categories */
        .category-counts-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .category-count-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0.75rem;
          background: var(--neutral-50);
          border-radius: var(--radius-sm);
        }
        .cat-name {
          font-size: 0.8125rem;
          color: var(--neutral-700);
          font-weight: 500;
        }

        .mb-4 { margin-bottom: 1.5rem; }
        .no-data-hint {
          color: var(--neutral-400);
          font-size: 0.85rem;
          text-align: center;
          padding: 1rem 0;
        }

        @media (max-width: 900px) {
          .admin-hero-banner { flex-direction: column; align-items: flex-start; }
          .admin-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
