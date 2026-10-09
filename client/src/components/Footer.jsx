import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Phone, Mail, MapPin, ShieldAlert, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Col 1: Brand & Overview */}
          <div className="footer-col">
            <div className="footer-brand">
              <div className="footer-logo-box">
                <GraduationCap size={22} />
              </div>
              <div>
                <h4 className="footer-title">College Help Desk</h4>
                <p className="footer-subtitle">Intelligent Student Support System</p>
              </div>
            </div>
            <p className="footer-desc">
              Providing instantaneous answers to college questions on examinations, fees, attendance, timetables,
              and student documentation powered by intelligent RAG assistance.
            </p>
            <div className="anti-ragging-badge">
              <ShieldAlert size={16} />
              <span>Anti-Ragging Helpline: 1800-425-9988 (24x7)</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="footer-col">
            <h5 className="footer-col-title">Quick Navigation</h5>
            <ul className="footer-links">
              <li><Link to="/">Home Overview</Link></li>
              <li><Link to="/chat">AI Student Chatbot</Link></li>
              <li><Link to="/faqs">Frequently Asked Questions</Link></li>
              <li><Link to="/announcements">Notice & Announcements</Link></li>
              <li><Link to="/departments">Academic Departments</Link></li>
              <li><Link to="/college-info">Campus Directory</Link></li>
            </ul>
          </div>

          {/* Col 3: Student Services */}
          <div className="footer-col">
            <h5 className="footer-col-title">Key Campus Offices</h5>
            <ul className="footer-contact-list">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>Admin Block, Rooms 102 - 108</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>+1 (555) 019-2800 (Helpdesk)</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>helpdesk@college.edu</span>
              </li>
              <li>
                <span className="timing-chip">Office Hours: Mon - Fri, 9:00 AM - 5:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Viva & Academic Project Info */}
          <div className="footer-col">
            <h5 className="footer-col-title">Academic Mini Project</h5>
            <div className="viva-info-card">
              <div className="viva-tag">B.Tech 5th Semester</div>
              <p className="viva-text">
                Designed & implemented as a 6-member engineering project: Full-Stack React, Express, SQLite & AI Knowledge Base.
              </p>
              <div className="system-status-indicator">
                <span className="pulse-dot"></span>
                <span>System Status: Online & Operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AI-Powered College Help Desk. All rights reserved.</p>
          <p className="footer-tech-credit">
            Built with React & Express • Verified for College Mini Project Viva
          </p>
        </div>
      </div>

      <style>{`
        .app-footer {
          background: #ffffff;
          border-top: 1px solid var(--neutral-200);
          margin-top: auto;
          color: var(--neutral-600);
        }
        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 1.5rem 1.5rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.2fr 1.4fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
        }
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .footer-logo-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--primary-600), var(--accent-indigo));
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-title {
          font-size: 1.1rem;
          color: var(--neutral-900);
          line-height: 1.2;
        }
        .footer-subtitle {
          font-size: 0.75rem;
          color: var(--neutral-500);
        }
        .footer-desc {
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          color: var(--neutral-600);
        }
        .anti-ragging-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.75rem;
          background: var(--danger-50);
          color: var(--danger-600);
          border: 1px solid #fecaca;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .footer-col-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--neutral-900);
          margin-bottom: 1.2rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .footer-links a {
          font-size: 0.875rem;
          color: var(--neutral-600);
          transition: color var(--transition-fast);
        }
        .footer-links a:hover {
          color: var(--primary-600);
        }
        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.875rem;
        }
        .footer-contact-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .contact-icon {
          color: var(--primary-600);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .timing-chip {
          display: inline-block;
          font-size: 0.75rem;
          background: var(--neutral-100);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--neutral-700);
        }
        .viva-info-card {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          padding: 1rem;
          border-radius: var(--radius-md);
        }
        .viva-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--primary-50);
          color: var(--primary-700);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.5rem;
        }
        .viva-text {
          font-size: 0.8125rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        .system-status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--success-600);
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success-500);
          box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          animation: pulseGreen 2s infinite;
        }
        @keyframes pulseGreen {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .footer-bottom {
          padding-top: 1.5rem;
          border-top: 1px solid var(--neutral-200);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.8125rem;
          color: var(--neutral-500);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-tech-credit {
          color: var(--neutral-500);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
