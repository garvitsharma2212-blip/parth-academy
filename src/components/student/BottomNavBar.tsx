import React from 'react';
import { StudentNavTab } from '../../types';

interface BottomNavBarProps {
  activeTab: StudentNavTab;
  setActiveTab: (tab: StudentNavTab) => void;
  unreadCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount = 0,
}) => {
  // Normalize 'dashboard' to 'home'
  const currentActive = activeTab === 'dashboard' ? 'home' : activeTab;

  const navItems: { id: StudentNavTab; label: string; icon: string; badge?: string | number }[] = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'materials', label: 'Study Material', icon: '📚' },
    { id: 'videos', label: 'Video Lectures', icon: '🎥' },
    { id: 'tests', label: 'Tests', icon: '⏱️' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <nav
      className="bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(16px)',
        borderTop: '1.5px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '6px 10px calc(8px + env(safe-area-inset-bottom, 0px)) 10px',
        zIndex: 50,
        boxShadow: '0 -4px 20px rgba(9, 43, 99, 0.08)',
      }}
      aria-label="Bottom Navigation"
    >
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {navItems.map((item) => {
          const isActive =
            currentActive === item.id ||
            (item.id === 'home' && activeTab === 'dashboard') ||
            (item.id === 'tests' && activeTab === 'results') ||
            (item.id === 'profile' && activeTab === 'fees');

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                background: isActive ? '#eff6ff' : 'transparent',
                border: 'none',
                color: isActive ? '#092b63' : '#64748b',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                minWidth: '58px',
                transform: isActive ? 'translateY(-2px)' : 'none',
              }}
            >
              {/* Active gold dot accent indicator */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    width: '14px',
                    height: '3px',
                    borderRadius: '3px',
                    background: '#ffb703',
                  }}
                />
              )}

              <span
                style={{
                  fontSize: '20px',
                  lineHeight: 1,
                  filter: isActive ? 'drop-shadow(0 2px 4px rgba(9, 43, 99, 0.15))' : 'none',
                  marginBottom: '3px',
                  display: 'inline-block',
                  transition: 'transform 0.15s ease',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                }}
              >
                {item.icon}
              </span>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 800 : 500,
                  whiteSpace: 'nowrap',
                  color: isActive ? '#092b63' : '#64748b',
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
