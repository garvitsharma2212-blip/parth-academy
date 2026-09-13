import React from 'react';
import { useApp } from '../context/AppContext';

interface NotificationDrawerProps {
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'material':
        return '📚';
      case 'test':
        return '⏱️';
      case 'result':
        return '🏆';
      case 'fee':
        return '💳';
      default:
        return '📢';
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          maxWidth: '420px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
        }}
      >
        <div
          className="modal-header"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🔔</span>
            <h3 style={{ margin: 0, fontSize: '17px' }}>Institute Notifications</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={markAllNotificationsRead}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#1261c9',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Mark all read
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close notifications">
              ✕
            </button>
          </div>
        </div>

        <div
          style={{
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1,
          }}
        >
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔕</div>
              <p style={{ margin: 0, fontSize: '14px' }}>No new notifications at the moment.</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                style={{
                  background: notif.read ? '#ffffff' : '#f0f7ff',
                  border: notif.read ? '1px solid #e2e8f0' : '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '12px',
                  transition: 'background 0.15s ease',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: notif.read ? '#f1f5f9' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {getIcon(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <b style={{ fontSize: '13px', color: '#0f172a' }}>{notif.title}</b>
                    {!notif.read && (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: '#1261c9',
                          display: 'inline-block',
                          marginLeft: '4px',
                        }}
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 6px 0', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{notif.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
