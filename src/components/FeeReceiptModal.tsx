import React from 'react';
import { StudentFeeRecord, FeePayment } from '../types';

interface FeeReceiptModalProps {
  feeRecord: StudentFeeRecord;
  payment: FeePayment;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({ feeRecord, payment, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '480px', padding: 0 }}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '8px' }}>
              OFFICIAL PAYMENT RECEIPT
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '16px' }}>Fee Receipt #{payment.receiptNo}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close receipt">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          {/* Printable Receipt Container */}
          <div
            id="printable-receipt"
            style={{
              border: '1.5px solid #cbd5e1',
              borderRadius: '12px',
              padding: '20px',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', borderBottom: '1.5px dashed #cbd5e1', paddingBottom: '14px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#092b63',
                  color: '#ffb703',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '17px',
                  margin: '0 auto 6px auto',
                }}
              >
                PA
              </div>
              <h2 style={{ fontSize: '18px', color: '#092b63', margin: 0 }}>PARTH ACADEMY</h2>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                Senior Secondary Coaching Institute • Reg. No: PA-EDU/2026/041
              </p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                Sector 14, Main Campus • Phone: +91 98765 00000 • accounts@parthacademy.com
              </p>
            </div>

            {/* Receipt Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ color: '#64748b' }}>Receipt No:</span> <b>{payment.receiptNo}</b>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b' }}>Date:</span> <b>{payment.date}</b>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Transaction ID:</span> <code>{payment.transactionId}</code>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#64748b' }}>Payment Mode:</span> <b>{payment.method}</b>
              </div>
            </div>

            {/* Student Info */}
            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Student Name:</span>
                <b>{feeRecord.studentName}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Roll Number:</span>
                <code>{feeRecord.rollNo}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Class / Stream:</span>
                <b>{feeRecord.studentClass}</b>
              </div>
            </div>

            {/* Amount Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '14px' }}>
              <thead>
                <tr style={{ background: '#092b63', color: '#ffffff' }}>
                  <th style={{ padding: '7px 10px', textAlign: 'left', borderRadius: '6px 0 0 6px' }}>Description</th>
                  <th style={{ padding: '7px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 10px' }}>{payment.remarks || 'Coaching Tuition Installment'}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>₹{payment.amount.toLocaleString()}</td>
                </tr>
                <tr style={{ background: '#f8fafc', fontWeight: 700 }}>
                  <td style={{ padding: '8px 10px' }}>Total Amount Paid</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#16a34a', fontSize: '14px' }}>
                    ₹{payment.amount.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Fee Summary */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '11px', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                Total Course Fee: <b>₹{feeRecord.totalFee.toLocaleString()}</b>
              </div>
              <div>
                Remaining Balance: <b style={{ color: feeRecord.dueAmount > 0 ? '#dc2626' : '#16a34a' }}>₹{feeRecord.dueAmount.toLocaleString()}</b>
              </div>
            </div>

            {/* Signatures & Stamp */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', paddingTop: '12px' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    border: '1.5px solid #16a34a',
                    borderRadius: '50px',
                    color: '#16a34a',
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  ✓ VERIFIED & PAID
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px' }}>PARTH ACADEMY ACCOUNTS</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '14px', color: '#092b63', fontWeight: 700 }}>
                  Parth Sharma
                </div>
                <div style={{ width: '110px', height: '1px', background: '#cbd5e1', margin: '2px auto' }} />
                <span style={{ fontSize: '10px', color: '#64748b' }}>Authorized Signatory</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#fff',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#1261c9',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🖨️</span> Print / Save PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
