import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  FileCheck2,
  DollarSign,
  BookOpen,
  Award,
  ShieldAlert,
  HeartPulse,
  Bus,
  Bot
} from 'lucide-react';

export function CollegeInfoPage() {
  const offices = [
    {
      title: 'Examination Cell',
      icon: FileCheck2,
      location: 'Room 108, Ground Floor, Admin Block',
      timings: 'Mon - Fri: 10:00 AM - 1:00 PM & 2:30 PM - 4:30 PM',
      phone: '+1 (555) 019-2810',
      email: 'examcell@college.edu',
      desc: 'Handles end-semester examinations, hall tickets, grade sheets, re-evaluations, and degree verification.'
    },
    {
      title: 'Accounts & Fee Department',
      icon: DollarSign,
      location: 'Room 102, Ground Floor, Admin Block',
      timings: 'Mon - Fri: 9:30 AM - 3:30 PM (Cashier Counter)',
      phone: '+1 (555) 019-2811',
      email: 'accounts@college.edu',
      desc: 'Manages tuition fee receipts, hostel charges, scholarship adjustments, challans, and no-dues clearance.'
    },
    {
      title: 'Central Library',
      icon: BookOpen,
      location: 'Library Complex (3 Floors)',
      timings: 'Mon - Fri: 8:00 AM - 9:00 PM | Sat - Sun: 9:00 AM - 5:00 PM',
      phone: '+1 (555) 019-2814',
      email: 'library@college.edu',
      desc: 'Over 65,000 volumes, IEEE digital access, 120 e-learning terminals, and 24/7 study hall access during exam weeks.'
    },
    {
      title: 'Placement & Career Development Cell',
      icon: Award,
      location: 'Room 401, 4th Floor, Tech Block A',
      timings: 'Mon - Sat: 9:00 AM - 5:30 PM',
      phone: '+1 (555) 019-2816',
      email: 'placements@college.edu',
      desc: 'Coordinates campus recruitment drives, summer internships, coding bootcamps, and resume workshops.'
    },
    {
      title: 'Central Administration & Registrar',
      icon: Building,
      location: 'Room 201, 2nd Floor, Admin Block',
      timings: 'Mon - Fri: 9:00 AM - 5:00 PM',
      phone: '+1 (555) 019-2800',
      email: 'registrar@college.edu',
      desc: 'Oversees university admissions, identity verification, enrollment records, and academic governance.'
    },
    {
      title: 'Student Affairs & Documentation Desk',
      icon: GraduationCap,
      location: 'Room 104, Ground Floor, Admin Block',
      timings: 'Mon - Fri: 9:30 AM - 4:30 PM',
      phone: '+1 (555) 019-2818',
      email: 'studentaffairs@college.edu',
      desc: 'Issues bonafide certificates, bus passes, railway concessions, ID cards, and student club permissions.'
    }
  ];

  const campusFacilities = [
    {
      name: 'Health & Wellness Clinic',
      icon: HeartPulse,
      desc: 'Resident medical officer available Mon - Sat (9 AM - 5 PM). 24/7 campus ambulance: +1 (555) 019-9911.'
    },
    {
      name: 'Campus Transportation',
      icon: Bus,
      desc: 'Fleet of 22 GPS-enabled campus buses operating across 14 city routes with annual and semester passes.'
    },
    {
      name: 'Anti-Ragging Committee',
      icon: ShieldAlert,
      desc: 'Strict zero-tolerance campus safety committee. 24x7 toll-free emergency hotline: 1800-425-9988.'
    }
  ];

  return (
    <div className="college-info-container">
      {/* College Identity Overview */}
      <div className="college-header-hero">
        <div className="college-badge-top">
          <GraduationCap size={16} />
          <span>Accredited Grade 'A++' Academic Institution</span>
        </div>
        <h1>Apex Institute of Engineering & Technology</h1>
        <p className="college-tagline">Excellence in Innovation, Research, and Student Empowerment</p>

        <div className="contact-meta-strip">
          <div className="meta-item">
            <MapPin size={16} />
            <span>100 Innovation Boulevard, University Campus, Metro City - 560001</span>
          </div>
          <div className="meta-item">
            <Phone size={16} />
            <span>+1 (555) 019-2800</span>
          </div>
          <div className="meta-item">
            <Mail size={16} />
            <span>helpdesk@college.edu</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>Office Hours: Mon - Fri, 9:00 AM - 5:00 PM</span>
          </div>
        </div>
      </div>

      {/* Important Offices Grid */}
      <div className="section-head">
        <h2>Important Campus Offices & Administrative Cells</h2>
        <p>Direct contact and visiting hours for academic, financial, and student service desks</p>
      </div>

      <div className="offices-grid">
        {offices.map((office, idx) => {
          const Icon = office.icon;
          return (
            <div key={idx} className="office-detail-card">
              <div className="office-card-top">
                <div className="office-icon">
                  <Icon size={22} />
                </div>
                <h3>{office.title}</h3>
              </div>

              <p className="office-desc">{office.desc}</p>

              <div className="office-meta-list">
                <div className="meta-row">
                  <MapPin size={15} className="text-primary" />
                  <span>{office.location}</span>
                </div>
                <div className="meta-row">
                  <Clock size={15} className="text-amber" />
                  <span>{office.timings}</span>
                </div>
                <div className="meta-row">
                  <Phone size={15} className="text-emerald" />
                  <span>{office.phone}</span>
                </div>
                <div className="meta-row">
                  <Mail size={15} className="text-indigo" />
                  <span>{office.email}</span>
                </div>
              </div>

              <div className="office-card-cta">
                <Link
                  to={`/chat?initialPrompt=${encodeURIComponent(`What does the ${office.title} handle and how do I contact them?`)}`}
                  className="btn btn-secondary btn-sm btn-block"
                >
                  <Bot size={14} />
                  Ask AI About {office.title}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Facilities & Welfare */}
      <div className="section-head mt-8">
        <h2>Campus Amenities & Student Welfare</h2>
        <p>Essential health, transport, and student safety resources</p>
      </div>

      <div className="amenities-grid">
        {campusFacilities.map((fac, idx) => {
          const Icon = fac.icon;
          return (
            <div key={idx} className="amenity-card">
              <div className="amenity-icon">
                <Icon size={24} />
              </div>
              <h4>{fac.name}</h4>
              <p>{fac.desc}</p>
            </div>
          );
        })}
      </div>

      <style>{`
        .college-info-container {
          max-width: 1150px;
          margin: 0 auto;
        }

        .college-header-hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #2563eb 100%);
          color: #ffffff;
          border-radius: var(--radius-xl);
          padding: 2.75rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: var(--shadow-lg);
        }
        .college-badge-top {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .college-header-hero h1 {
          color: #ffffff;
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }
        .college-tagline {
          font-size: 1.05rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 1.75rem;
        }
        .contact-meta-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .section-head {
          margin-bottom: 1.5rem;
        }
        .section-head h2 {
          font-size: 1.6rem;
          margin-bottom: 0.25rem;
        }
        .section-head p {
          color: var(--neutral-500);
          font-size: 0.9rem;
        }

        .offices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        .office-detail-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.65rem;
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          transition: all var(--transition-normal);
        }
        .office-detail-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-300);
        }
        .office-card-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        .office-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--primary-50);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .office-detail-card h3 {
          font-size: 1.15rem;
        }
        .office-desc {
          color: var(--neutral-600);
          font-size: 0.875rem;
          line-height: 1.55;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .office-meta-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          padding: 0.85rem 1rem;
          background: var(--neutral-50);
          border-radius: var(--radius-md);
          margin-bottom: 1.25rem;
          font-size: 0.8125rem;
        }
        .meta-row {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          color: var(--neutral-700);
        }
        .office-card-cta {
          margin-top: auto;
        }
        .btn-block {
          width: 100%;
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .amenity-card {
          background: #ffffff;
          border: 1px solid var(--neutral-200);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .amenity-icon {
          width: 46px;
          height: 46px;
          border-radius: var(--radius-md);
          background: var(--neutral-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
        }
        .amenity-card h4 {
          font-size: 1.1rem;
          margin-bottom: 0.35rem;
        }
        .amenity-card p {
          color: var(--neutral-600);
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .mt-8 { margin-top: 2.5rem; }
      `}</style>
    </div>
  );
}
