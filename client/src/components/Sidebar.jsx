import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Bot,
  HelpCircle,
  Bell,
  Building2,
  BookOpen,
  History,
  User,
  LogOut,
  Users,
  Database,
  MessageSquareQuote,
  ThumbsUp,
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export function Sidebar({ mode = 'student' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/chat', label: 'AI Help Desk', icon: Bot, highlight: true },
    { to: '/faqs', label: 'FAQs', icon: HelpCircle },
    { to: '/announcements', label: 'Announcements', icon: Bell },
    { to: '/departments', label: 'Departments', icon: Building2 },
    { to: '/college-info', label: 'Campus Info', icon: BookOpen },
    { to: '/history', label: 'Chat History', icon: History },
    { to: '/profile', label: 'My Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/faqs', label: 'Manage FAQs', icon: HelpCircle },
    { to: '/admin/knowledge', label: 'Knowledge Base', icon: Database, highlight: true },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/announcements', label: 'Announcements', icon: Bell },
    { to: '/admin/questions', label: 'Chat Questions', icon: MessageSquareQuote },
    { to: '/admin/feedback', label: 'Student Feedback', icon: ThumbsUp },
    { to: '/admin/settings', label: 'System & Viva', icon: Settings },
  ];

  const links = mode === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-role-badge">
          {mode === 'admin' ? (
            <>
              <ShieldCheck size={16} className="text-danger" />
              <span>Admin Portal</span>
            </>
          ) : (
            <>
              <User size={16} className="text-primary" />
              <span>Student Portal</span>
            </>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin/dashboard'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${item.highlight ? 'link-highlight' : ''}`
              }
            >
              <div className="sidebar-link-content">
                <Icon size={18} className="sidebar-icon" />
                <span className="sidebar-label">{item.label}</span>
              </div>
              <ChevronRight size={14} className="sidebar-chevron" />
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="user-avatar-circle">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="user-meta-info">
            <span className="user-display-name">{user?.name || 'User'}</span>
            <span className="user-email-text">{user?.email}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="sidebar-logout-btn">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .dashboard-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: #ffffff;
          border-right: 1px solid var(--neutral-200);
          display: flex;
          flex-direction: column;
          min-height: calc(100vh - 65px);
          padding: 1.25rem 0.85rem;
        }
        .sidebar-header {
          padding: 0 0.5rem 1rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--neutral-100);
        }
        .sidebar-role-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--neutral-600);
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          border-radius: var(--radius-md);
          color: var(--neutral-600);
          font-size: 0.9375rem;
          font-weight: 500;
          transition: all var(--transition-fast);
        }
        .sidebar-link-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sidebar-chevron {
          opacity: 0;
          transition: opacity var(--transition-fast);
          color: var(--neutral-400);
        }
        .sidebar-link:hover {
          background: var(--neutral-100);
          color: var(--neutral-900);
        }
        .sidebar-link:hover .sidebar-chevron {
          opacity: 1;
        }
        .sidebar-link.active {
          background: var(--primary-50);
          color: var(--primary-700);
          font-weight: 600;
        }
        .sidebar-link.active .sidebar-icon {
          color: var(--primary-600);
        }
        .sidebar-link.active .sidebar-chevron {
          opacity: 1;
          color: var(--primary-600);
        }
        .link-highlight {
          position: relative;
        }
        .sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--neutral-200);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .user-mini-card {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem;
          border-radius: var(--radius-md);
          background: var(--neutral-50);
        }
        .user-avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          flex-shrink: 0;
        }
        .user-meta-info {
          overflow: hidden;
        }
        .user-display-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--neutral-900);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-email-text {
          font-size: 0.725rem;
          color: var(--neutral-500);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.5rem 0.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--neutral-200);
          background: #ffffff;
          color: var(--danger-600);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .sidebar-logout-btn:hover {
          background: var(--danger-50);
          border-color: #fecaca;
        }

        @media (max-width: 868px) {
          .dashboard-sidebar {
            width: 100%;
            min-height: auto;
            border-right: none;
            border-bottom: 1px solid var(--neutral-200);
            padding: 0.75rem 1rem;
          }
          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .sidebar-link {
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
          }
          .sidebar-chevron {
            display: none;
          }
          .sidebar-footer {
            display: none;
          }
        }
      `}</style>
    </aside>
  );
}
