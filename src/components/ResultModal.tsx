import React from 'react';
import { TestResultRecord } from '../types';

interface ResultModalProps {
  result: TestResultRecord;
  onClose: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({ result, onClose }) => {
  const percentage = Math.round((result.score / result.total) * 100);
  const isPassed = percentage >= 40;
  const isDistinction = percentage >= 80;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge">{result.subject}</span>
              {result.studentClass && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    color: '#1261c9',
                    border: '1px solid #bfdbfe',
                  }}
                >
                  {result.studentClass}
                </span>
              )}
            </div>
            <h3 style={{ marginTop: '4px' }}>{result.title} Report</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close scorecard">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Candidate Profile Strip */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                CANDIDATE NAME
              </div>
              <b style={{ fontSize: '15px', color: '#092b63' }}>
                {result.studentName || 'Garvit Sharma'}
              </b>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                ROLL NUMBER
              </div>
              <code style={{ fontSize: '13px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#1e293b' }}>
                {result.rollNo || 'PA-2026-1084'}
              </code>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                GRADE / CLASS
              </div>
              <b style={{ fontSize: '14px', color: '#1261c9' }}>
                {result.studentClass || 'Class 12th'}
              </b>
            </div>
          </div>

          {/* Top Score Banner */}
          <div
            style={{
              textAlign: 'center',
              padding: '20px',
              borderRadius: '16px',
              background: isDistinction ? 'linear-gradient(135deg, #092b63, #1261c9)' : '#092b63',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '12px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Final Test Score
            </div>
            <div style={{ fontSize: '42px', fontWeight: 800, margin: '6px 0' }}>
              {result.score} <span style={{ fontSize: '20px', fontWeight: 400, opacity: 0.7 }}>/ {result.total}</span>
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                background: isPassed ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                border: isPassed ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {isDistinction ? '🌟 Distinction Grade' : isPassed ? '✓ Passed' : '⚠️ Need Improvement'}
            </div>
          </div>

          {/* Test Analytics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>EXAM DATE</span>
              <strong style={{ fontSize: '15px', color: '#1e293b' }}>{result.date}</strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>PERCENTILE</span>
              <strong style={{ fontSize: '15px', color: '#1261c9' }}>
                {percentage > 90 ? 'Top 5%' : percentage > 75 ? 'Top 15%' : 'Top 30%'}
              </strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>SPEED INDEX</span>
              <strong style={{ fontSize: '15px', color: '#16a34a' }}>1.2 min / question</strong>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: 600 }}>ACCURACY</span>
              <strong style={{ fontSize: '15px', color: '#1261c9' }}>{percentage}%</strong>
            </div>
          </div>

          {/* Mentor Feedback */}
          <div
            style={{
              background: '#fff9eb',
              border: '1px solid #fde68a',
              borderRadius: '14px',
              padding: '14px 16px',
            }}
          >
            <b style={{ fontSize: '13px', color: '#92400e', display: 'block', marginBottom: '4px' }}>
              👨‍🏫 Academy Mentor Feedback
            </b>
            <p style={{ fontSize: '13px', color: '#78350f', lineHeight: 1.5 }}>
              {percentage >= 80
                ? 'Excellent conceptual understanding and analytical precision. Keep revising formulas weekly to maintain peak speed!'
                : 'Good attempt. Review the formula sheets in the Notes section to boost speed on numerical calculations.'}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            style={{
              background: '#1261c9',
              border: 'none',
              color: '#ffffff',
              padding: '9px 20px',
              borderRadius: '9px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
