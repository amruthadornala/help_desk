import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, Building, Hash, Calendar, Award, CheckCircle2, Save, AlertCircle } from 'lucide-react';

export function ProfilePage() {
  const { user, updateUserProfile } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    student_id: user?.student_id || '',
    department: user?.department || 'Computer Science and Engineering',
    questions_asked: 0,
    created_at: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfileData(data);
    } catch (err) {
      console.warn('Could not load extra profile data:', err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!profileData.name.trim()) {
      setErrorMsg('Full name cannot be blank.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.updateProfile({
        name: profileData.name.trim(),
        department: profileData.department,
        student_id: profileData.student_id ? profileData.student_id.trim() : null
      });

      updateUserProfile(res.user);
      setSuccessMsg('Your student profile has been updated successfully.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page-container">
      {/* Header Profile Card */}
      <div className="profile-header-card">
        <div className="profile-avatar-large">
          {profileData.name ? profileData.name[0].toUpperCase() : 'S'}
        </div>
        <div className="profile-header-meta">
          <h2>{profileData.name}</h2>
          <p>{profileData.email}</p>
          <div className="profile-badges-row">
            <span className="badge badge-primary">
              <Award size={12} /> {profileData.role === 'admin' ? 'Administrator' : 'Student'}
            </span>
            <span className="badge badge-neutral">{profileData.department}</span>
          </div>
        </div>

        <div className="profile-stat-box">
          <span className="stat-number">{profileData.questions_asked || 0}</span>
          <span className="stat-text">AI Questions Asked</span>
        </div>
      </div>

      {/* Edit Form */}
      <div className="profile-form-card">
        <h3>Edit Student Profile Details</h3>
        <p className="form-subtext">Update your registered name, academic branch, or student admission number</p>

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdate} className="profile-edit-form">
          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-control with-icon"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">College Email (Read Only)</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-control with-icon"
                  value={profileData.email}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="form-label">Student ID / Roll No.</label>
              <div className="input-with-icon">
                <Hash className="input-icon" size={18} />
                <input
                  type="text"
                  className="form-control with-icon"
                  placeholder="e.g. CS2024-042"
                  value={profileData.student_id || ''}
                  onChange={(e) => setProfileData(prev => ({ ...prev, student_id: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Department</label>
              <div className="input-with-icon">
                <Building className="input-icon" size={18} />
                <select
                  className="form-control with-icon"
                  value={profileData.department}
                  onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                >
                  <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
                  <option value="Electrical and Electronics Engineering">Electrical and Electronics Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="General Engineering">General / Administration</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-footer-action">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .profile-page-container {
          max-width: 860px;
          margin: 0 auto;
        }
        .profile-header-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-sm);
        }
        .profile-avatar-large {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          font-size: 2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .profile-header-meta {
          flex: 1;
        }
        .profile-header-meta h2 {
          font-size: 1.6rem;
          margin-bottom: 0.2rem;
        }
        .profile-header-meta p {
          color: var(--neutral-500);
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .profile-badges-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .profile-stat-box {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1rem 1.5rem;
          text-align: center;
        }
        .stat-number {
          font-size: 1.75rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--primary-600);
          display: block;
          line-height: 1.1;
        }
        .stat-text {
          font-size: 0.75rem;
          color: var(--neutral-500);
          font-weight: 600;
          text-transform: uppercase;
        }

        .profile-form-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
        }
        .profile-form-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
        }
        .form-subtext {
          color: var(--neutral-500);
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--neutral-400);
          pointer-events: none;
        }
        .form-control.with-icon {
          padding-left: 2.5rem;
        }
        .form-footer-action {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 640px) {
          .profile-header-card {
            flex-direction: column;
            text-align: center;
          }
          .profile-badges-row {
            justify-content: center;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
