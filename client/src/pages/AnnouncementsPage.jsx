import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, Calendar, Search, Filter, AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', 'Exam', 'Fee', 'Event', 'Placement', 'General'];

  useEffect(() => {
    loadAnnouncements();
  }, [category]);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnouncements(category, search);
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAnnouncements();
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="badge badge-danger">
            <AlertTriangle size={12} /> Urgent
          </span>
        );
      case 'High':
        return (
          <span className="badge badge-warning">
            <AlertCircle size={12} /> High Priority
          </span>
        );
      case 'Low':
        return <span className="badge badge-neutral">Notice</span>;
      default:
        return <span className="badge badge-primary">Standard</span>;
    }
  };

  return (
    <div className="announcements-page-container">
      {/* Header Banner */}
      <div className="page-header-card">
        <div className="header-icon-box bell-box">
          <Bell size={24} />
        </div>
        <div>
          <h2>Official College Announcements</h2>
          <p>Real-time campus circulars, exam dates, placement notices, and academic schedules</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search circulars by title or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="category-pills-row">
          <span className="pills-title">
            <Filter size={14} /> Filter Notice:
          </span>
          <div className="pills-list">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements Stream */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading latest announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Bell size={28} />
          </div>
          <h3>No announcements found</h3>
          <p>No circulars matching your current filter criteria.</p>
        </div>
      ) : (
        <div className="announcements-stream">
          {announcements.map((ann) => (
            <div key={ann.id} className={`announcement-post-card ${ann.priority === 'Urgent' ? 'urgent-border' : ''}`}>
              <div className="post-header-strip">
                <div className="post-meta-badges">
                  <span className="badge badge-primary">{ann.category}</span>
                  {getPriorityBadge(ann.priority)}
                </div>
                <div className="post-date-indicator">
                  <Calendar size={14} />
                  <span>{ann.date}</span>
                </div>
              </div>

              <h3 className="post-title">{ann.title}</h3>
              <p className="post-body-text">{ann.description}</p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .announcements-page-container {
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
        .header-icon-box.bell-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #059669, #10b981);
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
          margin-bottom: 1rem;
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

        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          overflow-x: auto;
          padding-top: 0.5rem;
          border-top: 1px solid var(--neutral-100);
        }
        .pills-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--neutral-500);
          white-space: nowrap;
          text-transform: uppercase;
        }
        .pills-list {
          display: flex;
          gap: 0.45rem;
          overflow-x: auto;
          white-space: nowrap;
        }
        .category-pill {
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--neutral-200);
          background: var(--neutral-50);
          font-size: 0.8125rem;
          color: var(--neutral-700);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .category-pill:hover {
          background: var(--neutral-100);
          border-color: var(--neutral-300);
        }
        .category-pill.active {
          background: var(--primary-600);
          color: #ffffff;
          border-color: var(--primary-600);
          font-weight: 600;
        }

        /* Stream */
        .announcements-stream {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .announcement-post-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal);
        }
        .announcement-post-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .urgent-border {
          border-left: 5px solid var(--danger-500);
        }
        .post-header-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .post-meta-badges {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .post-date-indicator {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8125rem;
          color: var(--neutral-500);
          font-weight: 500;
        }
        .post-title {
          font-size: 1.2rem;
          margin-bottom: 0.65rem;
          color: var(--neutral-900);
        }
        .post-body-text {
          font-size: 0.9375rem;
          line-height: 1.65;
          color: var(--neutral-600);
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
