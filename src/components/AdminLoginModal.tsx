import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface AdminLoginModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'change_password';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, initialMode = 'login' }) => {
  const { loginAdmin, changeAdminPassword, adminUser } = useApp();
  const [view, setView] = useState<'login' | 'change_password'>(initialMode);

  // Login inputs
  const [email, setEmail] = useState(adminUser?.email || 'admin@parthacademy.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Change password inputs
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginAdmin(password.trim());
    if (!success) {
      setErrorMsg('Invalid administrative credentials. Default demo passcode is: admin123');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setChangeSuccess('');

    if (newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    const ok = changeAdminPassword(oldPass, newPass);
    if (!ok) {
      setErrorMsg('Current password is incorrect. (Default demo is admin123)');
      return;
    }

    setChangeSuccess('Admin password updated successfully! Please login with your new credentials.');
    setTimeout(() => {
      setView('login');
      setPassword(newPass);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '420px', borderTop: '4px solid #092b63' }}
      >
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  background: '#092b63',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px',
                }}
              >
                ADMIN CONSOLE
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Restricted Access</span>
            </div>
            <h3 style={{ marginTop: '4px' }}>
              {view === 'login' ? 'Admin Portal Authentication' : 'Change Admin Password'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '14px',
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {changeSuccess && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '14px',
              }}
            >
              ✓ {changeSuccess}
            </div>
          )}

          {view === 'login' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Admin Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: '#f8fafc',
                  }}
                  readOnly
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    Admin Password <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('change_password');
                      setErrorMsg('');
                    }}
                    style={{ fontSize: '11px', color: '#1261c9', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Change Password
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter admin password (demo: admin123)"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              </div>

              {/* Demo Hint Banner */}
              <div
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  color: '#1e40af',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🔑</span>
                <span>
                  Default Admin Password: <b>admin123</b>
                </span>
              </div>

              <button
                type="submit"
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(9, 43, 99, 0.25)',
                }}
              >
                <span>🛡️</span> Authenticate & Open Admin Panel
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Current Password *
                </label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="e.g. admin123"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  New Admin Password *
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat new password"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#1261c9',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
