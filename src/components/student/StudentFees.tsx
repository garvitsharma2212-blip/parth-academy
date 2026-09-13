import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentFeeRecord, FeePayment } from '../../types';
import { FeeReceiptModal } from '../FeeReceiptModal';

export const StudentFees: React.FC = () => {
  const { fees, currentStudent, selectedClass, addFeePayment } = useApp();
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<FeePayment | null>(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Pay online form
  const [payAmount, setPayAmount] = useState<number>(10000);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [payRemarks, setPayRemarks] = useState('Tuition Installment');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Fee record for logged in student or first demo student
  const studentFee: StudentFeeRecord =
    fees.find((f) => f.studentId === currentStudent?.id) ||
    fees.find((f) => f.studentClass === selectedClass) ||
    fees[0];

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

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#16a34a',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            ACCOUNTS & ACADEMIC FEES
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{studentFee?.studentClass} Tuition</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Fees Management & Receipts</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          View your course fee balance, track payment installment history, pay outstanding fees online, and download verified receipts.
        </p>
      </div>

      {/* Fee Status Summary Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: '16px',
          padding: '26px',
          marginBottom: '26px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CANDIDATE</span>
            <h2 style={{ fontSize: '20px', color: '#092b63', margin: '2px 0 0 0' }}>
              {studentFee?.studentName} ({studentFee?.rollNo})
            </h2>
            <span style={{ fontSize: '12px', color: '#1261c9', fontWeight: 600 }}>{studentFee?.studentClass} Academic Session 2026-27</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                padding: '6px 14px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 800,
                background: studentFee?.status === 'paid' ? '#dcfce7' : '#fee2e2',
                color: studentFee?.status === 'paid' ? '#15803d' : '#b91c1c',
                border: studentFee?.status === 'paid' ? '1px solid #86efac' : '1px solid #fca5a5',
              }}
            >
              {studentFee?.status === 'paid' ? '✓ FULLY CLEARED' : studentFee?.status === 'partial' ? 'PARTIALLY PAID' : 'UNPAID'}
            </span>

            {studentFee && studentFee.dueAmount > 0 && (
              <button
                onClick={() => {
                  setPayAmount(studentFee.dueAmount);
                  setIsPayModalOpen(true);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #092b63, #1261c9)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(18, 97, 201, 0.25)',
                }}
              >
                💳 Pay Outstanding Fee (₹{studentFee.dueAmount.toLocaleString()})
              </button>
            )}
          </div>
        </div>

        {/* 3 Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TOTAL ACADEMIC FEE</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#092b63', margin: '4px 0' }}>
              ₹{(studentFee?.totalFee || 0).toLocaleString()}
            </div>
            <small style={{ fontSize: '11px', color: '#64748b' }}>Includes study material & mock test series</small>
          </div>

          <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>TOTAL PAID AMOUNT</span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
              ₹{(studentFee?.paidAmount || 0).toLocaleString()}
            </div>
            <small style={{ fontSize: '11px', color: '#166534' }}>
              Settled via official receipts
            </small>
          </div>

          <div style={{ background: studentFee?.dueAmount ? '#fef2f2' : '#f8fafc', padding: '16px', borderRadius: '12px', border: studentFee?.dueAmount ? '1px solid #fecaca' : '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '11px', color: studentFee?.dueAmount ? '#991b1b' : '#64748b', fontWeight: 600 }}>
              OUTSTANDING BALANCE
            </span>
            <div style={{ fontSize: '22px', fontWeight: 800, color: studentFee?.dueAmount ? '#dc2626' : '#16a34a', margin: '4px 0' }}>
              ₹{(studentFee?.dueAmount || 0).toLocaleString()}
            </div>
            <small style={{ fontSize: '11px', color: studentFee?.dueAmount ? '#dc2626' : '#16a34a' }}>
              {studentFee?.dueAmount ? `Due before: ${studentFee.dueDate}` : 'No dues pending'}
            </small>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '16px', color: '#092b63', margin: 0 }}>Fee Payment History & Receipts</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Click "View Receipt" to download and print the verified payment vouchers.
            </p>
          </div>
          <button
            onClick={() => {
              setPayAmount(5000);
              setIsPayModalOpen(true);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1261c9',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            + Make Custom Payment
          </button>
        </div>

        {(!studentFee?.payments || studentFee.payments.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#64748b' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🧾</div>
            <p style={{ margin: 0, fontSize: '13px' }}>No payments logged yet for this account.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Receipt No</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Transaction ID</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px' }}>Mode</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Amount</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px' }}>Voucher</th>
                </tr>
              </thead>
              <tbody>
                {studentFee.payments.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px' }}>
                      <b style={{ color: '#092b63' }}>{p.receiptNo}</b>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{p.remarks || 'Tuition installment'}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{p.date}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>
                      <code>{p.transactionId}</code>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                        {p.method}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px', fontWeight: 800, color: '#16a34a', fontSize: '14px' }}>
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>
                      <button
                        onClick={() => setSelectedReceiptPayment(p)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '6px',
                          background: '#1261c9',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        🖨️ View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pay Online Modal */}
      {isPayModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPayModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '420px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9' }}>PARTH ACADEMY SECURE GATEWAY</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Pay Coaching Tuition Fee</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsPayModalOpen(false)} aria-label="Close pay modal">
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handlePaySubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Enter Amount (₹) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    max="100000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '16px', fontWeight: 700, boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Select Payment Method *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {(['UPI', 'Card', 'NetBanking'] as const).map((method) => {
                      const isSel = payMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPayMethod(method)}
                          style={{
                            padding: '10px 8px',
                            borderRadius: '8px',
                            border: isSel ? '2px solid #1261c9' : '1px solid #cbd5e1',
                            background: isSel ? '#eff6ff' : '#ffffff',
                            color: isSel ? '#1261c9' : '#475569',
                            fontWeight: isSel ? 700 : 500,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {method === 'UPI' ? '📱 UPI' : method === 'Card' ? '💳 Card' : '🏦 NetBanking'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Payment Note / Description
                  </label>
                  <input
                    type="text"
                    value={payRemarks}
                    onChange={(e) => setPayRemarks(e.target.value)}
                    placeholder="e.g. 2nd Installment or Board Mock Package"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>
                  🔒 256-bit encrypted simulation. Instant official GST receipt generated with Parth Academy stamp immediately after payment.
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPay}
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
                    boxShadow: '0 4px 10px rgba(22, 163, 74, 0.25)',
                  }}
                >
                  {isProcessingPay ? 'Processing Payment...' : `Confirm & Pay ₹${payAmount.toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      {selectedReceiptPayment && (
        <FeeReceiptModal
          feeRecord={studentFee}
          payment={selectedReceiptPayment}
          onClose={() => setSelectedReceiptPayment(null)}
        />
      )}
    </div>
  );
};
