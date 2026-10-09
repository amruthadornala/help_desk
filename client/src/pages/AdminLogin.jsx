import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password, 'admin');
      if (user.role !== 'admin') {
        setError('This account does not have administrator privileges. Please use Student Login.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminDemo = () => {
    setEmail('admin@college.edu');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="admin-login-wrapper">
      <Navbar />

      <div className="auth-card-container">
        <div className="auth-card admin-theme">
          <div className="auth-card-header">
            <div className="auth-icon-badge admin-badge">
              <ShieldCheck size={30} />
            </div>
            <h2>Campus Administrator Login</h2>
            <p>Access management controls, knowledge base, and analytics</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Administrator Email</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="admin@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Security Password</label>
              <div className="input-with-icon">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  className="form-control with-icon"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Admin Console'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="demo-credentials-box">
            <div className="demo-header">
              <Sparkles size={15} className="text-amber" />
              <span>Viva / Review Admin Demo</span>
            </div>
            <p className="demo-desc">
              Test administrative management immediately with 1-click credentials:
            </p>
            <button type="button" onClick={fillAdminDemo} className="btn btn-secondary btn-sm btn-block">
              <KeyRound size={14} />
              Prefill Admin: admin@college.edu
            </button>
          </div>

          <div className="auth-card-footer">
            <p>
              Are you a student? <Link to="/login">Switch to Student Login &rarr;</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .admin-login-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%);
        }
        .auth-card-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }
        .auth-card {
          width: 100%;
          max-width: 450px;
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: 2.25rem 2rem;
        }
        .admin-theme {
          border-top: 4px solid var(--danger-500);
        }
        .admin-badge {
          background: linear-gradient(135deg, #ef4444, #b91c1c) !important;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3) !important;
        }
        .auth-card-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .auth-icon-badge {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .auth-card-header h2 {
          font-size: 1.55rem;
          margin-bottom: 0.35rem;
        }
        .auth-card-header p {
          color: var(--neutral-500);
          font-size: 0.85rem;
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
        }
        .form-control.with-icon {
          padding-left: 2.5rem;
        }
        .btn-block {
          width: 100%;
        }
        .demo-credentials-box {
          margin-top: 1.5rem;
          padding: 1rem;
          background: var(--neutral-50);
          border: 1px dashed var(--neutral-300);
          border-radius: var(--radius-md);
        }
        .demo-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--neutral-800);
          margin-bottom: 0.25rem;
        }
        .text-amber { color: var(--warning-500); }
        .demo-desc {
          font-size: 0.775rem;
          color: var(--neutral-500);
          margin-bottom: 0.75rem;
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
      `}</style>
    </div>
  );
}
