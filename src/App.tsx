import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { StudentNavTab, AdminNavTab } from './types';

// Student Mobile-First Coaching App Components
import { StudentHeader } from './components/student/StudentHeader';
import { StudentHome } from './components/student/StudentHome';
import { StudentMaterials } from './components/student/StudentMaterials';
import { StudentVideos } from './components/student/StudentVideos';
import { StudentTests } from './components/student/StudentTests';
import { StudentProfile } from './components/student/StudentProfile';
import { BottomNavBar } from './components/student/BottomNavBar';

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
    isAdminAuthenticated,
    switchRole,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
  } = useApp();

  // Navigation states - Default to mobile-first Home page
  const [studentTab, setStudentTab] = useState<StudentNavTab>('home');
  const [adminTab, setAdminTab] = useState<AdminNavTab>('overview');
  const [adminModalMode, setAdminModalMode] = useState<'login' | 'change_password' | 'forgot_password' | 'setup'>('login');

  // Enforce security: admin panel is completely separate and visible only after admin login
  useEffect(() => {
    if (currentRole === 'admin' && !isAdminAuthenticated) {
      switchRole('student');
    }
  }, [currentRole, isAdminAuthenticated, switchRole]);

  const handleOpenChangePassword = () => {
    setAdminModalMode('change_password');
    setIsAdminLoginModalOpen(true);
  };

  const handleAdminAccessClick = () => {
    if (isAdminAuthenticated && adminUser) {
      switchRole('admin');
    } else {
      setAdminModalMode('login');
      setIsAdminLoginModalOpen(true);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f4f7fb' }}>
      {/* ROLE: ADMIN PORTAL - STRICTLY SEPARATE & VISIBLE ONLY AFTER ADMIN LOGIN */}
      {currentRole === 'admin' && isAdminAuthenticated && adminUser ? (
        <>
          <AdminHeader
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            onOpenChangePassword={handleOpenChangePassword}
          />
          <main style={{ flex: 1, maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '0 20px 40px 20px' }}>
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
        /* ROLE: STUDENT PORTAL (MOBILE-FIRST COACHING APP) */
        <div style={{ paddingBottom: '76px', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <StudentHeader activeTab={studentTab} setActiveTab={setStudentTab} />

          <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 16px' }}>
            {/* Separate pages for each of the 5 navigation sections */}
            {(studentTab === 'home' || studentTab === 'dashboard') && (
              <StudentHome onNavigate={setStudentTab} />
            )}
            {studentTab === 'materials' && <StudentMaterials />}
            {studentTab === 'videos' && <StudentVideos />}
            {(studentTab === 'tests' || studentTab === 'results') && <StudentTests />}
            {(studentTab === 'profile' || studentTab === 'fees') && (
              <StudentProfile onLogoutClick={() => setStudentTab('home')} />
            )}
          </main>

          {/* Institutional Footer */}
          <footer
            style={{
              background: '#092b63',
              color: '#ffffff',
              padding: '36px 20px 32px 20px',
              marginTop: '40px',
              borderTop: '3px solid #ffb703',
            }}
          >
            <div
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '24px',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                paddingBottom: '24px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: '#ffb703',
                      color: '#092b63',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '16px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    }}
                  >
                    PA
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                    PARTH ACADEMY
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#93c5fd', maxWidth: '420px', lineHeight: 1.5 }}>
                  Premier Coaching Institute for Class 10th & Class 12th CBSE Boards, JEE Mains, and NEET Foundation.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '28px', fontSize: '13px', color: '#cbd5e1', flexWrap: 'wrap' }}>
                <div>
                  <b style={{ color: '#ffffff', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                    Admissions Office:
                  </b>
                  <div style={{ color: '#f1f5f9' }}>Near Priya School, Baran Road, Antah, Rajasthan</div>
                  <div style={{ color: '#ffb703', fontWeight: 700, marginTop: '2px' }}>
                    Helpline: +91 97846 64518
                  </div>
                </div>

                <div>
                  <b style={{ color: '#ffffff', display: 'block', marginBottom: '6px', fontSize: '13px' }}>
                    Administrative Access
                  </b>
                  <button
                    onClick={handleAdminAccessClick}
                    style={{
                      background: '#ffb703',
                      color: '#092b63',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🛡️</span> Admin Panel Login
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{
                maxWidth: '1200px',
                margin: '16px auto 0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#cbd5e1',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div>
                <div>© 2026 Parth Academy. All rights reserved.</div>
                <div style={{ color: '#ffb703', fontWeight: 600, marginTop: '2px' }}>
                  Designed by Garvit Sharma
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd', display: 'flex', alignItems: 'center' }}>
                Mobile-First Coaching Portal • CBSE & Foundation Batches
              </div>
            </div>
          </footer>

          {/* Bottom Navigation Bar for Mobile-First Coaching App */}
          <BottomNavBar activeTab={studentTab} setActiveTab={setStudentTab} />
        </div>
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
