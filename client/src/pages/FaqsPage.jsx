import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Search, ChevronDown, Bot, HelpCircle, Sparkles, Filter } from 'lucide-react';

export function FaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    'All',
    'Exams',
    'Fees',
    'Attendance',
    'Certificates',
    'Library',
    'Placements',
    'College Rules',
    'Student Services',
    'Timetable',
    'Events'
  ];

  useEffect(() => {
    loadFaqs();
  }, [category]);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await api.getFaqs(category, search);
      setFaqs(data);
    } catch (err) {
      console.error('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadFaqs();
  };

  const toggleAccordion = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="faqs-page-container">
      {/* Header Banner */}
      <div className="page-header-card">
        <div className="header-icon-box">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2>Frequently Asked Questions</h2>
          <p>Instant answers to official college policies, schedules, rules, and procedures</p>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search FAQs by question or keyword (e.g. attendance, bonafide, library)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search FAQs
          </button>
        </form>

        <div className="category-pills-row">
          <span className="pills-title">
            <Filter size={14} /> Filter Category:
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

      {/* FAQs List Accordion */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading campus FAQs...</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <HelpCircle size={28} />
          </div>
          <h3>No matching FAQs found</h3>
          <p>Try clearing your search query or switching categories. You can also ask our AI Help Desk directly!</p>
          <Link to="/chat" className="btn btn-primary">
            <Bot size={16} />
            Ask AI Assistant
          </Link>
        </div>
      ) : (
        <div className="faqs-accordion-stream">
          {faqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div key={faq.id} className={`faq-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="faq-card-header" onClick={() => toggleAccordion(faq.id)}>
                  <div className="faq-title-area">
                    <span className="badge badge-primary">{faq.category}</span>
                    <h3 className="faq-question-text">{faq.question}</h3>
                  </div>
                  <ChevronDown className={`accordion-chevron ${isExpanded ? 'open' : ''}`} size={20} />
                </div>

                {isExpanded && (
                  <div className="faq-card-content">
                    <p className="faq-answer-body">{faq.answer}</p>
                    <div className="faq-card-footer-actions">
                      <span className="faq-timestamp">Updated: {new Date(faq.updated_at || faq.created_at).toLocaleDateString()}</span>
                      <Link
                        to={`/chat?initialPrompt=${encodeURIComponent(faq.question)}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Bot size={14} />
                        Ask AI Follow-up
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .faqs-page-container {
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
        .header-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
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

        /* Accordion */
        .faqs-accordion-stream {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .faq-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        .faq-card.expanded {
          border-color: var(--primary-400);
          box-shadow: var(--shadow-md);
        }
        .faq-card-header {
          padding: 1.15rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          cursor: pointer;
          background: #ffffff;
        }
        .faq-card-header:hover {
          background: var(--neutral-50);
        }
        .faq-title-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .faq-question-text {
          font-size: 1.025rem;
          font-weight: 600;
          color: var(--neutral-900);
        }
        .accordion-chevron {
          color: var(--neutral-400);
          transition: transform var(--transition-fast);
          flex-shrink: 0;
        }
        .accordion-chevron.open {
          transform: rotate(180deg);
          color: var(--primary-600);
        }
        .faq-card-content {
          padding: 1rem 1.5rem 1.25rem;
          background: #ffffff;
          border-top: 1px solid var(--neutral-100);
        }
        .faq-answer-body {
          color: var(--neutral-600);
          font-size: 0.9375rem;
          line-height: 1.65;
          margin-bottom: 1rem;
        }
        .faq-card-footer-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px dashed var(--neutral-200);
        }
        .faq-timestamp {
          font-size: 0.75rem;
          color: var(--neutral-400);
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
