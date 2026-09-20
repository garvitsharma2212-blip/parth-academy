import React from 'react';
import { useApp } from '../../context/AppContext';
import { StudentNavTab, StudentClass } from '../../types';

interface StudentHeaderProps {
  activeTab: StudentNavTab;
  setActiveTab: (tab: StudentNavTab) => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentStudent,
    selectedClass,
    setSelectedClass,
    notifications,
    setIsNotificationsOpen,
    setIsAuthModalOpen,
    setIsAdminLoginModalOpen,
    switchRole,
    logoutStudent,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navItems: { id: StudentNavTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'materials', label: 'Study Material', icon: '📚' },
    { id: 'videos', label: 'Video Lectures', icon: '🎥' },
    { id: 'tests', label: 'Tests', icon: '⏱️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
      {/* Top micro-bar */}
      <div
        style={{
          background: '#092b63',
          color: '#ffffff',
          padding: '6px 20px',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ffb703', fontWeight: 700 }}>
            ★ ADMISSIONS OPEN FOR 2026-27 • CBSE BOARDS & JEE/NEET BATCHES
          </span>
          <span style={{ display: 'none', color: '#94a3b8' }} className="sm-show">
            Helpline: +91 97846 64518
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Class Switcher Pill */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.12)', borderRadius: '20px', padding: '2px' }}>
            <button
              onClick={() => setSelectedClass('Class 12th')}
              style={{
                border: 'none',
                background: selectedClass === 'Class 12th' ? '#1261c9' : 'transparent',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: selectedClass === 'Class 12th' ? 700 : 500,
                padding: '2px 10px',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              Class 12th (PCM)
            </button>
            <button
              onClick={() => setSelectedClass('Class 10th')}
              style={{
                border: 'none',
                background: selectedClass === 'Class 10th' ? '#1261c9' : 'transparent',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: selectedClass === 'Class 10th' ? 700 : 500,
                padding: '2px 10px',
                borderRadius: '16px',
                cursor: 'pointer',
              }}
            >
              Class 10th
            </button>
          </div>

          {/* Admin Login Button - Securely opens login modal */}
          <button
            onClick={() => setIsAdminLoginModalOpen(true)}
            style={{
              background: '#ffb703',
              color: '#092b63',
              border: 'none',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>🛡️</span> Admin Login
          </button>
        </div>
      </div>

      {/* Main navigation bar */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #092b63, #1261c9)',
              color: '#ffb703',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              boxShadow: '0 2px 8px rgba(9, 43, 99, 0.2)',
            }}
          >
            PA
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#092b63', letterSpacing: '-0.3px' }}>
                PARTH ACADEMY
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  background: '#eff6ff',
                  color: '#1261c9',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: '1px solid #bfdbfe',
                }}
              >
                STUDENT
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
              Learn • Practice • Succeed • {selectedClass}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0' }}>
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#1261c9' : '#475569',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Notifications Bell */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              fontSize: '16px',
            }}
            aria-label="Notifications"
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Student Profile Pill */}
          {currentStudent ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                padding: '4px 10px 4px 6px',
                borderRadius: '24px',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                }}
              >
                {currentStudent.avatar || '👨‍🎓'}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                <b style={{ fontSize: '12px', color: '#0f172a', display: 'block' }}>{currentStudent.name}</b>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{currentStudent.rollNo}</span>
              </div>
              <button
                onClick={logoutStudent}
                title="Sign out or switch student"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '12px',
                  cursor: 'pointer',
                  marginLeft: '4px',
                  padding: '2px',
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#1261c9',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Student Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
