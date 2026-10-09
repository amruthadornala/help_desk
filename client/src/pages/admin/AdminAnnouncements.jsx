import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bell, Plus, Search, Edit2, Trash2, X, Check, Calendar, AlertTriangle, Filter } from 'lucide-react';

export function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Exam',
    priority: 'Normal',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['Exam', 'Fee', 'Event', 'Placement', 'General'];
  const priorities = ['Urgent', 'High', 'Normal', 'Low'];

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

  const openAddModal = () => {
    setEditingAnn(null);
    setFormData({
      title: '',
      description: '',
      category: 'Exam',
      priority: 'Normal',
      date: new Date().toISOString().split('T')[0]
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (ann) => {
    setEditingAnn(ann);
    setFormData({
      title: ann.title,
      description: ann.description,
      category: ann.category,
      priority: ann.priority,
      date: ann.date
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement circular?')) {
      try {
        await api.deleteAnnouncement(id);
        setAnnouncements(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert('Failed to delete announcement: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setErrorMsg('Announcement title and description are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingAnn) {
        const res = await api.updateAnnouncement(editingAnn.id, formData);
        setAnnouncements(prev => prev.map(a => (a.id === editingAnn.id ? res.announcement : a)));
      } else {
        const res = await api.createAnnouncement(formData);
        setAnnouncements(prev => [res.announcement, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-ann-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box ann-box">
          <Bell size={24} />
        </div>
        <div>
          <h2>Manage Campus Announcements</h2>
          <p>Publish official academic notices, examination dates, and placement circulars</p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary add-btn">
          <Plus size={18} />
          <span>Publish Notice</span>
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
              placeholder="Search announcements by title or description..."
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

      {/* Announcements Table */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading campus notices...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="empty-state">
          <h3>No Announcements Found</h3>
          <p>Create a campus announcement to inform students.</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Publish Notice
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '110px' }}>Date</th>
                <th style={{ width: '100px' }}>Category</th>
                <th style={{ width: '100px' }}>Priority</th>
                <th style={{ width: '25%' }}>Notice Title</th>
                <th>Content Details</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((ann) => (
                <tr key={ann.id}>
                  <td>
                    <span className="date-subtext">{ann.date}</span>
                  </td>
                  <td>
                    <span className="badge badge-primary">{ann.category}</span>
                  </td>
                  <td>
                    {ann.priority === 'Urgent' && <span className="badge badge-danger">Urgent</span>}
                    {ann.priority === 'High' && <span className="badge badge-warning">High</span>}
                    {ann.priority === 'Normal' && <span className="badge badge-neutral">Normal</span>}
                    {ann.priority === 'Low' && <span className="badge badge-neutral">Low</span>}
                  </td>
                  <td>
                    <strong>{ann.title}</strong>
                  </td>
                  <td>
                    <p className="table-desc-preview">{ann.description}</p>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row-actions">
                      <button
                        onClick={() => openEditModal(ann)}
                        className="btn-icon"
                        title="Edit Announcement"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id)}
                        className="btn-icon text-danger"
                        title="Delete Announcement"
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
              <h3>{editingAnn ? 'Edit Campus Notice' : 'Publish New Campus Notice'}</h3>
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
                  <label className="form-label">Notice Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Schedule for End-Semester Practical Examinations"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-row-3">
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
                    <label className="form-label">Priority Level *</label>
                    <select
                      className="form-control"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notice Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Circular Content & Instructions *</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Provide complete circular details, deadlines, and student action items..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                  <span>{submitting ? 'Publishing...' : editingAnn ? 'Update Notice' : 'Publish Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-ann-page {
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
        .header-icon-box.ann-box {
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

        .table-desc-preview {
          font-size: 0.85rem;
          color: var(--neutral-600);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .date-subtext {
          font-size: 0.8125rem;
          color: var(--neutral-500);
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
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

        @media (max-width: 680px) {
          .form-row-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
