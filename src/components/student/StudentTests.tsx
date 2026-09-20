import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestItem, StudentTestAttempt } from '../../types';
import { TestRunnerModal } from '../TestRunnerModal';
import { MarksheetModal } from '../MarksheetModal';

export const StudentTests: React.FC = () => {
  const { tests, selectedClass, attempts, currentStudent } = useApp();
  const [activeSection, setActiveSection] = useState<'weekly' | 'mock' | 'results' | 'analytics'>('weekly');
  const [testToRun, setTestToRun] = useState<TestItem | null>(null);
  const [marksheetAttempt, setMarksheetAttempt] = useState<StudentTestAttempt | null>(null);

  // Filter for class tests
  const classTests = tests.filter((t) => t.grade === selectedClass && t.isPublished);

  // Weekly tests
  const weeklyTests = classTests.filter((t) => t.testType === 'weekly');

  // Mock tests (full syllabus & chapter tests)
  const mockTests = classTests.filter((t) => t.testType === 'full_syllabus' || t.testType === 'chapter');

  // Attempts
  const classAttempts = attempts.filter((a) => a.studentClass === selectedClass && a.isPublished !== false);
  const myAttempts = classAttempts.filter((a) => a.studentId === currentStudent?.id || a.studentClass === selectedClass);

  // Analytics calculations
  const totalAttempted = myAttempts.length;
  const avgScore = totalAttempted > 0 ? Math.round(myAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalAttempted) : 0;
  const highestScore = totalAttempted > 0 ? Math.max(...myAttempts.map((a) => a.score)) : 0;
  const bestRank = totalAttempted > 0 ? Math.min(...myAttempts.map((a) => a.rank || 99)) : 1;
  const toppers = [...classAttempts].sort((a, b) => b.score - a.score).slice(0, 5);

  const renderTestCard = (test: TestItem) => {
    const attempt = myAttempts.find((a) => a.testId === test.id);
    return (
      <div
        key={test.id}
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                background: test.testType === 'weekly' ? '#fef3c7' : '#e0f2fe',
                color: test.testType === 'weekly' ? '#92400e' : '#0369a1',
                padding: '2px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
              }}
            >
              {test.testType.replace('_', ' ')}
            </span>
            {attempt && (
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '6px' }}>
                ✓ Completed ({attempt.score}/{attempt.totalMarks})
              </span>
            )}
          </div>

          <h3 style={{ fontSize: '16px', color: '#092b63', margin: '0 0 6px 0', lineHeight: 1.3 }}>
            {test.title}
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
            {test.subject}
          </p>

          {/* Exam metadata pills */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              background: '#f8fafc',
              padding: '12px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '12px',
            }}
          >
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>QUESTIONS</span>
              <b>{test.questionsCount} Questions</b>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>DURATION</span>
              <b>⏱️ {test.durationMinutes} Minutes</b>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>TOTAL MARKS</span>
              <b>{test.totalMarks} Marks</b>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>STATUS</span>
              <b style={{ color: '#15803d' }}>Live & Evaluated</b>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setTestToRun(test)}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: '10px',
              background: attempt ? '#092b63' : '#1261c9',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>{attempt ? '🔄 Re-Attempt' : '🚀 Start Test'}</span>
          </button>
          {attempt && (
            <button
              onClick={() => setMarksheetAttempt(attempt)}
              style={{
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="View marksheet"
            >
              📜 Marksheet
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px 0 40px 0' }}>
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
            EXAMINATION SYSTEM
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedClass} Tests & Analytics</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Tests, Results & Performance</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Sunday weekly series, full-syllabus mocks, instant answer keys, and class ranking percentile.
        </p>
      </div>

      {/* 4 Requested Navigation Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '8px',
          marginBottom: '24px',
          background: '#f1f5f9',
          padding: '6px',
          borderRadius: '14px',
        }}
      >
        {[
          { id: 'weekly' as const, label: 'Weekly Tests', icon: '⏱️', count: weeklyTests.length },
          { id: 'mock' as const, label: 'Mock Tests', icon: '📝', count: mockTests.length },
          { id: 'results' as const, label: 'Results', icon: '🏆', count: myAttempts.length },
          { id: 'analytics' as const, label: 'Performance Analytics', icon: '📊', count: null },
        ].map((tab) => {
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                background: isActive ? '#092b63' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                border: 'none',
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    fontSize: '10px',
                    background: isActive ? '#ffb703' : '#e2e8f0',
                    color: isActive ? '#092b63' : '#475569',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 800,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SECTION 1: WEEKLY TESTS */}
      {activeSection === 'weekly' && (
        <div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', color: '#092b63', margin: 0, fontWeight: 800 }}>
              Sunday Weekly Test Series ({weeklyTests.length})
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Scheduled weekly for {selectedClass}</span>
          </div>

          {weeklyTests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, color: '#64748b' }}>No weekly tests scheduled at the moment.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {weeklyTests.map(renderTestCard)}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MOCK TESTS */}
      {activeSection === 'mock' && (
        <div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', color: '#092b63', margin: 0, fontWeight: 800 }}>
              Full Syllabus & Chapter Mocks ({mockTests.length})
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Practice anytime with instant evaluation</span>
          </div>

          {mockTests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, color: '#64748b' }}>No mock tests available currently.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {mockTests.map(renderTestCard)}
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: RESULTS */}
      {activeSection === 'results' && (
        <div>
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', color: '#092b63', margin: 0, fontWeight: 800 }}>
              My Examination Scorecards & History
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Click row or button to view official marksheet</span>
          </div>

          {myAttempts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>📝</div>
              <h3 style={{ fontSize: '16px', color: '#092b63', margin: '0 0 6px 0' }}>No Test Attempts Yet</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
                Complete a Weekly Test or Mock Test to view your official scorecard.
              </p>
              <button
                onClick={() => setActiveSection('weekly')}
                style={{
                  background: '#092b63',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Go to Weekly Tests →
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {myAttempts.map((att) => (
                <div
                  key={att.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, background: '#eff6ff', color: '#1261c9', padding: '1px 6px', borderRadius: '4px' }}>
                        {att.subject}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Attempted: {att.date}</span>
                    </div>
                    <h3 style={{ fontSize: '15px', color: '#092b63', margin: '0 0 4px 0' }}>{att.testTitle}</h3>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '12px' }}>
                      <span>Score: <b style={{ color: '#15803d' }}>{att.score} / {att.totalMarks}</b></span>
                      <span>Accuracy: <b style={{ color: '#092b63' }}>{att.percentage}%</b></span>
                      <span>Class Rank: <b style={{ color: '#b45309' }}>#{att.rank || 1}</b></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setMarksheetAttempt(att)}
                    style={{
                      background: '#092b63',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>📜</span> View Marksheet
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: PERFORMANCE ANALYTICS */}
      {activeSection === 'analytics' && (
        <div>
          {/* KPI Analytics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>TESTS COMPLETED</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#092b63', margin: '4px 0' }}>{totalAttempted}</div>
              <small style={{ fontSize: '11px', color: '#16a34a' }}>All verified attempts</small>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>AVERAGE ACCURACY</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1261c9', margin: '4px 0' }}>{avgScore}%</div>
              <small style={{ fontSize: '11px', color: '#1261c9' }}>Overall performance</small>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>HIGHEST SCORE</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>{highestScore} / 100</div>
              <small style={{ fontSize: '11px', color: '#15803d' }}>Personal best</small>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>BEST ACADEMY RANK</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>#{bestRank}</div>
              <small style={{ fontSize: '11px', color: '#b45309' }}>In {selectedClass}</small>
            </div>
          </div>

          {/* Leaderboard / Toppers Grid */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', color: '#092b63', margin: 0 }}>
                🏆 {selectedClass} Academic Toppers Leaderboard
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Sunday Test Series</span>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              {toppers.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Topper analytics will display after weekly exams.</p>
              ) : (
                toppers.map((top, idx) => (
                  <div
                    key={top.id || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: idx === 0 ? '#fffbeb' : '#f8fafc',
                      border: idx === 0 ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#ffb703' : idx === 1 ? '#cbd5e1' : idx === 2 ? '#f97316' : '#e2e8f0',
                          color: idx === 0 ? '#092b63' : '#0f172a',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div>
                        <b style={{ fontSize: '13px', color: '#092b63', display: 'block' }}>{top.studentName}</b>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{top.testTitle}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#15803d' }}>
                        {top.score}/{top.totalMarks}
                      </span>
                      <small style={{ display: 'block', fontSize: '10px', color: '#64748b' }}>
                        {top.percentage}% Accuracy
                      </small>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Test Runner Modal */}
      {testToRun && (
        <TestRunnerModal
          test={testToRun}
          onClose={() => setTestToRun(null)}
          onCompleted={(att) => {
            setTestToRun(null);
            setMarksheetAttempt(att);
          }}
        />
      )}

      {/* Marksheet Modal */}
      {marksheetAttempt && (
        <MarksheetModal
          attempt={marksheetAttempt}
          onClose={() => setMarksheetAttempt(null)}
        />
      )}
    </div>
  );
};
