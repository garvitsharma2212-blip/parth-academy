import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentTestAttempt } from '../../types';
import { MarksheetModal } from '../MarksheetModal';

export const StudentResults: React.FC = () => {
  const { attempts, selectedClass, currentStudent } = useApp();
  const [selectedAttempt, setSelectedAttempt] = useState<StudentTestAttempt | null>(null);

  // Filter attempts for this class that are published by admin
  const classAttempts = attempts.filter((a) => a.studentClass === selectedClass && a.isPublished !== false);
  const myAttempts = classAttempts.filter((a) => a.studentId === currentStudent?.id);

  // Compute analytics
  const totalAttempted = myAttempts.length;
  const avgScore = totalAttempted > 0 ? Math.round(myAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempted) : 0;
  const highestScore = totalAttempted > 0 ? Math.max(...myAttempts.map((a) => a.score)) : 0;
  const bestRank = totalAttempted > 0 ? Math.min(...myAttempts.map((a) => a.rank || 99)) : 1;

  // Class topper list for this class
  const toppers = [...classAttempts].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#ffb703',
              color: '#092b63',
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            PERFORMANCE & RANKS
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedClass} Academy Analytics</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Examination Results & Scorecards</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Track your weekly mock test performance, class ranking percentile, subject strength breakdown, and official marksheets.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TESTS COMPLETED</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#092b63', margin: '4px 0' }}>{totalAttempted}</div>
          <small style={{ fontSize: '11px', color: '#16a34a' }}>All tests evaluated</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>AVERAGE ACCURACY</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#1261c9', margin: '4px 0' }}>{avgScore}%</div>
          <small style={{ fontSize: '11px', color: '#1261c9' }}>Overall performance</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>HIGHEST SCORE</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>{highestScore} / 100</div>
          <small style={{ fontSize: '11px', color: '#15803d' }}>Personal best</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>BEST ACADEMY RANK</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>#{bestRank}</div>
          <small style={{ fontSize: '11px', color: '#b45309' }}>In {selectedClass}</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Attempts Table */}
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
            <h3 style={{ fontSize: '16px', color: '#092b63', margin: 0 }}>My Test Score History</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Click row to view official marksheet</span>
          </div>

          {myAttempts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748b' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
              <p style={{ margin: 0, fontSize: '14px' }}>No test attempts recorded yet. Attempt a test in the Online Tests section!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px' }}>Test Title</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px' }}>Date</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px' }}>Score</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px' }}>Accuracy</th>
                    <th style={{ textAlign: 'center', padding: '10px 12px' }}>Rank</th>
                    <th style={{ textAlign: 'right', padding: '10px 12px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myAttempts.map((att) => (
                    <tr
                      key={att.id}
                      style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.1s ease' }}
                      onClick={() => setSelectedAttempt(att)}
                    >
                      <td style={{ padding: '12px' }}>
                        <b style={{ color: '#092b63', display: 'block' }}>{att.testTitle}</b>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{att.subject}</span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px', color: '#64748b' }}>{att.date}</td>
                      <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                        {att.score}/{att.totalMarks}
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px' }}>
                        <span
                          style={{
                            background: att.percentage >= 75 ? '#dcfce7' : '#fee2e2',
                            color: att.percentage >= 75 ? '#15803d' : '#b91c1c',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                          }}
                        >
                          {att.percentage}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: '#1261c9' }}>
                        #{att.rank || 1}
                      </td>
                      <td style={{ textAlign: 'right', padding: '12px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAttempt(att);
                          }}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1261c9',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Marksheet
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Toppers Leaderboard */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontSize: '18px' }}>🏆</span>
            <h3 style={{ fontSize: '16px', color: '#092b63', margin: 0 }}>Class Rank Leaderboard</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px 0' }}>
            Top scoring candidates in {selectedClass} across recent mock tests.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {toppers.map((t, idx) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: idx === 0 ? '#fffbeb' : '#f8fafc',
                  border: idx === 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '12px',
                  }}
                >
                  {idx + 1}
                </div>

                <div style={{ flex: 1 }}>
                  <b style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>{t.studentName}</b>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Roll: {t.rollNo}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <b style={{ fontSize: '14px', color: '#15803d' }}>{t.score} / {t.totalMarks}</b>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{t.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedAttempt && (
        <MarksheetModal
          attempt={selectedAttempt}
          onClose={() => setSelectedAttempt(null)}
        />
      )}
    </div>
  );
};
