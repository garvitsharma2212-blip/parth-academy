import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminNavTab } from '../../types';

interface AdminHeaderProps {
  activeTab: AdminNavTab;
  setActiveTab: (tab: AdminNavTab) => void;
  onOpenChangePassword: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, setActiveTab, onOpenChangePassword }) => {
  const { adminUser, logoutAdmin, switchRole } = useApp();

  const tabs: { id: AdminNavTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'materials', label: 'Study Materials', icon: '📚' },
    { id: 'videos', label: 'Video Lectures', icon: '🎥' },
    { id: 'tests', label: 'Tests Management', icon: '⏱️' },
    { id: 'results', label: 'Results & Ranks', icon: '🏆' },
    { id: 'fees', label: 'Fees & Accounts', icon: '💳' },
    { id: 'students', label: 'Students Roster', icon: '👥' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
  ];

  return (
    <header style={{ background: '#092b63', color: '#ffffff', position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid #1e3a8a' }}>
      {/* Top micro bar */}
      <div
        style={{
          background: '#041738',
          padding: '6px 20px',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#93c5fd',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ffb703', fontWeight: 700 }}>🔒 SECURE ADMINISTRATIVE ENVIRONMENT</span>
          <span>•</span>
          <span
            style={{
              background: '#065f46',
              color: '#6ee7b7',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Connected to Firebase Firestore & Storage"
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span>
            🔥 Firebase Live Sync
          </span>
          <span>•</span>
          <span>Logged in as: <b>{adminUser?.name}</b> ({adminUser?.role})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={onOpenChangePassword}
            style={{
              background: 'none',
              border: 'none',
              color: '#93c5fd',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            🔑 Change Password
          </button>
          <button
            onClick={() => switchRole('student')}
            style={{
              background: '#1261c9',
              color: '#ffffff',
              border: 'none',
              padding: '2px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            👁️ Switch to Student View
          </button>
          <button
            onClick={logoutAdmin}
            style={{
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              padding: '2px 10px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            🚪 Admin Logout
          </button>
        </div>
      </div>

      {/* Main Admin Nav */}
      <div
        style={{
          maxWidth: '1360px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('overview')}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#092b63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '18px',
            }}
          >
            PA
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', color: '#ffffff' }}>
                PARTH ACADEMY
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  background: '#ffb703',
                  color: '#092b63',
                  padding: '1px 8px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                ADMIN PANEL
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#93c5fd' }}>
              Central Coaching Institute Management Control
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '4px 0' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isActive ? '#1261c9' : 'transparent',
                  color: isActive ? '#ffffff' : '#cbd5e1',
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
      </div>
    </header>
  );
};
