import React, { useState } from 'react';
import { useApp, SECURE_ADMIN_EMAIL } from '../context/AppContext';

interface AdminLoginModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'change_password' | 'forgot_password' | 'setup';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, initialMode = 'login' }) => {
  const { loginAdmin, setupAdminAccount, sendAdminPasswordReset, changeAdminPassword, adminUser, isAdminAuthenticated } = useApp();
  const [view, setView] = useState<'login' | 'change_password' | 'forgot_password' | 'setup'>(initialMode);

  // Form states
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [setupPassword, setSetupPassword] = useState('');
  const [setupConfirm, setSetupConfirm] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg('Please enter your administrator secret password.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await loginAdmin(password.trim(), SECURE_ADMIN_EMAIL);
      if (!res.success) {
        setErrorMsg(res.error || 'Authentication failed. Please verify your credentials.');
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (setupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (setupPassword !== setupConfirm) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await setupAdminAccount(setupPassword);
      if (res.success) {
        setSuccessMsg('Admin account initialized successfully in Firebase! Logging in...');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMsg(res.error || 'Failed to initialize account in Firebase.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Setup error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const res = await sendAdminPasswordReset();
      if (res.success) {
        setSuccessMsg(`A secure password reset link has been dispatched to ${SECURE_ADMIN_EMAIL}. Please check your inbox and spam folder.`);
      } else {
        setErrorMsg(res.error || 'Failed to send reset email.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMsg('New password and confirmation do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await changeAdminPassword(newPass);
      if (res.success) {
        setSuccessMsg('Admin password updated successfully in Firebase Authentication!');
        setTimeout(() => {
          setView('login');
          setPassword(newPass);
        }, 1500);
      } else {
        setErrorMsg(res.error || 'Failed to update password.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '440px', borderTop: '4px solid #092b63' }}
      >
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              <span
                style={{
                  fontSize: '11px',
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  border: '1px solid #a7f3d0',
                }}
              >
                🔒 Firebase Auth Protected
              </span>
            </div>
            <h3 style={{ marginTop: '6px', fontSize: '18px', color: '#0f172a' }}>
              {view === 'login' && 'Director Access Gateway'}
              {view === 'setup' && 'First-Time Admin Account Setup'}
              {view === 'forgot_password' && 'Reset Admin Password'}
              {view === 'change_password' && 'Change Secret Password'}
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
                lineHeight: 1.4,
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#15803d',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '14px',
                lineHeight: 1.4,
              }}
            >
              ✓ {successMsg}
            </div>
          )}

          {/* VIEW: LOGIN */}
          {view === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    Authorized Director Account
                  </label>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>
                    Verified Identity
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>👤</span>
                  <span>{SECURE_ADMIN_EMAIL}</span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                  Access is strictly restricted to this personal email address only.
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                    Secret Password <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot_password');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={{
                      fontSize: '12px',
                      color: '#092b63',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter your secret admin password"
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                    }}
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#64748b',
                      fontSize: '13px',
                      padding: '4px',
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#092b63',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(9, 43, 99, 0.25)',
                  marginBottom: '14px',
                }}
              >
                {isLoading ? (
                  <span>Authenticating with Firebase...</span>
                ) : (
                  <>
                    <span>🛡️</span> Authenticate & Open Admin Console
                  </>
                )}
              </button>

              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setView('setup');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#092b63',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  First-Time Admin Setup
                </button>
                {isAdminAuthenticated && (
                  <button
                    type="button"
                    onClick={() => {
                      setView('change_password');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    Update Secret Password
                  </button>
                )}
              </div>
            </form>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot_password' && (
            <form onSubmit={handleForgotPassword}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#334155',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 700, color: '#092b63', marginBottom: '4px' }}>
                  Firebase Authentication Password Recovery
                </div>
                Clicking the button below will dispatch an official password reset link directly from Firebase to your authorized personal email address:
                <div
                  style={{
                    marginTop: '8px',
                    fontWeight: 700,
                    color: '#0f172a',
                    padding: '6px 10px',
                    background: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  📧 {SECURE_ADMIN_EMAIL}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
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
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#092b63',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Dispatching Link...' : 'Send Password Reset Link'}
                </button>
              </div>
            </form>
          )}

          {/* VIEW: FIRST-TIME SETUP */}
          {view === 'setup' && (
            <form onSubmit={handleSetup}>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: '#334155',
                  lineHeight: 1.4,
                }}
              >
                <b>Initialize Director Credentials:</b> This will register your secret password in Firebase Authentication for{' '}
                <span style={{ fontWeight: 700, color: '#092b63' }}>{SECURE_ADMIN_EMAIL}</span>. No default or hardcoded passwords will be stored.
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Create Secret Password *
                </label>
                <input
                  type="password"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Min 6 characters (alphanumeric)"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  required
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Confirm Secret Password *
                </label>
                <input
                  type="password"
                  value={setupConfirm}
                  onChange={(e) => setSetupConfirm(e.target.value)}
                  placeholder="Re-enter secret password"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
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
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#059669',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Creating in Firebase...' : 'Save & Initialize Admin'}
                </button>
              </div>
            </form>
          )}

          {/* VIEW: CHANGE PASSWORD */}
          {view === 'change_password' && (
            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  New Secret Password *
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Min 6 characters"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
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
                  placeholder="Repeat new secret password"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
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
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#092b63',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? 'Updating in Firebase...' : 'Update Password in Firebase'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
