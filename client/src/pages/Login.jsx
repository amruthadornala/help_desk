import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillStudentDemo = () => {
    setEmail('student@college.edu');
    setPassword('demo1234');
    setError('');
  };

  return (
    <div className="auth-page-wrapper">
      <Navbar />

      <div className="auth-card-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon-badge">
              <GraduationCap size={28} />
            </div>
            <h2>Student Portal Login</h2>
            <p>Access your AI Help Desk, academic history, and notices</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">College Email Address</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-control with-icon"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
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
              {loading ? 'Signing in...' : 'Sign In to Student Portal'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Quick Demo Fill Pill */}
          <div className="demo-credentials-box">
            <div className="demo-header">
              <Sparkles size={15} className="text-amber" />
              <span>Demo / Viva Mode — Any Email Works!</span>
            </div>
            <p className="demo-desc">
              Enter <strong>any email</strong> and <strong>any password</strong> to log in. Or click below for a quick fill.
            </p>
            <button type="button" onClick={fillStudentDemo} className="btn btn-secondary btn-sm btn-block">
              <KeyRound size={14} />
              Quick Fill: student@college.edu
            </button>
          </div>

          <div className="auth-card-footer">
            <p>
              New student? <Link to="/register">Create an account</Link>
            </p>
            <p className="admin-switch-text">
              College Faculty or Admin? <Link to="/admin/login">Admin Login &rarr;</Link>
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
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          padding: 2.25rem 2rem;
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
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
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
        .admin-switch-text {
          margin-top: 0.5rem;
          font-size: 0.8125rem;
          color: var(--neutral-500);
        }
      `}</style>
    </div>
  );
}
