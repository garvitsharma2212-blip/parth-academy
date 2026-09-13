import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestItem, TestType, StudentTestAttempt } from '../../types';
import { TestRunnerModal } from '../TestRunnerModal';
import { MarksheetModal } from '../MarksheetModal';

export const StudentTests: React.FC = () => {
  const { tests, selectedClass, attempts, currentStudent } = useApp();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [testToRun, setTestToRun] = useState<TestItem | null>(null);
  const [marksheetAttempt, setMarksheetAttempt] = useState<StudentTestAttempt | null>(null);

  // Filter for class
  const classTests = tests.filter((t) => t.grade === selectedClass && t.isPublished);

  const filtered = classTests.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.testType === activeFilter;
  });

  const studentAttempts = attempts.filter(
    (a) => a.studentId === currentStudent?.id || a.studentClass === selectedClass
  );

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#1261c9',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            TEST PORTAL
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedClass} Examination System</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Online Tests & Weekly Series</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Take timed mock exams, chapter practice assessments, and Sunday test series with auto evaluation and detailed step-by-step explanations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { id: 'all', label: 'All Tests' },
          { id: 'weekly', label: 'Weekly Test Series' },
          { id: 'chapter', label: 'Chapter Tests' },
          { id: 'full_syllabus', label: 'Full Syllabus Mocks' },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: isActive ? '1.5px solid #1261c9' : '1px solid #cbd5e1',
                background: isActive ? '#eff6ff' : '#ffffff',
                color: isActive ? '#1261c9' : '#475569',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tests Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {filtered.map((test) => {
          const attempt = studentAttempts.find((a) => a.testId === test.id);
          return (
            <div
              key={test.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
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
                      fontWeight: 700,
                      background: test.testType === 'weekly' ? '#eff6ff' : '#f0fdf4',
                      color: test.testType === 'weekly' ? '#1261c9' : '#15803d',
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

                <h3 style={{ fontSize: '17px', color: '#092b63', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {test.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
                  {test.subject}
                </p>

                {/* Exam meta tags */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    background: '#f8fafc',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>QUESTIONS</span>
                    <b>{test.questionsCount} Questions</b>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>TIME LIMIT</span>
                    <b>⏱️ {test.durationMinutes} Minutes</b>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>MAXIMUM MARKS</span>
                    <b>{test.totalMarks} Marks</b>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>SCHEDULE</span>
                    <b>{test.scheduledDate || 'Active 24/7'}</b>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setTestToRun(test)}
                  style={{
                    flex: 1,
                    padding: '11px 16px',
                    borderRadius: '8px',
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
                  <span>{attempt ? '🔄 Re-Attempt Test' : '🚀 Start Test Now'}</span>
                </button>
                {attempt && (
                  <button
                    onClick={() => setMarksheetAttempt(attempt)}
                    style={{
                      padding: '11px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    title="View official marksheet"
                  >
                    📜 Marksheet
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
