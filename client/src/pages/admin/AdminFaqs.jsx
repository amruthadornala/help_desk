import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { HelpCircle, Plus, Search, Edit2, Trash2, X, Check, Filter } from 'lucide-react';

export function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Exams'
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = [
    'Exams',
    'Fees',
    'Attendance',
    'Certificates',
    'Library',
    'Placements',
    'College Rules',
    'Student Services',
    'Timetable',
    'Events',
    'Departments'
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

  const openAddModal = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '', category: 'Exams' });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this FAQ?')) {
      try {
        await api.deleteFaq(id);
        setFaqs(prev => prev.filter(f => f.id !== id));
      } catch (err) {
        alert('Failed to delete FAQ: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.question.trim() || !formData.answer.trim()) {
      setErrorMsg('Both question and answer fields are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingFaq) {
        const res = await api.updateFaq(editingFaq.id, formData);
        setFaqs(prev => prev.map(f => (f.id === editingFaq.id ? res.faq : f)));
      } else {
        const res = await api.createFaq(formData);
        setFaqs(prev => [res.faq, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-faqs-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box faq-box">
          <HelpCircle size={24} />
        </div>
        <div>
          <h2>Manage Frequently Asked Questions</h2>
          <p>Add, edit, and organize official question-and-answer records</p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary add-btn">
          <Plus size={18} />
          <span>Add New FAQ</span>
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
              placeholder="Search FAQs by question or answer..."
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

      {/* Table of FAQs */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading FAQ records...</p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="empty-state">
          <h3>No FAQs Found</h3>
          <p>Create your first FAQ to help students quickly.</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add FAQ
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>Category</th>
                <th style={{ width: '30%' }}>Question</th>
                <th>Answer Details</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq.id}>
                  <td>
                    <span className="badge badge-primary">{faq.category}</span>
                  </td>
                  <td>
                    <strong>{faq.question}</strong>
                  </td>
                  <td>
                    <p className="table-answer-preview">{faq.answer}</p>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row-actions">
                      <button
                        onClick={() => openEditModal(faq)}
                        className="btn-icon"
                        title="Edit FAQ"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(faq.id)}
                        className="btn-icon text-danger"
                        title="Delete FAQ"
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

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingFaq ? 'Edit FAQ Entry' : 'Create New FAQ Entry'}</h3>
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
                  <label className="form-label">Question *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. What is the minimum attendance requirement?"
                    value={formData.question}
                    onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Answer Details *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Provide a clear, step-by-step verified answer..."
                    value={formData.answer}
                    onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
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
                  <span>{submitting ? 'Saving...' : editingFaq ? 'Update FAQ' : 'Save FAQ'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-faqs-page {
          max-width: 1200px;
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
        .header-icon-box.faq-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #d97706, #f59e0b);
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
          background: var(--primary-600);
          color: #ffffff;
          border-color: var(--primary-600);
        }

        .table-answer-preview {
          font-size: 0.85rem;
          color: var(--neutral-600);
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
