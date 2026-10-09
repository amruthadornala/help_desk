import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Building2, Search, User, MapPin, Phone, Mail, Bot, ArrowRight, Sparkles } from 'lucide-react';

export function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  return (
    <div className="departments-page-container">
      {/* Header Banner */}
      <div className="page-header-card">
        <div className="header-icon-box dept-box">
          <Building2 size={24} />
        </div>
        <div>
          <h2>Academic Departments & Faculty Leads</h2>
          <p>Explore engineering branches, HOD contacts, laboratory locations, and consultation hours</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="filter-controls-card">
        <form onSubmit={handleSearchSubmit} className="search-form-row">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-field"
              placeholder="Search departments by branch name, HOD, or block location (e.g. Computer Science, Dr. Robert)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Departments Grid */}
      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading college departments...</p>
        </div>
      ) : departments.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Building2 size={28} />
          </div>
          <h3>No departments found</h3>
          <p>No department matches your search term.</p>
        </div>
      ) : (
        <div className="departments-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="department-card">
              <div className="dept-card-header">
                <div className="dept-badge-icon">
                  <Building2 size={20} />
                </div>
                <h3 className="dept-name">{dept.name}</h3>
              </div>

              <p className="dept-desc">{dept.description}</p>

              <div className="dept-details-list">
                <div className="detail-item">
                  <User size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Head of Department:</span>
                    <strong className="detail-val">{dept.hod}</strong>
                  </div>
                </div>

                <div className="detail-item">
                  <MapPin size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Location:</span>
                    <span className="detail-val">{dept.location}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <Phone size={16} className="detail-icon" />
                  <div>
                    <span className="detail-label">Office Contact:</span>
                    <span className="detail-val">{dept.contact}</span>
                  </div>
                </div>

                {dept.email && (
                  <div className="detail-item">
                    <Mail size={16} className="detail-icon" />
                    <div>
                      <span className="detail-label">Official Email:</span>
                      <span className="detail-val">{dept.email}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="dept-card-footer">
                <Link
                  to={`/chat?initialPrompt=${encodeURIComponent(`Where is the ${dept.name} department and who is the HOD?`)}`}
                  className="btn btn-outline btn-sm btn-block"
                >
                  <Bot size={14} />
                  Ask AI About Department
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .departments-page-container {
          max-width: 1100px;
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

        .departments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }
        .department-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
        }
        .department-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-purple);
        }
        .dept-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .dept-badge-icon {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: #ede9fe;
          color: #7c3aed;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dept-name {
          font-size: 1.15rem;
          line-height: 1.3;
        }
        .dept-desc {
          font-size: 0.875rem;
          color: var(--neutral-600);
          line-height: 1.55;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .dept-details-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          background: var(--neutral-50);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
        }
        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.8125rem;
        }
        .detail-icon {
          color: var(--primary-600);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .detail-label {
          color: var(--neutral-500);
          display: block;
          font-size: 0.75rem;
        }
        .detail-val {
          color: var(--neutral-800);
        }
        .dept-card-footer {
          margin-top: auto;
        }
        .btn-block {
          width: 100%;
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
