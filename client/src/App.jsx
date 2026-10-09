import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Layout & Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { Register } from './pages/Register';

// Student Layout & Pages
import { StudentLayout } from './layouts/StudentLayout';
import { StudentDashboard } from './pages/StudentDashboard';
import { ChatHelpDesk } from './pages/ChatHelpDesk';
import { FaqsPage } from './pages/FaqsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { CollegeInfoPage } from './pages/CollegeInfoPage';
import { ChatHistoryPage } from './pages/ChatHistoryPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Layout & Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminFaqs } from './pages/admin/AdminFaqs';
import { AdminKnowledge } from './pages/admin/AdminKnowledge';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminQuestions } from './pages/admin/AdminQuestions';
import { AdminFeedback } from './pages/admin/AdminFeedback';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Student Protected Portal Routes */}
          <Route
            element={
              <ProtectedRoute>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/chat" element={<ChatHelpDesk />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/college-info" element={<CollegeInfoPage />} />
            <Route path="/history" element={<ChatHistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Protected Portal Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="faqs" element={<AdminFaqs />} />
            <Route path="knowledge" element={<AdminKnowledge />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
