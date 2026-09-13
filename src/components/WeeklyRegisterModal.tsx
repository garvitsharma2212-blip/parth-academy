import React, { useState } from 'react';
import { StudentClass, WeeklyTestRegistration } from '../types';

interface WeeklyRegisterModalProps {
  initialName?: string;
  initialClass: StudentClass;
  existingRegistration: WeeklyTestRegistration | null;
  onRegister: (registration: WeeklyTestRegistration, autoStart: boolean) => void;
  onClose: () => void;
  targetTestTitle?: string;
}

export const WeeklyRegisterModal: React.FC<WeeklyRegisterModalProps> = ({
  initialName = '',
  initialClass,
  existingRegistration,
  onRegister,
  onClose,
  targetTestTitle,
}) => {
  const [studentName, setStudentName] = useState(
    existingRegistration?.studentName || initialName || 'Garvit Sharma'
  );
  const [selectedClass, setSelectedClass] = useState<StudentClass>(
    existingRegistration?.studentClass || initialClass
  );
  const [rollNo, setRollNo] = useState(
    existingRegistration?.rollNo || `PA-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (autoStart: boolean) => {
    const trimmed = studentName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter the student full name to register.');
      return;
    }
    if (trimmed.length < 2) {
      setErrorMsg('Name must be at least 2 characters long.');
      return;
    }

    const regData: WeeklyTestRegistration = {
      studentName: trimmed,
      studentClass: selectedClass,
      rollNo: rollNo.trim() || `PA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      registeredAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    onRegister(regData, autoStart);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '460px' }}
      >
        <div className="modal-header">
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#1261c9',
                background: '#eff6ff',
                padding: '3px 9px',
                borderRadius: '12px',
                border: '1px solid #bfdbfe',
              }}
            >
              PARTH ACADEMY EXAM CELL
            </span>
            <h3 style={{ marginTop: '6px' }}>Weekly Test Registration</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
              Register your student details for upcoming weekly test.
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close registration modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Exam info badge */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#092b63',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                flexShrink: 0,
              }}
            >
              📝
            </div>
            <div>
              <b style={{ fontSize: '14px', color: '#0f172a', display: 'block' }}>
                {targetTestTitle || `Weekly Test #13 (${selectedClass})`}
              </b>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Sunday 10:00 AM • Official Online Timed Test
              </span>
            </div>
          </div>

          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(true);
            }}
          >
            {/* Student Name */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="input-student-name"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '6px',
                }}
              >
                Student Full Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="input-student-name"
                type="text"
                value={studentName}
                onChange={(e) => {
                  setStudentName(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter student full name (e.g. Garvit Sharma)"
                autoFocus
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#1261c9')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />
              <small style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                This name will appear on the admit card, timer, and score certificate.
              </small>
            </div>

            {/* Select Class: Class 10th or Class 12th */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '6px',
                }}
              >
                Select Class <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  type="button"
                  id="btn-select-class-12"
                  onClick={() => setSelectedClass('Class 12th')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: selectedClass === 'Class 12th' ? '2px solid #1261c9' : '1px solid #cbd5e1',
                    background: selectedClass === 'Class 12th' ? '#eff6ff' : '#ffffff',
                    color: selectedClass === 'Class 12th' ? '#092b63' : '#334155',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>🎓 Class 12th</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>
                    PCM / Science
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-select-class-10"
                  onClick={() => setSelectedClass('Class 10th')}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: selectedClass === 'Class 10th' ? '2px solid #1261c9' : '1px solid #cbd5e1',
                    background: selectedClass === 'Class 10th' ? '#eff6ff' : '#ffffff',
                    color: selectedClass === 'Class 10th' ? '#092b63' : '#334155',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>🎒 Class 10th</span>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: '#64748b' }}>
                    Math & Science
                  </span>
                </button>
              </div>
            </div>

            {/* Candidate Roll Number */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label
                  htmlFor="input-roll-no"
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#1e293b',
                  }}
                >
                  Candidate Roll Number
                </label>
                <button
                  type="button"
                  onClick={() => setRollNo(`PA-2026-${Math.floor(1000 + Math.random() * 9000)}`)}
                  style={{
                    fontSize: '11px',
                    color: '#1261c9',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Regenerate
                </button>
              </div>
              <input
                id="input-roll-no"
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  background: '#f8fafc',
                  color: '#334155',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="submit"
                id="btn-register-and-start"
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #092b63, #1261c9)',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(18, 97, 201, 0.25)',
                }}
              >
                <span>🚀</span> Confirm & Start Weekly Test
              </button>

              <button
                type="button"
                id="btn-save-registration-only"
                onClick={() => handleSubmit(false)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save Registration (Start Later)
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
