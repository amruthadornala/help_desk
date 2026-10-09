import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { UserPlus, User, Mail, Lock, Building, Hash, ArrowRight, AlertCircle } from 'lucide-react';

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    student_id: '',
    department: 'Computer Science and Engineering'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid college email address.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        student_id: formData.student_id.trim() || null,
        department: formData.department
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <div className="auth-card-container">
        <div className="auth-card wide">
          <div className="auth-card-header">
            <div className="auth-icon-badge">
              <UserPlus size={28} />
            </div>
            <h2>Student Registration</h2>
            <p>Join the AI-Powered College Help Desk network</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    name="name"
                    className="form-control with-icon"
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">College Email *</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    name="email"
                    className="form-control with-icon"
                    placeholder="alex@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
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
                    name="student_id"
                    className="form-control with-icon"
                    placeholder="e.g. CS2024-042"
                    value={formData.student_id}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <div className="input-with-icon">
                  <Building className="input-icon" size={18} />
                  <select
                    name="department"
                    className="form-control with-icon"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics and Communication Engineering">Electronics & Communication</option>
                    <option value="Electrical and Electronics Engineering">Electrical & Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="General Engineering">General / First Year</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Password (min 6 chars) *</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    name="password"
                    className="form-control with-icon"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <div className="input-with-icon">
                  <Lock className="input-icon" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control with-icon"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Complete Student Registration'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-card-footer">
            <p>
              Already registered? <Link to="/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .auth-page-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #f1f5f9 0%, #ffffff 100%);
        }
        .auth-card-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }
        .auth-card.wide {
          width: 100%;
          max-width: 600px;
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: 2.25rem;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .auth-card-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .auth-icon-badge {
          width: 54px;
          height: 54px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .auth-card-header h2 {
          font-size: 1.6rem;
          margin-bottom: 0.35rem;
        }
        .auth-card-header p {
          color: var(--neutral-500);
          font-size: 0.875rem;
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
        .btn-block {
          width: 100%;
          margin-top: 0.5rem;
        }
        .auth-card-footer {
          margin-top: 1.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--neutral-100);
          text-align: center;
          font-size: 0.875rem;
        }
        .auth-card-footer a {
          color: var(--primary-600);
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
