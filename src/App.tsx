import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StudentNavTab, AdminNavTab } from './types';

// Student Portal Components
import { StudentHeader } from './components/student/StudentHeader';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentMaterials } from './components/student/StudentMaterials';
import { StudentVideos } from './components/student/StudentVideos';
import { StudentTests } from './components/student/StudentTests';
import { StudentResults } from './components/student/StudentResults';
import { StudentFees } from './components/student/StudentFees';

// Admin Portal Components
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminMaterials } from './components/admin/AdminMaterials';
import { AdminVideos } from './components/admin/AdminVideos';
import { AdminTests } from './components/admin/AdminTests';
import { AdminResults } from './components/admin/AdminResults';
import { AdminFees } from './components/admin/AdminFees';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminAnnouncements } from './components/admin/AdminAnnouncements';

// Modals
import { StudentAuthModal } from './components/StudentAuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { NotificationDrawer } from './components/NotificationDrawer';

const MainApp: React.FC = () => {
  const {
    currentRole,
    adminUser,
    switchRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
  } = useApp();

  // Navigation states
  const [studentTab, setStudentTab] = useState<StudentNavTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminNavTab>('overview');
  const [adminModalMode, setAdminModalMode] = useState<'login' | 'change_password'>('login');

  const handleOpenChangePassword = () => {
    setAdminModalMode('change_password');
    setIsAdminLoginModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f7fb' }}>
      {/* ROLE: ADMIN PORTAL */}
      {currentRole === 'admin' ? (
        <>
          {adminUser ? (
            <>
              <AdminHeader
                activeTab={adminTab}
                setActiveTab={setAdminTab}
                onOpenChangePassword={handleOpenChangePassword}
              />
              <main style={{ flex: 1, maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
                {adminTab === 'overview' && <AdminOverview onNavigate={setAdminTab} />}
                {adminTab === 'materials' && <AdminMaterials />}
                {adminTab === 'videos' && <AdminVideos />}
                {adminTab === 'tests' && <AdminTests />}
                {adminTab === 'results' && <AdminResults />}
                {adminTab === 'fees' && <AdminFees />}
                {adminTab === 'students' && <AdminStudents />}
                {adminTab === 'announcements' && <AdminAnnouncements />}
              </main>
            </>
          ) : (
            // Admin Login Gate Screen
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                background: 'linear-gradient(135deg, #092b63 0%, #041738 100%)',
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '36px 32px',
                  maxWidth: '440px',
                  width: '100%',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: '#092b63',
                    color: '#ffb703',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 900,
                    margin: '0 auto 16px auto',
                  }}
                >
                  PA
                </div>
                <h2 style={{ fontSize: '22px', color: '#092b63', margin: '0 0 6px 0' }}>
                  Admin Security Gateway
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
                  Access restricted to institute directors, teachers, and account officers.
                </p>

                <div
                  style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '12px',
                    color: '#1e40af',
                    marginBottom: '20px',
                    textAlign: 'left',
                  }}
                >
                  <b>Default Administrative Credentials:</b>
                  <div style={{ marginTop: '4px' }}>Email: <code>admin@parthacademy.com</code></div>
                  <div>Passcode: <code>admin123</code></div>
                </div>

                <button
                  onClick={() => {
                    setAdminModalMode('login');
                    setIsAdminLoginModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#092b63',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(9, 43, 99, 0.3)',
                    marginBottom: '12px',
                  }}
                >
                  🔒 Unlock Admin Panel
                </button>

                <button
                  onClick={() => switchRole('student')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '13px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Return to Student Portal
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ROLE: STUDENT PORTAL */
        <>
          <StudentHeader activeTab={studentTab} setActiveTab={setStudentTab} />

          <main style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
            {studentTab === 'dashboard' && <StudentDashboard onNavigate={setStudentTab} />}
            {studentTab === 'materials' && <StudentMaterials />}
            {studentTab === 'videos' && <StudentVideos />}
            {studentTab === 'tests' && <StudentTests />}
            {studentTab === 'results' && <StudentResults />}
            {studentTab === 'fees' && <StudentFees />}
          </main>

          {/* Institutional Footer */}
          <footer
            style={{
              background: '#092b63',
              color: '#ffffff',
              padding: '36px 20px 24px 20px',
              marginTop: '40px',
              borderTop: '3px solid #ffb703',
            }}
          >
            <div
              style={{
                maxWidth: '1280px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: '24px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ffb703',
                      color: '#092b63',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '15px',
                    }}
                  >
                    PA
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>PARTH ACADEMY</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#93c5fd', maxWidth: '400px' }}>
                  Premier Coaching Institute for Class 10th & Class 12th CBSE Boards, JEE Mains, and NEET Foundation.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#cbd5e1' }}>
                <div>
                  <b style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>Admissions Office</b>
                  <div>Sector 14, Main Institutional Area</div>
                  <div>Helpline: +91 98765 00000</div>
                </div>
                <div>
                  <b style={{ color: '#ffffff', display: 'block', marginBottom: '4px' }}>Administrative Access</b>
                  <button
                    onClick={() => switchRole('admin')}
                    style={{
                      background: '#ffb703',
                      color: '#092b63',
                      border: 'none',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    🛡️ Admin Panel Login
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                maxWidth: '1280px',
                margin: '16px auto 0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                color: '#93c5fd',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span>© 2026 Parth Academy. All rights reserved. Designed for Excellence.</span>
              <span>Class 10th & 12th Coaching Management Platform</span>
            </div>
          </footer>
        </>
      )}

      {/* GLOBAL MODALS */}
      {isAuthModalOpen && (
        <StudentAuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isAdminLoginModalOpen && (
        <AdminLoginModal
          initialMode={adminModalMode}
          onClose={() => setIsAdminLoginModalOpen(false)}
        />
      )}

      {isNotificationsOpen && (
        <NotificationDrawer onClose={() => setIsNotificationsOpen(false)} />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
