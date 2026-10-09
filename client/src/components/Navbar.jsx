import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  Menu,
  X,
  User,
  ShieldCheck,
  LogOut,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="brand-icon-box">
            <GraduationCap className="brand-icon" size={24} />
            <Sparkles className="sparkle-icon" size={12} />
          </div>
          <div className="brand-text">
            <span className="brand-title">College Help Desk</span>
            <span className="brand-subtitle">AI Student Support</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-only">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/faqs" className={`nav-link ${isActive('/faqs') ? 'active' : ''}`}>
            FAQs
          </Link>
          <Link to="/announcements" className={`nav-link ${isActive('/announcements') ? 'active' : ''}`}>
            Announcements
          </Link>
          <Link to="/departments" className={`nav-link ${isActive('/departments') ? 'active' : ''}`}>
            Departments
          </Link>
          <Link to="/college-info" className={`nav-link ${isActive('/college-info') ? 'active' : ''}`}>
            Campus Info
          </Link>
        </nav>

        {/* Auth / Action CTA */}
        <div className="navbar-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link
                to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                className="btn btn-secondary btn-sm"
              >
                <LayoutDashboard size={16} />
                <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
              </Link>
              {!isAdmin && (
                <Link to="/chat" className="btn btn-primary btn-sm">
                  <MessageSquare size={16} />
                  <span>Ask AI</span>
                </Link>
              )}
              <div className="user-badge-chip">
                <span className="avatar-letter">{user?.name ? user.name[0].toUpperCase() : 'U'}</span>
                <span className="user-name-label">{user?.name}</span>
                <span className={`badge ${isAdmin ? 'badge-danger' : 'badge-primary'}`}>
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-icon" title="Sign Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Student Login
              </Link>
              <Link to="/admin/login" className="btn btn-outline btn-sm">
                <ShieldCheck size={15} />
                Admin
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
              Home
            </Link>
            <Link to="/faqs" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
              FAQs
            </Link>
            <Link to="/announcements" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
              Announcements
            </Link>
            <Link to="/departments" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
              Departments
            </Link>
            <Link to="/college-info" onClick={() => setMobileMenuOpen(false)} className="mobile-link">
              Campus Info
            </Link>

            <div className="mobile-divider" />

            {isAuthenticated ? (
              <div className="mobile-auth-section">
                <div className="mobile-user-greeting">
                  Signed in as <strong>{user?.name}</strong> ({user?.role})
                </div>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                {!isAdmin && (
                  <Link
                    to="/chat"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-primary"
                  >
                    <MessageSquare size={18} />
                    Ask AI Help Desk
                  </Link>
                )}
                <button onClick={handleLogout} className="btn btn-danger">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-section">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                  Student Login
                </Link>
                <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-outline">
                  <ShieldCheck size={18} />
                  Admin Login
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                  Create Student Account
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--neutral-200);
        }
        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .brand-icon-box {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }
        .sparkle-icon {
          position: absolute;
          top: -2px;
          right: -2px;
          color: #fbbf24;
          background: #ffffff;
          border-radius: 50%;
          padding: 1px;
        }
        .brand-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--neutral-900);
          display: block;
          line-height: 1.2;
        }
        .brand-subtitle {
          font-size: 0.75rem;
          color: var(--neutral-500);
          display: block;
        }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--neutral-600);
          padding: 0.35rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary-600);
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-profile-menu {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-badge-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.3rem 0.6rem;
          background: var(--neutral-100);
          border-radius: var(--radius-full);
          border: 1px solid var(--neutral-200);
        }
        .avatar-letter {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--primary-600);
          color: white;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .user-name-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--neutral-800);
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .auth-buttons-group {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .mobile-toggle-btn {
          background: none;
          border: none;
          color: var(--neutral-700);
          cursor: pointer;
          display: none;
        }
        .mobile-drawer {
          display: none;
          background: #ffffff;
          border-bottom: 1px solid var(--neutral-200);
          padding: 1.25rem 1.5rem;
          box-shadow: var(--shadow-lg);
        }
        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mobile-link {
          font-size: 1rem;
          font-weight: 600;
          color: var(--neutral-700);
          padding: 0.5rem 0;
        }
        .mobile-divider {
          height: 1px;
          background: var(--neutral-200);
          margin: 0.75rem 0;
        }
        .mobile-auth-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mobile-user-greeting {
          font-size: 0.875rem;
          color: var(--neutral-600);
          margin-bottom: 0.25rem;
        }

        @media (max-width: 868px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
          .mobile-drawer {
            display: block;
          }
        }
      `}</style>
    </header>
  );
}
