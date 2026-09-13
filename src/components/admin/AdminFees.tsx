import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentFeeRecord, FeePayment, StudentClass } from '../../types';
import { FeeReceiptModal } from '../FeeReceiptModal';

export const AdminFees: React.FC = () => {
  const { fees, students, addFeePayment, createFeeRecord, updateFeeRecord, sendNotification } = useApp();
  const [filterClass, setFilterClass] = useState<StudentClass | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedFeeRecord, setSelectedFeeRecord] = useState<StudentFeeRecord | null>(null);
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<FeePayment | null>(null);

  // Record Offline Payment Modal State
  const [isRecordPayOpen, setIsRecordPayOpen] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [payAmount, setPayAmount] = useState<number>(5000);
  const [payMethod, setPayMethod] = useState<'Cash' | 'Cheque' | 'Bank Transfer' | 'UPI'>('Cash');
  const [payRemarks, setPayRemarks] = useState('Offline Tuition Installment');

  // New Fee Record Creation Modal State
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [newTotalFee, setNewTotalFee] = useState(45000);
  const [newDueDate, setNewDueDate] = useState('30 Nov 2026');

  // Reminders Toast
  const [reminderSentMsg, setReminderSentMsg] = useState<string | null>(null);

  const filtered = fees.filter((f) => {
    const matchClass = filterClass === 'All' || f.studentClass === filterClass;
    const matchStatus = filterStatus === 'All' || f.status === filterStatus;
    return matchClass && matchStatus;
  });

  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalOutstanding = fees.reduce((sum, f) => sum + f.dueAmount, 0);
  const totalStudentsWithDues = fees.filter((f) => f.dueAmount > 0).length;

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentId || payAmount <= 0) return;

    const payment = await addFeePayment(targetStudentId, {
      amount: Number(payAmount),
      method: payMethod,
      remarks: payRemarks,
    });

    const feeRec = fees.find((f) => f.studentId === targetStudentId);
    if (feeRec) {
      setSelectedFeeRecord(feeRec);
      setSelectedReceiptPayment(payment);
    }
    setIsRecordPayOpen(false);
  };

  const handleCreateNewFeeRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === newStudentId);
    if (!st) return;

    await createFeeRecord({
      studentId: st.id,
      studentName: st.name,
      rollNo: st.rollNo,
      studentClass: st.studentClass,
      totalFee: Number(newTotalFee),
      paidAmount: 0,
      dueAmount: Number(newTotalFee),
      dueDate: newDueDate,
      status: 'unpaid',
      payments: [],
    });

    setIsNewRecordOpen(false);
  };

  const handleSendReminder = async (fee: StudentFeeRecord) => {
    await sendNotification({
      title: `Fee Due Reminder: ₹${fee.dueAmount.toLocaleString()}`,
      message: `Dear ${fee.studentName}, your tuition installment is due on ${fee.dueDate}. Kindly clear the pending balance to avoid late fee penalties.`,
      type: 'fee',
    });
    setReminderSentMsg(`Payment reminder notification & SMS sent to ${fee.studentName}'s registered parent contact.`);
    setTimeout(() => setReminderSentMsg(null), 4000);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Fees & Financial Ledger</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Track academic tuition payments, manage pending fee installments, and generate verified receipts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => {
              if (students.length > 0) setTargetStudentId(students[0].id);
              setIsRecordPayOpen(true);
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: '#16a34a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)',
            }}
          >
            <span>💰</span> Record Fee Payment
          </button>
          <button
            onClick={() => {
              if (students.length > 0) setNewStudentId(students[0].id);
              setIsNewRecordOpen(true);
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: '#092b63',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Create Fee Record
          </button>
        </div>
      </div>

      {/* Reminder sent alert banner */}
      {reminderSentMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '12px 18px', borderRadius: '10px', color: '#166534', marginBottom: '18px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {reminderSentMsg}
        </div>
      )}

      {/* KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>TOTAL COLLECTED</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
            ₹{totalCollected.toLocaleString()}
          </div>
          <small style={{ fontSize: '11px', color: '#166534' }}>Across all batches</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '11px', color: '#b91c1c', fontWeight: 600 }}>OUTSTANDING DUES</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#dc2626', margin: '4px 0' }}>
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <small style={{ fontSize: '11px', color: '#b91c1c' }}>Pending student payments</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>DEFAULTER / PENDING STUDENTS</span>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#092b63', margin: '4px 0' }}>
            {totalStudentsWithDues} Students
          </div>
          <small style={{ fontSize: '11px', color: '#64748b' }}>Installments overdue</small>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['All', 'Class 12th', 'Class 10th'] as const).map((cls) => {
            const isSel = filterClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSel ? '1px solid #092b63' : '1px solid #cbd5e1',
                  background: isSel ? '#092b63' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {cls === 'All' ? 'All Batches' : cls}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'paid', 'partial', 'unpaid'].map((st) => {
            const isSel = filterStatus === st;
            return (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSel ? '1px solid #1261c9' : '1px solid #cbd5e1',
                  background: isSel ? '#eff6ff' : '#ffffff',
                  color: isSel ? '#1261c9' : '#475569',
                  fontSize: '12px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fees Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Student Details</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Class</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Total Package</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Paid</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Due Balance</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Due Date</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <b style={{ color: '#092b63' }}>{f.studentName}</b>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Roll No: {f.rollNo}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{f.studentClass}</td>
                  <td style={{ textAlign: 'right', padding: '12px', fontWeight: 600 }}>
                    ₹{f.totalFee.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px', fontWeight: 700, color: '#16a34a' }}>
                    ₹{f.paidAmount.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px', fontWeight: 700, color: f.dueAmount > 0 ? '#dc2626' : '#16a34a' }}>
                    ₹{f.dueAmount.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        background: f.status === 'paid' ? '#dcfce7' : f.status === 'partial' ? '#fef3c7' : '#fee2e2',
                        color: f.status === 'paid' ? '#15803d' : f.status === 'partial' ? '#b45309' : '#b91c1c',
                      }}
                    >
                      {f.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#64748b' }}>
                    {f.dueDate}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {f.dueAmount > 0 && (
                        <button
                          onClick={() => handleSendReminder(f)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#fff1f2',
                            border: '1px solid #fecdd3',
                            color: '#e11d48',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                          title="Send fee reminder"
                        >
                          📢 Remind
                        </button>
                      )}
                      {f.payments.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedFeeRecord(f);
                            setSelectedReceiptPayment(f.payments[0]);
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1261c9',
                            fontSize: '11px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Receipt
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setTargetStudentId(f.studentId);
                          setPayAmount(f.dueAmount > 0 ? f.dueAmount : 5000);
                          setIsRecordPayOpen(true);
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: '#16a34a',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        + Pay
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isRecordPayOpen && (
        <div className="modal-backdrop" onClick={() => setIsRecordPayOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '440px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>OFFICIAL LEDGER ENTRY</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Record Student Fee Payment</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsRecordPayOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleRecordPaymentSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Select Student *
                  </label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    required
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.rollNo} • {st.studentClass})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Payment Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 700, boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Payment Mode *
                  </label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                  >
                    <option value="Cash">Cash (Counter Deposit)</option>
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Bank Transfer">NEFT / RTGS Bank Transfer</option>
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Remarks / Installment Details
                  </label>
                  <input
                    type="text"
                    value={payRemarks}
                    onChange={(e) => setPayRemarks(e.target.value)}
                    placeholder="e.g. 2nd Installment Paid via Counter Cash"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)',
                  }}
                >
                  Record Payment & Issue Receipt
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* New Fee Record Modal */}
      {isNewRecordOpen && (
        <div className="modal-backdrop" onClick={() => setIsNewRecordOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '440px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#092b63' }}>ADMISSION LEDGER</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Assign Fee Package</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsNewRecordOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreateNewFeeRecord}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Student *
                  </label>
                  <select
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    required
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} ({st.rollNo} • {st.studentClass})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Total Tuition Package (₹) *
                  </label>
                  <input
                    type="number"
                    value={newTotalFee}
                    onChange={(e) => setNewTotalFee(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 700, boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Due Date *
                  </label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    placeholder="e.g. 30 Nov 2026"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
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
                  }}
                >
                  Create Student Ledger
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceiptPayment && selectedFeeRecord && (
        <FeeReceiptModal
          feeRecord={selectedFeeRecord}
          payment={selectedReceiptPayment}
          onClose={() => {
            setSelectedReceiptPayment(null);
            setSelectedFeeRecord(null);
          }}
        />
      )}
    </div>
  );
};
