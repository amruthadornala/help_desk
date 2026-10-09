import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Database, Plus, Search, Edit2, Trash2, X, Check, Filter, Sparkles, Tag } from 'lucide-react';

export function AdminKnowledge() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Exams',
    keywords: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    'Exams',
    'Fees',
    'Attendance',
    'Departments',
    'Faculty',
    'Library',
    'Certificates',
    'Placements',
    'Events',
    'Timetable',
    'College Rules',
    'Student Services'
  ];

  useEffect(() => {
    loadKnowledge();
  }, [category]);

  const loadKnowledge = async () => {
    try {
      setLoading(true);
      const data = await api.getKnowledge(category, search);
      setEntries(data);
    } catch (err) {
      console.error('Failed to load knowledge entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadKnowledge();
  };

  const openAddModal = () => {
    setEditingEntry(null);
    setFormData({ title: '', content: '', category: 'Exams', keywords: '' });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (kb) => {
    setEditingEntry(kb);
    setFormData({
      title: kb.title,
      content: kb.content,
      category: kb.category,
      keywords: kb.keywords || ''
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this knowledge base entry? The AI chatbot will no longer use this data for queries.')) {
      try {
        await api.deleteKnowledge(id);
        setEntries(prev => prev.filter(e => e.id !== id));
      } catch (err) {
        alert('Failed to delete KB entry: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setErrorMsg('Title and Content fields are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingEntry) {
        const res = await api.updateKnowledge(editingEntry.id, formData);
        setEntries(prev => prev.map(e => (e.id === editingEntry.id ? res.entry : e)));
      } else {
        const res = await api.createKnowledge(formData);
        setEntries(prev => [res.entry, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-kb-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box kb-box">
          <Database size={24} />
        </div>
        <div>
          <h2>Manage Chatbot Knowledge Base</h2>
          <p>Grounding source for AI responses: Keep college policies, rules, and procedures updated</p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary add-btn">
          <Plus size={18} />
          <span>Add Knowledge Item</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search knowledge items by title, keywords, or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>

        <div className="category-pills-row">
          <span className="pills-title"><Filter size={14} /> Category:</span>
          <div className="pills-list">
            <button
              className={`category-pill ${category === 'All' ? 'active' : ''}`}
              onClick={() => setCategory('All')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-pill ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Knowledge Base Table */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading knowledge base records...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="empty-state">
          <h3>No Knowledge Base Entries Found</h3>
          <p>Add official articles to power AI chatbot responses.</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add Entry
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Category</th>
                <th style={{ width: '25%' }}>Document Title</th>
                <th>Verified Content</th>
                <th style={{ width: '15%' }}>Keywords</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="badge badge-primary">{item.category}</span>
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                  </td>
                  <td>
                    <p className="table-content-preview">{item.content}</p>
                  </td>
                  <td>
                    <span className="table-keywords-text">{item.keywords || 'None'}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row-actions">
                      <button
                        onClick={() => openEditModal(item)}
                        className="btn-icon"
                        title="Edit Entry"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn-icon text-danger"
                        title="Delete Entry"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingEntry ? 'Edit Knowledge Base Record' : 'Create Knowledge Base Record'}</h3>
              <button onClick={() => setModalOpen(false)} className="btn-icon">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div className="alert alert-error">
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Article / Policy Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. End-Semester Examination Guidelines & Hall Ticket Policy"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Search Keywords (comma or space separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. hall ticket, exam dates, mid sem, end sem, test"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Verified College Content & Rules *</label>
                  <textarea
                    className="form-control"
                    rows={6}
                    placeholder="Provide exact facts, room numbers, dates, contacts, and step-by-step procedures..."
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  <Check size={16} />
                  <span>{submitting ? 'Saving...' : editingEntry ? 'Update Knowledge' : 'Save Knowledge'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-kb-page {
          max-width: 1240px;
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
        .header-icon-box.kb-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
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
        .add-btn {
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

        .category-pills-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          overflow-x: auto;
          padding-top: 0.5rem;
          border-top: 1px solid var(--neutral-100);
        }
        .pills-title {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--neutral-500);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          text-transform: uppercase;
        }
        .pills-list {
          display: flex;
          gap: 0.4rem;
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
        .category-pill.active {
          background: var(--accent-indigo);
          color: #ffffff;
          border-color: var(--accent-indigo);
        }

        .table-content-preview {
          font-size: 0.85rem;
          color: var(--neutral-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .table-keywords-text {
          font-size: 0.75rem;
          color: var(--neutral-400);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .row-actions {
          display: inline-flex;
          gap: 0.35rem;
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
