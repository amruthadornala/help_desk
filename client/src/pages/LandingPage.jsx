import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import {
  Sparkles,
  Bot,
  Zap,
  BookOpen,
  Bell,
  HelpCircle,
  LifeBuoy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  Building2,
  Award
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);
  const [quickQuery, setQuickQuery] = useState('');

  const handleQuickAsk = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/login?initialPrompt=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/chat');
    }
  };

  const featureCards = [
    {
      icon: Bot,
      color: 'blue',
      title: 'AI Student Chatbot',
      desc: 'Ask questions in natural language and receive immediate answers grounded in verified college rules and databases.'
    },
    {
      icon: Zap,
      color: 'amber',
      title: 'Instant Accurate Answers',
      desc: 'No more waiting in administrative lines or searching disorganized circulars. Get answers in under 2 seconds.'
    },
    {
      icon: BookOpen,
      color: 'indigo',
      title: 'College Knowledge Hub',
      desc: 'Exhaustive data on exam schedules, fee deadlines, grading rubrics, attendance policies, and transcript processing.'
    },
    {
      icon: Bell,
      color: 'emerald',
      title: 'Real-Time Announcements',
      desc: 'Stay informed with priority notifications regarding examinations, campus placement drives, and cultural fests.'
    },
    {
      icon: HelpCircle,
      color: 'purple',
      title: 'Categorized FAQs',
      desc: 'Browse hundreds of frequently asked questions organized cleanly by semester, department, and academic service.'
    },
    {
      icon: LifeBuoy,
      color: 'rose',
      title: 'Student Services Directory',
      desc: 'Direct office locations, HOD emails, clinic hours, and anti-ragging contact hotlines all in one responsive portal.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Type Your Question',
      desc: 'Enter any query about exams, fee due dates, timetable, or bonafide certificates in natural language.'
    },
    {
      step: '02',
      title: 'Semantic Context Search',
      desc: 'The backend scans the verified college knowledge base to retrieve official rules, dates, and contacts.'
    },
    {
      step: '03',
      title: 'Accurate AI Response',
      desc: 'Receive a concise, step-by-step verified answer citing official sources, without hallucinations.'
    }
  ];

  const benefits = [
    { title: '24/7 Real-Time Availability', desc: 'Get assistance at midnight before an exam or during campus holidays.' },
    { title: 'Zero Hallucinations Policy', desc: 'Strictly restricted to verified college data to protect students from misleading information.' },
    { title: 'Eliminate Long Office Queues', desc: 'Resolve routine administrative and certificate queries right from your smartphone.' },
    { title: 'Centralized Administrative Control', desc: 'Admins update rules, notices, and FAQs in real-time with instant synchronization.' }
  ];

  const landingFaqs = [
    {
      q: 'How does the AI Help Desk ensure information is accurate?',
      a: 'The system uses Retrieval-Augmented Generation (RAG). When you ask a question, the backend first searches the official college knowledge base for verified policies and only answers using those confirmed facts.'
    },
    {
      q: 'What if the information is not present in the college database?',
      a: 'The AI will explicitly state that verified information is unavailable and will provide the contact details of the relevant departmental office or HOD rather than inventing answers.'
    },
    {
      q: 'Can students access the Help Desk on mobile devices?',
      a: 'Yes! The entire application is fully responsive and optimized for smartphones, tablets, laptops, and desktop computers.'
    },
    {
      q: 'How can college administrators update policies and announcements?',
      a: 'Administrators have a dedicated, secure dashboard where they can create, edit, and delete FAQs, announcements, department listings, and knowledge base articles in real-time.'
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Campus Intelligence • 2026</span>
          </div>

          <h1 className="hero-title">
            Your College Information, <br />
            <span className="text-gradient">One Smart Help Desk</span>
          </h1>

          <p className="hero-description">
            Get instant answers to your college-related questions with our AI-powered student help desk.
            From examination timetables to bonafide certificates and placement drives, help is just a question away.
          </p>

          {/* Quick Chat Input Box inside Hero */}
          <form onSubmit={handleQuickAsk} className="hero-search-box">
            <Bot className="search-box-icon" size={22} />
            <input
              type="text"
              placeholder="e.g. When is the fee payment deadline or how to apply for bonafide?"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="hero-input"
            />
            <button type="submit" className="btn btn-primary btn-search">
              Ask AI
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Suggested quick pills */}
          <div className="suggested-pills">
            <span className="pills-label">Popular queries:</span>
            <button type="button" onClick={() => setQuickQuery('What is the minimum attendance requirement?')} className="pill-btn">
              Attendance Rules
            </button>
            <button type="button" onClick={() => setQuickQuery('How can I apply for a bonafide certificate?')} className="pill-btn">
              Bonafide Certificate
            </button>
            <button type="button" onClick={() => setQuickQuery('What are the central library timings?')} className="pill-btn">
              Library Timings
            </button>
            <button type="button" onClick={() => setQuickQuery('Where is the Examination Cell?')} className="pill-btn">
              Exam Cell Location
            </button>
          </div>

          <div className="hero-cta-buttons">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Now
              <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Student Login
            </Link>
            <Link to="/admin/login" className="btn btn-outline btn-lg">
              <ShieldCheck size={18} />
              Admin Portal
            </Link>
          </div>

          {/* Trust Metrics Bar */}
          <div className="trust-metrics-strip">
            <div className="metric-item">
              <span className="metric-number">24/7</span>
              <span className="metric-text">Instant Assistance</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">100%</span>
              <span className="metric-text">Verified College Data</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">&lt; 2s</span>
              <span className="metric-text">Average Response Time</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-number">12+</span>
              <span className="metric-text">Campus Categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: What is College Help Desk? */}
      <section className="section bg-white">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">About The System</span>
            <h2 className="section-title">What is the AI College Help Desk?</h2>
            <p className="section-subtitle">
              A next-generation virtual assistant engineered to bridge communication gaps between students and academic administration.
            </p>
          </div>

          <div className="about-grid">
            <div className="about-text-content">
              <h3>Empowering Students with Intelligent Answers</h3>
              <p>
                Navigating university life often involves sifting through hundreds of PDF circulars, outdated notice boards,
                and standing in long administrative lines. The <strong>AI College Help Desk</strong> changes this paradigm by
                providing a unified, intelligent gateway.
              </p>
              <p>
                Whether you need the end-semester exam schedule, instructions to obtain a provisional transcript,
                hostel fee installment details, or HOD contact information, our AI understands natural language questions and
                delivers direct, actionable answers immediately.
              </p>

              <div className="about-check-list">
                <div className="check-item">
                  <CheckCircle2 className="check-icon" size={20} />
                  <span>Real-time SQLite database synchronization with administrative controls</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 className="check-icon" size={20} />
                  <span>Modular AI architecture with automated RAG fallback for offline viva demos</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 className="check-icon" size={20} />
                  <span>Dedicated student and administrative role-based authenticated workspaces</span>
                </div>
              </div>
            </div>

            <div className="about-card-preview">
              <div className="chat-mockup-card">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="mockup-title">AI Assistant • Live Interaction</span>
                </div>
                <div className="mockup-body">
                  <div className="msg user-msg">
                    <span className="msg-text">How can I apply for a bonafide certificate?</span>
                    <span className="msg-time">10:42 AM</span>
                  </div>
                  <div className="msg bot-msg">
                    <span className="msg-avatar"><Bot size={16} /></span>
                    <div className="msg-content">
                      <p className="msg-text">
                        You can apply for a Bonafide Certificate online through the Student Portal under <strong>Student Services &rarr; Certificate Request</strong>, or visit the Student Affairs Administrative Desk in <strong>Admin Block, Room 104</strong>.
                      </p>
                      <div className="msg-source-tag">
                        Source: Certificates & Documentation Issuance
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Features */}
      <section className="section bg-light">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Core Capabilities</span>
            <h2 className="section-title">Engineered for Academic Excellence</h2>
            <p className="section-subtitle">
              Comprehensive features tailored specifically for student productivity and administrative convenience.
            </p>
          </div>

          <div className="features-grid">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="feature-card">
                  <div className={`feature-icon-box bg-${feat.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="feature-title">{feat.title}</h3>
                  <p className="feature-desc">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="section bg-white">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Simple Workflow</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Three seamless steps connecting student questions to verified campus knowledge.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((st, i) => (
              <div key={i} className="step-card">
                <div className="step-badge">{st.step}</div>
                <h3 className="step-title">{st.title}</h3>
                <p className="step-desc">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Benefits */}
      <section className="section bg-gradient-strip">
        <div className="section-container">
          <div className="benefits-card-wrapper">
            <div className="benefits-intro">
              <span className="section-tag tag-white">Tangible Impact</span>
              <h2 className="benefits-heading">Why Colleges & Students Choose This Platform</h2>
              <p className="benefits-sub">
                Designed to eliminate administrative bottlenecks, improve student satisfaction scores, and deliver accurate academic guidance instantly.
              </p>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Create Student Account
              </Link>
            </div>

            <div className="benefits-grid">
              {benefits.map((b, i) => (
                <div key={i} className="benefit-item">
                  <CheckCircle2 className="benefit-check" size={24} />
                  <div>
                    <h4 className="benefit-title">{b.title}</h4>
                    <p className="benefit-desc">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Frequently Asked Questions */}
      <section className="section bg-white">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Clear Answers</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Have questions about how the platform operates? Here is what you need to know.
            </p>
          </div>

          <div className="faq-accordion-list">
            {landingFaqs.map((faq, i) => {
              const isOpen = activeFaq === i;
              return (
                <div key={i} className={`faq-accordion-card ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setActiveFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`chevron-icon ${isOpen ? 'rotated' : ''}`} size={20} />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <Link to="/faqs" className="btn btn-secondary">
              View All College FAQs
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Contact & Campus Information */}
      <section className="section bg-light">
        <div className="section-container">
          <div className="section-header text-center">
            <span className="section-tag">Campus Directory</span>
            <h2 className="section-title">Important College Offices & Contacts</h2>
            <p className="section-subtitle">
              Need in-person assistance? Reach out directly to campus administrative cells.
            </p>
          </div>

          <div className="contact-offices-grid">
            <div className="office-card">
              <div className="office-icon-box"><Building2 size={24} /></div>
              <h4>Examination Cell</h4>
              <p>Room 108, Ground Floor, Admin Block</p>
              <span className="contact-detail">📞 +1 (555) 019-2810</span>
              <span className="contact-detail">✉️ examcell@college.edu</span>
            </div>

            <div className="office-card">
              <div className="office-icon-box"><DollarSign size={24} /></div>
              <h4>Accounts & Fees</h4>
              <p>Room 102, Ground Floor, Admin Block</p>
              <span className="contact-detail">📞 +1 (555) 019-2811</span>
              <span className="contact-detail">✉️ accounts@college.edu</span>
            </div>

            <div className="office-card">
              <div className="office-icon-box"><BookOpen size={24} /></div>
              <h4>Central Library</h4>
              <p>Library Complex, 1st - 3rd Floors</p>
              <span className="contact-detail">📞 +1 (555) 019-2814</span>
              <span className="contact-detail">✉️ library@college.edu</span>
            </div>

            <div className="office-card">
              <div className="office-icon-box"><Award size={24} /></div>
              <h4>Placement & Training</h4>
              <p>Room 401, 4th Floor, Tech Block</p>
              <span className="contact-detail">📞 +1 (555) 019-2816</span>
              <span className="contact-detail">✉️ placements@college.edu</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .landing-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Hero */
        .hero-section {
          background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
          padding: 4.5rem 1.5rem 3.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero-container {
          max-width: 920px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: #ffffff;
          border: 1px solid var(--primary-200);
          border-radius: var(--radius-full);
          color: var(--primary-700);
          font-size: 0.8125rem;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
        }
        .hero-title {
          font-size: 3.25rem;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          font-weight: 800;
        }
        .text-gradient {
          background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-indigo) 50%, var(--accent-cyan) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-description {
          font-size: 1.15rem;
          color: var(--neutral-600);
          max-width: 720px;
          line-height: 1.6;
          margin-bottom: 2.25rem;
        }

        /* Hero Quick Box */
        .hero-search-box {
          width: 100%;
          max-width: 680px;
          background: #ffffff;
          border: 2px solid var(--primary-200);
          border-radius: var(--radius-xl);
          padding: 0.5rem 0.65rem 0.5rem 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          margin-bottom: 1.25rem;
          transition: border-color var(--transition-fast);
        }
        .hero-search-box:focus-within {
          border-color: var(--primary-600);
        }
        .search-box-icon {
          color: var(--primary-600);
          flex-shrink: 0;
        }
        .hero-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 1rem;
          color: var(--neutral-900);
          outline: none;
        }
        .btn-search {
          border-radius: var(--radius-lg);
        }

        .suggested-pills {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.25rem;
        }
        .pills-label {
          font-size: 0.8125rem;
          color: var(--neutral-500);
          font-weight: 500;
        }
        .pill-btn {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          color: var(--neutral-700);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .pill-btn:hover {
          background: var(--primary-50);
          color: var(--primary-700);
          border-color: var(--primary-300);
        }

        .hero-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }

        .trust-metrics-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          background: #ffffff;
          padding: 1.25rem 2rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--neutral-200);
          box-shadow: var(--shadow-md);
          width: 100%;
          max-width: 820px;
          flex-wrap: wrap;
        }
        .metric-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .metric-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-700);
          font-family: var(--font-heading);
        }
        .metric-text {
          font-size: 0.78rem;
          color: var(--neutral-500);
          font-weight: 600;
          text-transform: uppercase;
        }
        .metric-divider {
          width: 1px;
          height: 35px;
          background: var(--neutral-200);
        }

        /* Generic Section */
        .section {
          padding: 5rem 1.5rem;
        }
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-header {
          margin-bottom: 3.5rem;
        }
        .text-center {
          text-align: center;
        }
        .section-tag {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--primary-700);
          background: var(--primary-50);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          margin-bottom: 0.75rem;
        }
        .tag-white {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        .section-title {
          font-size: 2.35rem;
          margin-bottom: 0.75rem;
        }
        .section-subtitle {
          font-size: 1.05rem;
          color: var(--neutral-600);
          max-width: 640px;
          margin: 0 auto;
        }
        .bg-white { background: #ffffff; }
        .bg-light { background: var(--neutral-50); }

        /* About Grid */
        .about-grid {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 3.5rem;
          align-items: center;
        }
        .about-text-content h3 {
          font-size: 1.6rem;
          margin-bottom: 1rem;
        }
        .about-text-content p {
          color: var(--neutral-600);
          margin-bottom: 1rem;
          line-height: 1.65;
        }
        .about-check-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9375rem;
          color: var(--neutral-800);
          font-weight: 500;
        }
        .check-icon {
          color: var(--success-600);
          flex-shrink: 0;
        }

        /* Mockup card */
        .chat-mockup-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          overflow: hidden;
        }
        .mockup-header {
          background: var(--neutral-100);
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid var(--neutral-200);
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mockup-dots {
          display: flex;
          gap: 6px;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .dot.green { background: #10b981; }
        .mockup-title {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--neutral-600);
        }
        .mockup-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          background: var(--neutral-50);
        }
        .msg {
          display: flex;
          flex-direction: column;
          max-width: 85%;
        }
        .user-msg {
          align-self: flex-end;
          background: var(--primary-600);
          color: #ffffff;
          padding: 0.85rem 1.15rem;
          border-radius: 16px 16px 4px 16px;
        }
        .user-msg .msg-time {
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.75);
          text-align: right;
          margin-top: 4px;
        }
        .bot-msg {
          align-self: flex-start;
          display: flex;
          gap: 0.75rem;
        }
        .msg-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-indigo);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .msg-content {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          padding: 0.85rem 1.15rem;
          border-radius: 16px 16px 16px 4px;
          box-shadow: var(--shadow-sm);
        }
        .msg-source-tag {
          display: inline-block;
          margin-top: 0.65rem;
          font-size: 0.725rem;
          background: var(--primary-50);
          color: var(--primary-700);
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 600;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
        }
        .feature-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-normal);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-300);
        }
        .feature-icon-box {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .bg-blue { background: #dbeafe; color: #2563eb; }
        .bg-amber { background: #fef3c7; color: #d97706; }
        .bg-indigo { background: #e0e7ff; color: #4f46e5; }
        .bg-emerald { background: #d1fae5; color: #059669; }
        .bg-purple { background: #ede9fe; color: #7c3aed; }
        .bg-rose { background: #ffe4e6; color: #e11d48; }

        .feature-title {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }
        .feature-desc {
          color: var(--neutral-600);
          font-size: 0.9125rem;
          line-height: 1.55;
        }

        /* Steps Grid */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .step-card {
          background: var(--neutral-50);
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 2rem 1.5rem;
          position: relative;
        }
        .step-badge {
          font-size: 2.25rem;
          font-weight: 800;
          font-family: var(--font-heading);
          color: var(--primary-200);
          margin-bottom: 0.75rem;
        }
        .step-title {
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
        }
        .step-desc {
          color: var(--neutral-600);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        /* Benefits Strip */
        .bg-gradient-strip {
          background: linear-gradient(135deg, var(--primary-800) 0%, var(--neutral-900) 100%);
          color: #ffffff;
        }
        .benefits-card-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3.5rem;
          align-items: center;
        }
        .benefits-heading {
          font-size: 2.25rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .benefits-sub {
          color: var(--neutral-300);
          font-size: 1.05rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .benefits-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .benefit-check {
          color: #34d399;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .benefit-title {
          color: #ffffff;
          font-size: 1.05rem;
          margin-bottom: 0.25rem;
        }
        .benefit-desc {
          color: var(--neutral-300);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* FAQ Accordion */
        .faq-accordion-list {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .faq-accordion-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        .faq-accordion-card.open {
          border-color: var(--primary-500);
        }
        .faq-question-btn {
          width: 100%;
          padding: 1.15rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--neutral-800);
          cursor: pointer;
          text-align: left;
        }
        .chevron-icon {
          color: var(--neutral-400);
          transition: transform var(--transition-fast);
          flex-shrink: 0;
        }
        .chevron-icon.rotated {
          transform: rotate(180deg);
          color: var(--primary-600);
        }
        .faq-answer-panel {
          padding: 0 1.5rem 1.25rem;
          color: var(--neutral-600);
          font-size: 0.9375rem;
          line-height: 1.6;
          border-top: 1px solid var(--neutral-100);
          padding-top: 0.85rem;
        }

        /* Contact Offices Grid */
        .contact-offices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .office-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          box-shadow: var(--shadow-sm);
        }
        .office-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--primary-50);
          color: var(--primary-700);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .office-card h4 {
          font-size: 1.1rem;
        }
        .office-card p {
          color: var(--neutral-500);
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
        }
        .contact-detail {
          font-size: 0.8125rem;
          color: var(--neutral-700);
          font-weight: 500;
        }

        .mt-6 { margin-top: 2rem; }

        @media (max-width: 900px) {
          .hero-title { font-size: 2.5rem; }
          .about-grid { grid-template-columns: 1fr; }
          .benefits-card-wrapper { grid-template-columns: 1fr; }
          .steps-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .hero-title { font-size: 2rem; }
          .hero-description { font-size: 1rem; }
          .trust-metrics-strip { flex-direction: column; gap: 1rem; }
          .metric-divider { display: none; }
        }
      `}</style>
    </div>
  );
}
