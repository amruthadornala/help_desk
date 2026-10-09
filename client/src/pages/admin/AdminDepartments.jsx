import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Building2, Plus, Search, Edit2, Trash2, X, Check, MapPin, Phone, Mail, User } from 'lucide-react';

export function AdminDepartments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hod: '',
    contact: '',
    email: '',
    location: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async (query = search) => {
    try {
      setLoading(true);
      const data = await api.getDepartments(query);
      setDepartments(data);
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDepartments(search);
  };

  const openAddModal = () => {
    setEditingDept(null);
    setFormData({
      name: '',
      hod: '',
      contact: '',
      email: '',
      location: '',
      description: ''
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      hod: dept.hod,
      contact: dept.contact,
      email: dept.email || '',
      location: dept.location,
      description: dept.description
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department? All associated contacts will be removed.')) {
      try {
        await api.deleteDepartment(id);
        setDepartments(prev => prev.filter(d => d.id !== id));
      } catch (err) {
        alert('Failed to delete department: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.hod.trim() || !formData.location.trim()) {
      setErrorMsg('Department Name, HOD, and Location are mandatory.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingDept) {
        const res = await api.updateDepartment(editingDept.id, formData);
        setDepartments(prev => prev.map(d => (d.id === editingDept.id ? res.department : d)));
      } else {
        const res = await api.createDepartment(formData);
        setDepartments(prev => [...prev, res.department]);
      }
      setModalOpen(false);
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-depts-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box dept-box">
          <Building2 size={24} />
        </div>
        <div>
          <h2>Manage Academic Departments</h2>
          <p>Maintain branch listings, faculty heads, contact numbers, and campus blocks</p>
        </div>

        <button onClick={openAddModal} className="btn btn-primary add-btn">
          <Plus size={18} />
          <span>Add Department</span>
        </button>
      </div>

      {/* Search */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search departments by branch name or HOD..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-secondary">Search</button>
        </form>
      </div>

      {/* Departments Table */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <h3>No Departments Found</h3>
          <p>Add your college's academic departments to populate the directory.</p>
          <button onClick={openAddModal} className="btn btn-primary">
            <Plus size={16} /> Add Department
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Department</th>
                <th>Head of Department (HOD)</th>
                <th>Location / Block</th>
                <th>Contact</th>
                <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td>
                    <strong>{dept.name}</strong>
                    <span className="table-desc-preview">{dept.description}</span>
                  </td>
                  <td>
                    <div className="table-meta-text">
                      <User size={13} className="text-primary" />
                      <span>{dept.hod}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-meta-text">
                      <MapPin size={13} className="text-amber" />
                      <span>{dept.location}</span>
                    </div>
                  </td>
                  <td>
                    <div className="table-meta-text">
                      <Phone size={13} className="text-emerald" />
                      <span>{dept.contact}</span>
                    </div>
                    {dept.email && (
                      <div className="table-meta-text">
                        <Mail size={13} className="text-indigo" />
                        <span className="email-subtext">{dept.email}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="row-actions">
                      <button
                        onClick={() => openEditModal(dept)}
                        className="btn-icon"
                        title="Edit Department"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="btn-icon text-danger"
                        title="Delete Department"
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
              <h3>{editingDept ? 'Edit Department Details' : 'Add New Department'}</h3>
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
                  <label className="form-label">Department Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Computer Science and Engineering"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">HOD Name & Designation *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dr. Robert Vance, Ph.D."
                      value={formData.hod}
                      onChange={(e) => setFormData(prev => ({ ...prev, hod: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / Block *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Tech Block A, 3rd Floor"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Contact Phone *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. +1 (555) 019-2831"
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="e.g. cse.hod@college.edu"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department Description *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Describe laboratory resources, core specializations, and student facilities..."
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
                  <span>{submitting ? 'Saving...' : editingDept ? 'Update Department' : 'Save Department'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .admin-depts-page {
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
        .header-icon-box.dept-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #7c3aed, #8b5cf6);
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

        .table-desc-preview {
          display: block;
          font-size: 0.775rem;
          color: var(--neutral-500);
          max-width: 280px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 2px;
        }
        .table-meta-text {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          color: var(--neutral-700);
        }
        .email-subtext {
          font-size: 0.75rem;
          color: var(--neutral-400);
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
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

        @media (max-width: 600px) {
          .form-row-2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
