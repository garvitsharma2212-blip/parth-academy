import React from 'react';
import { StudentTestAttempt } from '../types';

interface MarksheetModalProps {
  attempt: StudentTestAttempt;
  onClose: () => void;
}

export const MarksheetModal: React.FC<MarksheetModalProps> = ({ attempt, onClose }) => {
  const isPassed = attempt.percentage >= 40;
  const isDistinction = attempt.percentage >= 80;

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
        style={{ maxWidth: '520px', padding: 0 }}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9', background: '#eff6ff', padding: '2px 8px', borderRadius: '8px' }}>
              OFFICIAL EXAMINATION MARKSHEET
            </span>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '16px' }}>{attempt.testTitle}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close marksheet">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px' }}>
          <div
            id="printable-marksheet"
            style={{
              border: '2px solid #092b63',
              borderRadius: '12px',
              padding: '22px',
              background: '#ffffff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            }}
          >
            {/* Institute Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #092b63', paddingBottom: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#092b63',
                  color: '#ffb703',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '18px',
                  margin: '0 auto 6px auto',
                }}
              >
                PA
              </div>
              <h2 style={{ fontSize: '20px', color: '#092b63', margin: 0, letterSpacing: '-0.3px' }}>
                PARTH ACADEMY
              </h2>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0', fontWeight: 600 }}>
                EXAMINATION ASSESSMENT & PERFORMANCE CELL
              </p>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '3px 12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#1261c9',
                }}
              >
                CANDIDATE SCORECARD & RANK CERTIFICATE
              </div>
            </div>

            {/* Candidate Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>CANDIDATE NAME</span>
                <b style={{ fontSize: '14px', color: '#092b63' }}>{attempt.studentName}</b>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>ROLL NUMBER</span>
                <code style={{ fontSize: '13px', color: '#1e293b' }}>{attempt.rollNo}</code>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>CLASS / STREAM</span>
                <b style={{ color: '#1261c9' }}>{attempt.studentClass}</b>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>EXAM DATE</span>
                <b>{attempt.date}</b>
              </div>
            </div>

            {/* Score & Rank Highlight */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
                textAlign: 'center',
                marginBottom: '16px',
              }}
            >
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>SCORE OBTAINED</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#15803d', margin: '3px 0' }}>
                  {attempt.score} <span style={{ fontSize: '12px', color: '#64748b' }}>/ {attempt.totalMarks}</span>
                </div>
                <small style={{ fontSize: '11px', color: '#15803d', fontWeight: 700 }}>{attempt.percentage}%</small>
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: '#1e40af', fontWeight: 600 }}>CLASS RANK</span>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1261c9', margin: '3px 0' }}>
                  #{attempt.rank || 1}
                </div>
                <small style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700 }}>
                  {attempt.rank === 1 ? '🥇 Class Topper' : attempt.rank === 2 ? '🥈 2nd Rank' : 'Top Tier'}
                </small>
              </div>

              <div style={{ background: '#fdf4ff', border: '1px solid #f5d0fe', padding: '10px', borderRadius: '10px' }}>
                <span style={{ fontSize: '10px', color: '#86198f', fontWeight: 600 }}>FINAL RESULT</span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: isPassed ? '#16a34a' : '#dc2626', margin: '6px 0 2px 0' }}>
                  {isDistinction ? 'Distinction' : isPassed ? 'PASSED' : 'RETEST'}
                </div>
                <small style={{ fontSize: '11px', color: '#64748b' }}>
                  Speed: {Math.round(attempt.timeTakenSeconds / 60)} mins
                </small>
              </div>
            </div>

            {/* Assessment Remarks */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', background: '#ffffff' }}>
              <b style={{ fontSize: '12px', color: '#092b63', display: 'block', marginBottom: '4px' }}>
                Mentor Feedback & Subject Assessment:
              </b>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {attempt.percentage >= 80
                  ? 'Outstanding analytical competence, prompt numerical calculations, and strong conceptual clarity. Recommended for Advanced Olympiad & Mock Board batches.'
                  : attempt.percentage >= 60
                  ? 'Good performance with steady problem solving. Focus on time management and revise chapter formula sheets.'
                  : 'Requires revision in theoretical fundamentals and derivation practice. Schedule a doubt clearing session.'}
              </p>
            </div>

            {/* Footer with Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: '2px dashed #092b63',
                    color: '#092b63',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: 800,
                    margin: '0 auto',
                  }}
                >
                  <span>PARTH</span>
                  <span>ACADEMY</span>
                  <span style={{ fontSize: '8px', color: '#16a34a' }}>SEAL</span>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '15px', color: '#092b63', fontWeight: 700 }}>
                  Er. Parth Sharma
                </div>
                <div style={{ width: '130px', height: '1px', background: '#092b63', margin: '2px auto' }} />
                <span style={{ fontSize: '10px', color: '#64748b' }}>Controller of Examinations</span>
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
            <span>🖨️</span> Print / Save Marksheet
          </button>
        </div>
      </div>
    </div>
  );
};
