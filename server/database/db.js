import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// ─────────────────────────────────────────────
//  MONGOOSE SCHEMAS & MODELS
// ─────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['student', 'admin'], default: 'student' },
  student_id: { type: String, default: null },
  department: { type: String, default: 'General' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  category: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const knowledgeBaseSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  content:  { type: String, required: true },
  category: { type: String, required: true },
  keywords: { type: String, default: '' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const departmentSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  hod:         { type: String, required: true },
  contact:     { type: String, required: true },
  email:       { type: String, default: '' },
  location:    { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const announcementSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true },
  priority:    { type: String, enum: ['Urgent', 'High', 'Normal', 'Low'], default: 'Normal' },
  date:        { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const chatHistorySchema = new mongoose.Schema({
  user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  question: { type: String, required: true },
  answer:   { type: String, required: true },
  sources:  { type: [String], default: [] }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const feedbackSchema = new mongoose.Schema({
  user_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  chat_id:  { type: mongoose.Schema.Types.ObjectId, ref: 'ChatHistory', default: null },
  rating:   { type: String, enum: ['helpful', 'not_helpful'], required: true },
  comment:  { type: String, default: null }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export const User         = mongoose.model('User',          userSchema);
export const FAQ          = mongoose.model('FAQ',           faqSchema);
export const KnowledgeBase = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
export const Department   = mongoose.model('Department',    departmentSchema);
export const Announcement = mongoose.model('Announcement',  announcementSchema);
export const ChatHistory  = mongoose.model('ChatHistory',   chatHistorySchema);
export const Feedback     = mongoose.model('Feedback',      feedbackSchema);

// ─────────────────────────────────────────────
//  CONNECT & SEED
// ─────────────────────────────────────────────

export async function initDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/college_helpdesk';
  await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${uri}`);
  await seedData();
}

async function seedData() {
  const count = await User.countDocuments();
  if (count > 0) return; // already seeded

  console.log('🌱 Seeding initial College Help Desk demo data...');

  const hashedAdmin   = await bcrypt.hash('admin123', 10);
  const hashedStudent = await bcrypt.hash('student123', 10);

  await User.insertMany([
    { name: 'Campus Administrator', email: 'admin@college.edu',        password: hashedAdmin,   role: 'admin',   student_id: 'ADM-001',     department: 'Administration' },
    { name: 'Alex Morgan',          email: 'student@college.edu',      password: hashedStudent, role: 'student', student_id: 'CS2024-042',  department: 'Computer Science and Engineering' },
    { name: 'Priya Sharma',         email: 'priya.sharma@college.edu', password: hashedStudent, role: 'student', student_id: 'EC2024-118',  department: 'Electronics and Communication Engineering' }
  ]);

  await Department.insertMany([
    { name: 'Computer Science and Engineering',       hod: 'Dr. Robert Vance, Ph.D.',        contact: '+1 (555) 019-2831', email: 'cse.hod@college.edu',   location: 'Tech Block A, 3rd Floor',         description: 'Focuses on algorithms, Artificial Intelligence, machine learning, software systems, and cloud computing. Equipped with state-of-the-art high performance computing labs.' },
    { name: 'Information Technology',                 hod: 'Dr. Sarah Lin, Ph.D.',           contact: '+1 (555) 019-2832', email: 'it.hod@college.edu',    location: 'Tech Block A, 2nd Floor',         description: 'Specializes in cybersecurity, full-stack web architectures, database management systems, and enterprise cloud networks.' },
    { name: 'Electronics and Communication Engineering', hod: 'Dr. Arvind Swaminathan, Ph.D.', contact: '+1 (555) 019-2833', email: 'ece.hod@college.edu',  location: 'Bhabha Hall, 1st & 2nd Floor',    description: 'Covers VLSI design, embedded IoT systems, digital signal processing, satellite communications, and semiconductor applications.' },
    { name: 'Electrical and Electronics Engineering', hod: 'Dr. Elena Rostova, Ph.D.',       contact: '+1 (555) 019-2834', email: 'eee.hod@college.edu',   location: 'Faraday Wing, Ground Floor',      description: 'Focuses on smart grid power systems, renewable solar/wind energy, control engineering, and high-voltage transmission equipment.' },
    { name: 'Mechanical Engineering',                 hod: 'Dr. Marcus Thorne, Ph.D.',       contact: '+1 (555) 019-2835', email: 'mech.hod@college.edu',  location: 'Newton Block & Central Workshops', description: 'Provides hands-on mastery in robotics, thermodynamics, automotive design, additive 3D manufacturing, and fluid mechanics.' },
    { name: 'Civil Engineering',                      hod: 'Dr. Anita Roy, Ph.D.',           contact: '+1 (555) 019-2836', email: 'civil.hod@college.edu', location: 'Sir MV Block, 1st Floor',         description: 'Dedicated to structural design, smart city transportation planning, geotechnical engineering, and eco-friendly sustainable construction.' }
  ]);

  await FAQ.insertMany([
    { question: 'What is the minimum attendance requirement?',            answer: 'Students are required to maintain a minimum of 75% attendance in each registered theory and laboratory subject to be eligible to sit for semester-end examinations. Students between 65%-74% with verified medical certificates must submit formal condonation requests to the Dean of Academic Affairs before the final week of classes.', category: 'Attendance' },
    { question: 'How can I apply for a bonafide certificate?',            answer: 'You can apply for a Bonafide Certificate online through the Student Portal under "Student Services -> Certificate Request" or visit the Student Affairs Administrative Desk (Admin Block, Room 104). Typical turnaround time is 2 working days. No fee is charged for the first copy.', category: 'Certificates' },
    { question: 'What are the central library timings?',                  answer: 'The Central Library is open Monday through Friday from 8:00 AM to 9:00 PM. On Saturdays and Sundays, it operates from 9:00 AM to 5:00 PM. During final examination weeks, the library study reading hall remains open 24/7 with active ID card access.', category: 'Library' },
    { question: 'Where is the Examination Cell located?',                 answer: 'The Examination Cell is located on the Ground Floor of the Main Administrative Block, Room 108. Office visiting hours for students are Monday to Friday, 10:00 AM to 1:00 PM and 2:30 PM to 4:30 PM.', category: 'Exams' },
    { question: 'When is the deadline for tuition fee payment?',          answer: 'Semester tuition fees must be cleared by November 15th for the Fall semester and April 15th for the Spring semester. Late payments incur a fine of $25 per week up to a maximum grace period of two weeks, after which portal access is temporarily frozen.', category: 'Fees' },
    { question: 'How do I apply for campus placement drives?',            answer: 'Students in their 6th and 7th semesters who meet the minimum cumulative GPA cutoff (typically 6.5+ CGPA with no active backlogs) can register on the Placement Cell Portal at placement.college.edu. Resume workshops and mock technical interviews commence in July.', category: 'Placements' },
    { question: 'What is the procedure for obtaining a duplicate student ID card?', answer: 'If your ID card is lost or damaged, file a replacement ticket at the Security & Identification Office (Admin Block Ground Floor). Pay the replacement fee of $15 at the Cashier counter and submit receipt with your student admission number. You will receive a new RFID card within 24 hours.', category: 'Student Services' },
    { question: 'What are the dress code and campus conduct rules?',      answer: 'Students must wear formal or neat smart-casual attire. Laboratory sessions strictly mandate closed-toe shoes and safety lab coats. Ragging and harassment in any form are zero-tolerance criminal offenses punishable by immediate suspension and legal reporting.', category: 'College Rules' },
    { question: 'Where can I download my semester timetable?',           answer: 'Timetables are published on the Student Portal dashboard under "Academic Schedules" prior to each semester start. Physical copies are also displayed on the departmental notice boards in Tech Block A and Faraday Wing.', category: 'Timetable' },
    { question: 'What major technical and cultural events happen during the year?', answer: 'The college hosts "IGNITE" (Annual Inter-College Cultural Fest) in February and "TECHNOVA" (National Technical Symposium & Hackathon) in October. Notifications for call-for-papers and registrations are posted under Announcements 30 days prior.', category: 'Events' },
    { question: 'How can I get my official semester grade transcripts?',  answer: 'Official grade transcripts are issued by the Examination Cell. Submit an online transcript request or visit Room 108 with your student ID. Normal processing requires 5 to 7 business days for sealed envelopes.', category: 'Certificates' },
    { question: 'How do I contact the college counselor or health center?', answer: 'The Campus Health & Wellness Center is located in Student Amenities Wing, Room 012. A doctor is available Mon-Sat, 9 AM - 5 PM. Free confidential counseling appointments can be booked via counseling@college.edu or by calling +1 (555) 019-9900.', category: 'Student Services' }
  ]);

  await KnowledgeBase.insertMany([
    { title: 'Mid-Semester and End-Semester Examination Guidelines', content: 'The Mid-Semester exams for all B.Tech branches are held across week 8 of each semester. End-Semester final theory exams run from December 1st to December 18th for Fall and May 10th to May 28th for Spring. Hall tickets are mandatory and released online 5 days before exams. Electronic gadgets, smart watches, and unauthorized notes are strictly prohibited inside examination halls.', category: 'Exams', keywords: 'exam schedule mid sem end sem dates timetable hall ticket examination cell controller of examinations test' },
    { title: 'Tuition, Hostel & Examination Fee Structure', content: 'B.Tech Tuition fee is $4,500 per semester. Hostel and dining fees are $1,800 per semester. Semester examination fee is $120. Payments can be completed online via Net Banking, Debit/Credit Card, or Demand Draft payable to "Apex Institute of Engineering". Installment payment requests require prior written approval from the Accounts Department (Admin Block, Room 102).', category: 'Fees', keywords: 'fee fees tuition cost hostel due date payment deadline installments accounts cashier refund' },
    { title: 'Attendance Policy and Condonation Rules', content: 'College regulations mandate 75% physical attendance in every subject. Students falling between 65% and 75% due to verified hospitalization or bereavement must submit medical discharge summaries within 5 days of returning to campus. No student with below 65% attendance is permitted to write semester end exams under any circumstances.', category: 'Attendance', keywords: 'attendance percentage minimum 75 percent condonation medical certificate short attendance bunk leave absence' },
    { title: 'Computer Science & Engineering Department Details', content: 'Department of CSE is situated in Tech Block A, 3rd floor. Headed by Dr. Robert Vance (cse.hod@college.edu). The department features specialized labs for AI/ML, Cloud Computing, Cyber Forensics, and Robotics. Office hours for faculty consultation are 3:30 PM - 5:00 PM on weekdays.', category: 'Departments', keywords: 'cse computer science engineering hod labs artificial intelligence machine learning faculty room contact' },
    { title: 'Faculty Directory & Office Hours', content: 'All professors, associate professors, and assistant professors maintain open office consultation hours weekly from 3:30 PM to 5:00 PM. Complete email directories and research profiles are accessible on the college website under Academics > Faculty Profiles.', category: 'Faculty', keywords: 'faculty teachers professors contact email office hours meet advisor mentor cabin staff' },
    { title: 'Central Library Resources, Timings & Borrowing Limits', content: 'The central library houses over 65,000 physical volumes, IEEE Xplore digital library access, Springer journal subscriptions, and 120 e-learning workstations. Undergraduate students can borrow up to 4 books for 14 days; renewal is permitted once online through the library OPAC portal.', category: 'Library', keywords: 'library books timings issue return fine digital library ieee journals reading hall timings study room' },
    { title: 'Certificates & Documentation Issuance', content: 'Bonafide certificates, fee estimates for education loans, medium of instruction certificates, and course completion letters are issued by the Student Affairs Desk (Admin Block Room 104). Processing takes 48 hours upon online form submission.', category: 'Certificates', keywords: 'certificate bonafide transcript migration transfer certificate medium of instruction provisional degree document' },
    { title: 'Campus Placements & Internship Training Cell', content: 'The Placement & Career Development Cell is located on the 4th Floor of the Main Building. Over 180 companies visit the campus annually including Microsoft, Google, Infosys, TCS, Cognizant, and Bosch. Minimum eligibility is 6.5 CGPA with zero active backlogs. Training workshops cover Data Structures, Algorithms, System Design, and Soft Skills.', category: 'Placements', keywords: 'placement placements jobs campus recruitment package average lpa eligibility companies internship training resume drive' },
    { title: 'College Events, Hackathons & Cultural Fests', content: 'Annual cultural fest "IGNITE" takes place in February featuring music concerts, dance, and literary events. "TECHNOVA" is the national flagship tech symposium held in October featuring a 36-hour hackathon, robotics arena, and project exhibition with $10,000 in prizes.', category: 'Events', keywords: 'event fest ignite technova hackathon symposium sports meet cultural competition tech fest' },
    { title: 'Class Schedules, Lab Slots & Timetable Regulations', content: 'Classes run Monday to Friday from 9:00 AM to 4:30 PM with a lunch break from 12:45 PM to 1:45 PM. Timetables are refreshed at the beginning of each semester and are accessible from the student dashboard and departmental boards.', category: 'Timetable', keywords: 'timetable class schedule timing slots lecture lab periods break hours calendar' },
    { title: 'Campus Conduct, Anti-Ragging & Disciplinary Code', content: 'Ragging is strictly outlawed under Supreme Court regulations. The Anti-Ragging committee operates a 24/7 emergency toll-free hotline: 1800-425-9988. Smoking, alcohol, and prohibited substances inside the campus or hostels will result in immediate expulsion.', category: 'College Rules', keywords: 'rules regulations code of conduct disciplinary anti-ragging punishment alcohol smoking parking uniform dress code' },
    { title: 'Student Support Services & Health Center', content: 'The campus provides a comprehensive Health Clinic (Room 012) with full-time resident physicians, 24/7 campus ambulance, mental health counseling services, student grievance redressal cell, and bus transport services connecting 14 city routes.', category: 'Student Services', keywords: 'student services medical clinic hospital doctor counselor bus transport canteen hostel mess grievance help' },
    { title: 'Scholarships and Financial Aid', content: 'Merit-based scholarships covering 25% to 100% of tuition are awarded to students holding university ranks or top 5% CGPA. Government scholarships for reserved categories and economically weaker sections (EWS) are processed by the Financial Aid Cell in Admin Block Room 106.', category: 'Fees', keywords: 'scholarship financial aid concession merit discount waiver ews government aid funding fee concession' },
    { title: 'Laboratory Safety & Equipment Usage Protocols', content: 'All engineering students must wear closed leather shoes, long cotton lab coats, and safety goggles where specified. Bringing food, drinks, or unauthorized USB storage into computing and hardware laboratories is strictly prohibited.', category: 'College Rules', keywords: 'lab safety rules protocols equipment chemistry physics computers hardware regulations' }
  ]);

  await Announcement.insertMany([
    { title: 'Fall Semester End Examinations Schedule Released',              description: 'The controller of examinations has officially published the draft schedule for Fall semester end-term examinations. Students are advised to verify course codes and report clashes before Friday.', category: 'Exam',      priority: 'Urgent', date: '2026-10-05' },
    { title: 'Upcoming Tech Fest "TECHNOVA 2026" - Call for Registrations',  description: 'Registrations are now open for the Annual National Technical Symposium TECHNOVA. Events include 36-hr Hackathon, Paper Presentations, and Robo-Wars with cash prizes worth $10,000.', category: 'Event',     priority: 'High',   date: '2026-10-02' },
    { title: 'Tuition Fee Payment Deadline for Academic Year 2026-27',       description: 'All undergraduate and postgraduate students are reminded that the final date for clearing semester tuition fees without penalty is November 15th, 2026. Late fees apply thereafter.', category: 'Fee',       priority: 'High',   date: '2026-09-28' },
    { title: 'Campus Recruitment Drive - Apex Cloud & FinTech Innovations',  description: 'Apex Cloud Solutions and Global FinTech will be conducting on-campus aptitude tests and technical interviews for eligible 7th semester students this coming Monday. Check placement portal.', category: 'Placement', priority: 'High',   date: '2026-09-25' },
    { title: 'New Extended Central Library Timings for Final Exam Period',    description: 'Starting October 10th, the 2nd floor reading hall and digital knowledge center will stay open until midnight every day to support students preparing for upcoming examinations.', category: 'General',   priority: 'Normal', date: '2026-09-20' },
    { title: 'Maintenance Notice: Campus Wi-Fi & Student Portal Upgrade',    description: 'Routine server maintenance will take place on Saturday from 2:00 AM to 5:00 AM. Intermittent connectivity may occur during this maintenance window.', category: 'General',   priority: 'Low',    date: '2026-09-15' }
  ]);

  console.log('✅ Database seeded successfully.');
}
