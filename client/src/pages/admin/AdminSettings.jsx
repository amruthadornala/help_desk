import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Cpu,
  Database,
  Users,
  CheckCircle2,
  Server,
  Code2,
  Sparkles,
  BookOpen,
  Info
} from 'lucide-react';

export function AdminSettings() {
  const [copiedRole, setCopiedRole] = useState(null);

  const teamMembers = [
    {
      role: 'Member 1: Team Lead + UI/UX',
      desc: 'System architecture planning, visual design system, CSS design tokens, color palette, wireframes, and responsive dashboard layout.'
    },
    {
      role: 'Member 2: Frontend Development',
      desc: 'React components, React Router navigation, State management, custom hooks, dynamic modals, and responsive views.'
    },
    {
      role: 'Member 3: AI/Chatbot Development',
      desc: 'AI prompt engineering, RAG context retrieval algorithm, Gemini API integration, and offline fallback synthesis engine.'
    },
    {
      role: 'Member 4: Backend/API Development',
      desc: 'Node.js & Express REST APIs, JWT authentication, bcrypt password hashing, role authorization middleware, and input validation.'
    },
    {
      role: 'Member 5: Database Development',
      desc: 'SQLite relational schema design, primary & foreign keys, indexing, demo datasets, cascading deletes, and CRUD query optimization.'
    },
    {
      role: 'Member 6: System Design + Testing + Documentation',
      desc: 'Use case modeling, DFD diagrams, API testing checklist, viva defense preparation, and comprehensive documentation chapters.'
    }
  ];

  const vivaTopics = [
    {
      q: 'How does the AI Chatbot avoid hallucinations?',
      a: 'The system uses Retrieval-Augmented Generation (RAG). Before prompting the AI, the backend scans the SQLite knowledge base and FAQs. Only matching college records are provided in the system context. The model prompt explicitly forbids inventing dates, fees, or rules.'
    },
    {
      q: 'What happens if the internet or external AI API goes down during viva?',
      a: 'The application contains an intelligent offline fallback engine. When no external API key is present or if network fails, the backend directly synthesizes verified answers from the local database matching the exact query.'
    },
    {
      q: 'How are passwords and admin routes secured?',
      a: 'Student & admin passwords are salted and hashed using bcrypt with cost factor 10. Admin routes verify cryptographically signed JSON Web Tokens (JWT) containing the verified role before executing any CRUD action.'
    }
  ];

  return (
    <div className="admin-settings-page">
      {/* Header */}
      <div className="admin-page-header">
        <div className="header-icon-box settings-box">
          <Settings size={24} />
        </div>
        <div>
          <h2>System Configuration & Project Viva Guide</h2>
          <p>Architectural diagnostics, AI engine status, and 6-member viva presentation notes</p>
        </div>
      </div>

      {/* Diagnostics Cards */}
      <div className="diagnostics-grid">
        <div className="diag-card">
          <div className="diag-top">
            <Cpu size={20} className="text-primary" />
            <span className="badge badge-success">Online • Active</span>
          </div>
          <h4>AI RAG Retrieval Engine</h4>
          <p>Modular architecture supporting Gemini API with automatic Intelligent Offline Local Fallback.</p>
          <div className="diag-meta">Response Time: ~25ms (Local) / ~800ms (API)</div>
        </div>

        <div className="diag-card">
          <div className="diag-top">
            <Database size={20} className="text-purple" />
            <span className="badge badge-success">SQLite 3 Connected</span>
          </div>
          <h4>Relational Database</h4>
          <p>Local zero-config storage in <code>helpdesk.db</code>. 7 normalized tables with foreign keys and cascade rules.</p>
          <div className="diag-meta">Engine: node:sqlite (Zero C++ overhead)</div>
        </div>

        <div className="diag-card">
          <div className="diag-top">
            <ShieldCheck size={20} className="text-emerald" />
            <span className="badge badge-success">Secured • JWT Active</span>
          </div>
          <h4>Role-Based Access Control</h4>
          <p>Bcrypt hashing (10 rounds) + HS256 JWT sessions protecting administrative CRUD endpoints.</p>
          <div className="diag-meta">Token Expiry: 7 Days (Configurable)</div>
        </div>
      </div>

      {/* Project Team Members Roles Section (Chapter 35 Requirement) */}
      <div className="settings-panel-card mb-6">
        <div className="panel-title-strip">
          <Users size={20} className="text-primary" />
          <div>
            <h3>6-Member Project Viva Presentation Roles</h3>
            <p>Structured contribution breakdown ready for college defense and viva evaluation</p>
          </div>
        </div>

        <div className="team-roles-grid">
          {teamMembers.map((m, idx) => (
            <div key={idx} className="team-member-card">
              <div className="member-num-badge">Member {idx + 1}</div>
              <h4>{m.role}</h4>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Viva Exam Questions & Answers */}
      <div className="settings-panel-card">
        <div className="panel-title-strip">
          <BookOpen size={20} className="text-indigo" />
          <div>
            <h3>Frequently Asked Viva Questions & Answers</h3>
            <p>Key technical points external examiners look for during project evaluation</p>
          </div>
        </div>

        <div className="viva-qa-list">
          {vivaTopics.map((v, i) => (
            <div key={i} className="viva-qa-item">
              <div className="viva-q-row">
                <span className="badge badge-primary">Q{i + 1}</span>
                <strong>{v.q}</strong>
              </div>
              <p className="viva-a-text">{v.a}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .admin-settings-page {
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
        .header-icon-box.settings-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, #334155, #1e293b);
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

        .diagnostics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .diag-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .diag-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .diag-card h4 {
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }
        .diag-card p {
          font-size: 0.85rem;
          color: var(--neutral-600);
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .diag-meta {
          font-size: 0.75rem;
          color: var(--neutral-400);
          font-weight: 600;
          padding-top: 0.5rem;
          border-top: 1px dashed var(--neutral-200);
        }

        .settings-panel-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          padding: 1.75rem 2rem;
          box-shadow: var(--shadow-sm);
        }
        .panel-title-strip {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--neutral-100);
          margin-bottom: 1.5rem;
        }
        .panel-title-strip h3 {
          font-size: 1.25rem;
          margin-bottom: 0.2rem;
        }
        .panel-title-strip p {
          font-size: 0.85rem;
          color: var(--neutral-500);
        }

        .team-roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }
        .team-member-card {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.25rem;
        }
        .member-num-badge {
          display: inline-block;
          font-size: 0.725rem;
          font-weight: 700;
          color: var(--primary-700);
          background: var(--primary-50);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.5rem;
        }
        .team-member-card h4 {
          font-size: 1rem;
          margin-bottom: 0.35rem;
        }
        .team-member-card p {
          font-size: 0.825rem;
          color: var(--neutral-600);
          line-height: 1.5;
        }

        .viva-qa-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .viva-qa-item {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }
        .viva-q-row {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        .viva-a-text {
          font-size: 0.875rem;
          color: var(--neutral-600);
          line-height: 1.6;
          padding-left: 2rem;
        }
        .mb-6 { margin-bottom: 2rem; }
      `}</style>
    </div>
  );
}
