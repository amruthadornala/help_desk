import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';

export function AdminLayout() {
  return (
    <div className="layout-shell">
      <Navbar />
      <div className="layout-body">
        <Sidebar mode="admin" />
        <main className="layout-main-content">
          <Outlet />
        </main>
      </div>
      <Footer />

      <style>{`
        .layout-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .layout-body {
          display: flex;
          flex: 1;
        }
        .layout-main-content {
          flex: 1;
          padding: 2rem;
          background: #f8fafc;
          max-width: 100%;
          overflow-x: hidden;
        }
        @media (max-width: 868px) {
          .layout-body {
            flex-direction: column;
          }
          .layout-main-content {
            padding: 1.25rem 1rem;
          }
        }
      `}</style>
    </div>
  );
}
