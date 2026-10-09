import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Search, Mail, Hash, Building, Calendar, HelpCircle } from 'lucide-react';

export function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getAllStudents();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      (s.student_id && s.student_id.toLowerCase().includes(q)) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  });

  return (
    <div className="admin-students-page">
      <div className="admin-page-header">
        <div className="header-icon-box users-icon">
          <Users size={24} />
        </div>
        <div>
          <h2>Registered College Students</h2>
          <p>Directory of students enrolled in the College Help Desk portal</p>
        </div>
      </div>

      <div className="filter-controls-card">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search student by name, email, roll number, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <div className="typing-dot"></div>
          <p className="mt-2">Loading students directory...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Users size={28} />
          </div>
          <h3>No students found</h3>
          <p>No student accounts match your search filter.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission / Roll No</th>
                <th>Department</th>
                <th>Inquiries Asked</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="student-profile-cell">
                      <div className="student-avatar-circle">
                        {s.name ? s.name[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <strong>{s.name}</strong>
                        <span className="student-email-sub">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-neutral">
                      {s.student_id || 'Not Assigned'}
                    </span>
                  </td>
                  <td>{s.department || 'General'}</td>
                  <td>
                    <span className="badge badge-primary">
                      {s.questions_asked} Questions
                    </span>
                  </td>
                  <td>
                    <span className="date-subtext">
                      {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-students-page {
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
        .header-icon-box.users-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--primary-600), var(--primary-800));
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

        .filter-controls-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.75rem;
          box-shadow: var(--shadow-sm);
        }
        .search-input-wrapper {
          position: relative;
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

        .student-profile-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .student-avatar-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .student-email-sub {
          display: block;
          font-size: 0.75rem;
          color: var(--neutral-400);
        }
        .date-subtext {
          font-size: 0.8125rem;
          color: var(--neutral-500);
        }
        .mt-2 { margin-top: 0.5rem; }
      `}</style>
    </div>
  );
}
