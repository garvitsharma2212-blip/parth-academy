import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentClass } from '../types';

interface StudentAuthModalProps {
  onClose: () => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({ onClose }) => {
  const { loginStudent, registerStudent, students } = useApp();
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>('login');

  // Login form
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regRollNo, setRegRollNo] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regClass, setRegClass] = useState<StudentClass>('Class 12th');
  const [regParentName, setRegParentName] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regError, setRegError] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput.trim()) {
      setLoginError('Please enter your Roll Number or Email Address.');
      return;
    }
    const ok = loginStudent(loginInput);
    if (!ok) {
      setLoginError('Student record not found. Please verify your Roll No/Email or Register below.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setRegError('Please fill in student name, email, and mobile number.');
      return;
    }
    registerStudent({
      name: regName.trim(),
      rollNo: regRollNo.trim() || undefined,
      email: regEmail.trim(),
      phone: regPhone.trim(),
      studentClass: regClass,
      parentName: regParentName.trim() || 'Parent/Guardian',
      parentPhone: regParentPhone.trim() || regPhone.trim(),
    });
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSuccess(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '440px' }}
      >
        <div className="modal-header">
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#1261c9',
                background: '#eff6ff',
                padding: '3px 8px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe',
              }}
            >
              PARTH ACADEMY STUDENT PORTAL
            </span>
            <h3 style={{ marginTop: '4px' }}>
              {tab === 'login' ? 'Student Login' : tab === 'register' ? 'New Student Registration' : 'Password Recovery'}
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Tab switchers */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 20px',
            background: '#f8fafc',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setLoginError('');
            }}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: tab === 'login' ? 700 : 500,
              color: tab === 'login' ? '#1261c9' : '#64748b',
              borderBottom: tab === 'login' ? '2px solid #1261c9' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setRegError('');
            }}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: tab === 'register' ? 700 : 500,
              color: tab === 'register' ? '#1261c9' : '#64748b',
              borderBottom: tab === 'register' ? '2px solid #1261c9' : '2px solid transparent',
              cursor: 'pointer',
            }}
          >
            Register Student
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('forgot');
              setForgotSuccess(false);
            }}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              fontSize: '13px',
              fontWeight: tab === 'forgot' ? 700 : 500,
              color: tab === 'forgot' ? '#1261c9' : '#64748b',
              borderBottom: tab === 'forgot' ? '2px solid #1261c9' : '2px solid transparent',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Forgot?
          </button>
        </div>

        <div className="modal-body">
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
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
                  {loginError}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                  Roll Number or Email Address
                </label>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="e.g. PA-12-1084 or student@parthacademy.com"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                  autoFocus
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Password (Optional for Demo)</label>
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    style={{ fontSize: '12px', color: '#1261c9', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #092b63, #1261c9)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(18, 97, 201, 0.2)',
                }}
              >
                Sign In to Student Portal
              </button>

              {/* Quick demo student login pills */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Quick Login as Demo Student:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {students.slice(0, 3).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        loginStudent(s.rollNo);
                      }}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '14px',
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        color: '#334155',
                      }}
                    >
                      {s.avatar} {s.name} ({s.studentClass.replace('Class ', '')})
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              {regError && (
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
                  {regError}
                </div>
              )}

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                  Student Full Name *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Garvit Sharma"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Select Class *
                  </label>
                  <select
                    value={regClass}
                    onChange={(e) => setRegClass(e.target.value as StudentClass)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Class 12th">Class 12th (PCM)</option>
                    <option value="Class 10th">Class 10th (Science/Math)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Roll No (Optional)
                  </label>
                  <input
                    type="text"
                    value={regRollNo}
                    onChange={(e) => setRegRollNo(e.target.value)}
                    placeholder="Auto-generated if blank"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Student Email *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="student@example.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Parent Name
                  </label>
                  <input
                    type="text"
                    value={regParentName}
                    onChange={(e) => setRegParentName(e.target.value)}
                    placeholder="Father/Mother Name"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    value={regParentPhone}
                    onChange={(e) => setRegParentPhone(e.target.value)}
                    placeholder="Contact Number"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #092b63, #1261c9)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(18, 97, 201, 0.2)',
                }}
              >
                Complete Admission & Register
              </button>
            </form>
          )}

          {tab === 'forgot' && (
            <div>
              {forgotSuccess ? (
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    textAlign: 'center',
                  }}
                >
                  <b>✓ Recovery Instructions Sent!</b>
                  <p style={{ marginTop: '6px', color: '#166534' }}>
                    A password reset link and OTP has been dispatched to <b>{forgotEmail}</b> and your registered parent phone.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    style={{
                      marginTop: '12px',
                      padding: '8px 16px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit}>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                    Enter your registered email address or roll number to recover your student account credentials.
                  </p>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
                      Registered Email or Roll Number
                    </label>
                    <input
                      type="text"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. garvitsharma2212@gmail.com"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                      }}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: '#1261c9',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Send Recovery OTP
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
