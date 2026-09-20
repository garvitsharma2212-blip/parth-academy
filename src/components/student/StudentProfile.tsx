import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentFeeRecord, FeePayment } from '../../types';
import { FeeReceiptModal } from '../FeeReceiptModal';

interface StudentProfileProps {
  onLogoutClick?: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ onLogoutClick }) => {
  const {
    currentStudent,
    students,
    selectedClass,
    setSelectedClass,
    fees,
    addFeePayment,
    loginStudent,
    logoutStudent,
    setIsAuthModalOpen,
  } = useApp();

  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<FeePayment | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(5000);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [payRemarks, setPayRemarks] = useState('Tuition Installment');
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [showSwitchStudent, setShowSwitchStudent] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Student details or fallback
  const student = currentStudent || students[0];

  // Fee record
  const studentFee: StudentFeeRecord =
    fees.find((f) => f.studentId === student?.id) ||
    fees.find((f) => f.studentClass === selectedClass) ||
    fees[0];

  // Attendance metrics
  const totalClasses = 124;
  const attendedClasses = 117;
  const attendanceRate = Math.round((attendedClasses / totalClasses) * 100);

  // 28 days visual streak
  const attendanceDays = Array.from({ length: 28 }, (_, i) => {
    // 95% attendance with occasional absent/leave
    const status = i === 5 || i === 19 ? 'absent' : i % 7 === 6 ? 'sunday' : 'present';
    return { day: i + 1, status };
  });

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFee) return;
    setIsProcessingPay(true);
    setTimeout(() => {
      const payment = addFeePayment(studentFee.studentId, {
        amount: Number(payAmount),
        method: payMethod,
        remarks: payRemarks,
      });
      setIsProcessingPay(false);
      setIsPayModalOpen(false);
      setSelectedReceiptPayment(payment);
    }, 800);
  };

  const handleConfirmLogout = () => {
    logoutStudent();
    setShowLogoutConfirm(false);
    if (onLogoutClick) {
      onLogoutClick();
    }
  };

  return (
    <div style={{ padding: '20px 0 40px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#092b63',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            MY ACADEMY PORTAL
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Student Profile & Records</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Student Profile & Records</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Manage your academy identity, daily attendance record, tuition fee balance, and verified receipts.
        </p>
      </div>

      {/* 1. STUDENT DETAILS CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #092b63 0%, #1e3a8a 100%)',
          borderRadius: '20px',
          padding: '24px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(9, 43, 99, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: '#ffb703',
              color: '#092b63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '34px',
              border: '3px solid #ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              flexShrink: 0,
            }}
          >
            {student ? student.avatar || '👨‍🎓' : '👤'}
          </div>

          <div style={{ flex: 1, minWidth: '220px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  background: 'rgba(255, 183, 3, 0.25)',
                  color: '#ffb703',
                  border: '1px solid rgba(255, 183, 3, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                ROLL NO: {student ? student.rollNo : 'PA-2026-01'}
              </span>
              <span style={{ fontSize: '11px', color: '#93c5fd' }}>
                Batch: Super-40 Regular
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '2px 0 6px 0', color: '#ffffff' }}>
              {student ? student.name : 'Guest Student'}
            </h2>

            <div style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span>Class: <b style={{ color: '#ffffff' }}>{student?.studentClass || selectedClass}</b></span>
              <span>•</span>
              <span>Stream: <b style={{ color: '#ffffff' }}>CBSE Science (PCM/PCB)</b></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setShowSwitchStudent(!showSwitchStudent)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              🔄 Switch Demo Student
            </button>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}
        >
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>GUARDIAN NAME</span>
            <b style={{ fontSize: '13px', color: '#ffffff' }}>Mr. Rajesh Sharma</b>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>REGISTERED CONTACT</span>
            <b style={{ fontSize: '13px', color: '#ffb703' }}>+91 97846 64518</b>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>RESIDENTIAL ADDRESS</span>
            <b style={{ fontSize: '13px', color: '#ffffff' }}>Near Priya School, Antah (Rajasthan)</b>
          </div>
        </div>

        {/* Switch Student Dropdown Drawer */}
        {showSwitchStudent && (
          <div
            style={{
              marginTop: '16px',
              background: '#ffffff',
              color: '#092b63',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          >
            <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 800 }}>Select Student Profile:</h4>
            <div style={{ display: 'grid', gap: '8px' }}>
              {students.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    loginStudent(s.rollNo);
                    setSelectedClass(s.studentClass);
                    setShowSwitchStudent(false);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: student?.id === s.id ? '#eff6ff' : '#f8fafc',
                    border: student?.id === s.id ? '1.5px solid #1261c9' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{s.avatar || '👨‍🎓'}</span>
                    <div>
                      <b style={{ fontSize: '13px', display: 'block' }}>{s.name}</b>
                      <small style={{ color: '#64748b' }}>{s.rollNo} • {s.studentClass}</small>
                    </div>
                  </div>
                  {student?.id === s.id && <span style={{ color: '#1261c9', fontWeight: 800 }}>✓ Active</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. ATTENDANCE SECTION */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>📅</span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#092b63', margin: 0 }}>
                Biometric & Classroom Attendance
              </h2>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Verified physical classroom logs synced daily from the Antah campus.
            </p>
          </div>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              background: '#dcfce7',
              color: '#15803d',
              border: '1px solid #86efac',
              fontSize: '12px',
              fontWeight: 800,
            }}
          >
            ✓ {attendanceRate}% REGULAR (EXEMPLARY)
          </span>
        </div>

        {/* 3 Metric counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TOTAL WORKING DAYS</span>
            <b style={{ fontSize: '18px', color: '#092b63' }}>{totalClasses} Days</b>
          </div>
          <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '11px', color: '#166534', display: 'block' }}>DAYS PRESENT</span>
            <b style={{ fontSize: '18px', color: '#16a34a' }}>{attendedClasses} Days</b>
          </div>
          <div style={{ background: '#fef2f2', padding: '12px 14px', borderRadius: '10px', border: '1px solid #fecaca' }}>
            <span style={{ fontSize: '11px', color: '#991b1b', display: 'block' }}>ABSENT / LEAVES</span>
            <b style={{ fontSize: '18px', color: '#dc2626' }}>{totalClasses - attendedClasses} Days</b>
          </div>
          <div style={{ background: '#eff6ff', padding: '12px 14px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
            <span style={{ fontSize: '11px', color: '#1e40af', display: 'block' }}>MINIMUM REQUIRED</span>
            <b style={{ fontSize: '18px', color: '#1d4ed8' }}>75% for Boards</b>
          </div>
        </div>

        {/* 28-Day Visual Grid */}
        <div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#092b63', display: 'block', marginBottom: '8px' }}>
            Recent 28-Day Classroom Log:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(32px, 1fr))', gap: '6px' }}>
            {attendanceDays.map((item) => (
              <div
                key={item.day}
                title={`Day ${item.day}: ${item.status.toUpperCase()}`}
                style={{
                  height: '32px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                  background:
                    item.status === 'present'
                      ? '#dcfce7'
                      : item.status === 'absent'
                      ? '#fee2e2'
                      : '#f1f5f9',
                  color:
                    item.status === 'present'
                      ? '#15803d'
                      : item.status === 'absent'
                      ? '#dc2626'
                      : '#94a3b8',
                  border:
                    item.status === 'present'
                      ? '1px solid #86efac'
                      : item.status === 'absent'
                      ? '1px solid #fca5a5'
                      : '1px solid #e2e8f0',
                }}
              >
                {item.day}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '14px', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
            <span>🟢 Present</span>
            <span>🔴 Absent</span>
            <span>⚪ Sunday Off</span>
          </div>
        </div>
      </div>

      {/* 3. FEE STATUS SECTION */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>💳</span>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#092b63', margin: 0 }}>
                Course Fee Status & Receipts
              </h2>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              Annual coaching fee structure and payment installment history.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                padding: '6px 12px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 800,
                background: studentFee?.status === 'paid' ? '#dcfce7' : '#fef3c7',
                color: studentFee?.status === 'paid' ? '#15803d' : '#b45309',
                border: studentFee?.status === 'paid' ? '1px solid #86efac' : '1px solid #fde68a',
              }}
            >
              {studentFee?.status === 'paid' ? '✓ FULLY CLEARED' : studentFee?.status === 'partial' ? 'PARTIALLY PAID' : 'UNPAID'}
            </span>
          </div>
        </div>

        {/* Fee breakdown bars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '18px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TOTAL TUITION</span>
            <b style={{ fontSize: '18px', color: '#092b63' }}>₹{studentFee?.totalFee.toLocaleString('en-IN') || '45,000'}</b>
          </div>
          <div style={{ background: '#f0fdf4', padding: '14px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '11px', color: '#166534', display: 'block' }}>AMOUNT PAID</span>
            <b style={{ fontSize: '18px', color: '#16a34a' }}>₹{studentFee?.paidAmount.toLocaleString('en-IN') || '45,000'}</b>
          </div>
          <div style={{ background: studentFee?.dueAmount > 0 ? '#fef2f2' : '#f8fafc', padding: '14px', borderRadius: '10px', border: studentFee?.dueAmount > 0 ? '1px solid #fecaca' : '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: studentFee?.dueAmount > 0 ? '#991b1b' : '#64748b', display: 'block' }}>BALANCE DUE</span>
            <b style={{ fontSize: '18px', color: studentFee?.dueAmount > 0 ? '#dc2626' : '#15803d' }}>
              ₹{studentFee?.dueAmount.toLocaleString('en-IN') || '0'}
            </b>
          </div>
        </div>

        {/* Action buttons: Pay Online & View Verified Receipts */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {studentFee && studentFee.dueAmount > 0 ? (
            <button
              onClick={() => setIsPayModalOpen(true)}
              style={{
                background: '#092b63',
                color: '#ffb703',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>💳</span> Pay Outstanding Fee (₹{studentFee.dueAmount})
            </button>
          ) : (
            <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>✓</span> No pending tuition balance for Academic Year 2026-27.
            </div>
          )}

          {studentFee?.payments && studentFee.payments.length > 0 && (
            <button
              onClick={() => setSelectedReceiptPayment(studentFee.payments[studentFee.payments.length - 1])}
              style={{
                background: '#ffffff',
                border: '1.5px solid #092b63',
                color: '#092b63',
                padding: '10px 18px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>📜</span> Download Official Fee Receipt
            </button>
          )}
        </div>
      </div>

      {/* 4. LOGOUT & SECURITY SECTION */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div>
          <h3 style={{ fontSize: '15px', color: '#092b63', margin: '0 0 4px 0' }}>Session & Security</h3>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            Log out from this device or switch between student accounts.
          </p>
        </div>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1.5px solid #fca5a5',
            padding: '10px 22px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🚪</span> Logout from Account
        </button>
      </div>

      {/* Pay Online Modal */}
      {isPayModalOpen && studentFee && (
        <div className="modal-backdrop" onClick={() => setIsPayModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#092b63' }}>Pay Tuition Fee Online</h3>
              <button onClick={() => setIsPayModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handlePaySubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Amount to Pay (INR ₹):
                </label>
                <input
                  type="number"
                  max={studentFee.dueAmount}
                  min={500}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Payment Method:
                </label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="NetBanking">Net Banking</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Remarks:
                </label>
                <input
                  type="text"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingPay}
                style={{
                  width: '100%',
                  background: '#092b63',
                  color: '#ffb703',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {isProcessingPay ? 'Processing Payment...' : `Confirm Pay ₹${payAmount}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceiptPayment && (
        <FeeReceiptModal
          payment={selectedReceiptPayment}
          studentName={studentFee?.studentName || student?.name || 'Student'}
          rollNo={studentFee?.rollNo || student?.rollNo || 'PA-2026-01'}
          studentClass={studentFee?.studentClass || selectedClass}
          totalFee={studentFee?.totalFee || 45000}
          totalPaidAfterThis={studentFee?.paidAmount || 45000}
          dueRemainingAfterThis={studentFee?.dueAmount || 0}
          onClose={() => setSelectedReceiptPayment(null)}
        />
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🚪</div>
            <h3 style={{ fontSize: '18px', color: '#092b63', margin: '0 0 6px 0' }}>Log out from Parth Academy?</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
              You will be returned to the student login screen. You can sign in anytime with your roll number.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#dc2626',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
