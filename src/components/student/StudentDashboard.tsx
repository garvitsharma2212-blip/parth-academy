import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentNavTab, TestItem, StudyMaterialItem } from '../../types';
import { TestRunnerModal } from '../TestRunnerModal';
import { MaterialViewerModal } from '../MaterialViewerModal';

interface StudentDashboardProps {
  onNavigate: (tab: StudentNavTab) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const {
    currentStudent,
    selectedClass,
    announcements,
    tests,
    materials,
    fees,
    attempts,
    setIsAuthModalOpen,
  } = useApp();

  const [activeTestToRun, setActiveTestToRun] = useState<TestItem | null>(null);
  const [activeMaterialToView, setActiveMaterialToView] = useState<StudyMaterialItem | null>(null);

  // Filter for student's class
  const classTests = tests.filter((t) => t.grade === selectedClass && t.isPublished);
  const nextWeeklyTest = classTests.find((t) => t.testType === 'weekly') || classTests[0];
  const classMaterials = materials.filter((m) => m.grade === selectedClass).slice(0, 4);
  const studentFee = fees.find((f) => f.studentId === currentStudent?.id) || fees[0];
  const studentAttempts = attempts.filter((a) => a.studentId === currentStudent?.id);
  const latestAttempt = studentAttempts[0];

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #092b63 0%, #1261c9 100%)',
          borderRadius: '16px',
          padding: '28px 32px',
          color: '#ffffff',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(9, 43, 99, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(255, 183, 3, 0.2)',
                color: '#ffb703',
                border: '1px solid rgba(255, 183, 3, 0.4)',
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              ACADEMIC YEAR 2026-27 • {selectedClass.toUpperCase()}
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.4px' }}>
            Welcome back, {currentStudent ? currentStudent.name : 'Candidate'}!
          </h1>
          <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0, maxWidth: '560px', lineHeight: 1.5 }}>
            Prepare for upcoming CBSE Boards and Competitive Entrance Exams with high-yield chapter formulas,
            solved sample papers, and Sunday Weekly Mock series.
          </p>
          {currentStudent && (
            <div style={{ marginTop: '14px', display: 'flex', gap: '16px', fontSize: '12px', color: '#93c5fd' }}>
              <span>Roll No: <b>{currentStudent.rollNo}</b></span>
              <span>•</span>
              <span>Batch: <b>{currentStudent.studentClass} Regular Super-40</b></span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!currentStudent ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                padding: '12px 22px',
                borderRadius: '10px',
                background: '#ffb703',
                color: '#092b63',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 183, 3, 0.3)',
              }}
            >
              Sign In to Your Account
            </button>
          ) : (
            <button
              onClick={() => onNavigate('tests')}
              style={{
                padding: '12px 22px',
                borderRadius: '10px',
                background: '#ffb703',
                color: '#092b63',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 183, 3, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>⏱️</span> Attempt Tests
            </button>
          )}
        </div>
      </div>

      {/* Announcements Notice Ticker */}
      {announcements.length > 0 && (
        <div
          style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '12px',
            padding: '12px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <span
              style={{
                background: '#f59e0b',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              LATEST NOTICE
            </span>
            <b style={{ fontSize: '13px', color: '#92400e', whiteSpace: 'nowrap' }}>
              {announcements[0].title}:
            </b>
            <span
              style={{
                fontSize: '13px',
                color: '#78350f',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {announcements[0].content}
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#b45309', whiteSpace: 'nowrap' }}>
            {announcements[0].date}
          </span>
        </div>
      )}

      {/* Grid of Key Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Next Weekly Test Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  background: '#eff6ff',
                  color: '#1261c9',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                UPCOMING EXAMINATION
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {nextWeeklyTest ? nextWeeklyTest.scheduledDate || 'Sunday Mock' : 'Live'}
              </span>
            </div>

            {nextWeeklyTest ? (
              <>
                <h3 style={{ fontSize: '17px', color: '#092b63', margin: '0 0 6px 0' }}>
                  {nextWeeklyTest.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 14px 0' }}>
                  {nextWeeklyTest.subject} • {nextWeeklyTest.questionsCount} Questions • {nextWeeklyTest.durationMinutes} Minutes
                </p>

                <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#334155', marginBottom: '16px' }}>
                  <span>🎯 Format: <b>Auto-evaluated MCQ + Marking (+20 / 0)</b></span>
                  <div style={{ marginTop: '3px', color: '#64748b' }}>
                    Syllabus: Chapters 1 to 4 comprehensively.
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: '#64748b', fontSize: '14px' }}>No active tests right now.</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {nextWeeklyTest && (
              <button
                onClick={() => setActiveTestToRun(nextWeeklyTest)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  background: '#1261c9',
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
                <span>🚀</span> Start Test Now
              </button>
            )}
            <button
              onClick={() => onNavigate('tests')}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All Tests
            </button>
          </div>
        </div>

        {/* Fee Status Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  background: studentFee?.status === 'paid' ? '#dcfce7' : '#fee2e2',
                  color: studentFee?.status === 'paid' ? '#15803d' : '#b91c1c',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                {studentFee?.status === 'paid' ? 'FEES ALL CLEAR ✓' : 'FEE INSTALLMENT DUE'}
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Due Date: {studentFee?.dueDate || '30 Oct 2026'}
              </span>
            </div>

            <h3 style={{ fontSize: '17px', color: '#092b63', margin: '0 0 10px 0' }}>
              Coaching Tuition Fee Status
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>TOTAL PAID</span>
                <b style={{ fontSize: '16px', color: '#16a34a' }}>
                  ₹{(studentFee?.paidAmount || 0).toLocaleString()}
                </b>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>REMAINING DUE</span>
                <b style={{ fontSize: '16px', color: studentFee?.dueAmount ? '#dc2626' : '#16a34a' }}>
                  ₹{(studentFee?.dueAmount || 0).toLocaleString()}
                </b>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onNavigate('fees')}
              style={{
                flex: 1,
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
              {studentFee?.dueAmount ? 'Pay Online & Download Receipt' : 'View Payment History'}
            </button>
          </div>
        </div>

        {/* Latest Test Result Summary */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '22px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  background: '#f3e8ff',
                  color: '#7e22ce',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                PERFORMANCE SCORECARD
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {latestAttempt?.date || 'Recent'}
              </span>
            </div>

            <h3 style={{ fontSize: '17px', color: '#092b63', margin: '0 0 6px 0' }}>
              {latestAttempt?.testTitle || 'Weekly Mock Performance'}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>
              {latestAttempt ? `${latestAttempt.subject} • Scored ${latestAttempt.score}/${latestAttempt.totalMarks}` : 'Complete your first test to generate rank cards.'}
            </p>

            {latestAttempt && (
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ background: '#f0fdf4', padding: '8px 12px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#166534', fontWeight: 600 }}>ACCURACY</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803d' }}>{latestAttempt.percentage}%</div>
                </div>
                <div style={{ background: '#eff6ff', padding: '8px 12px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#1e40af', fontWeight: 600 }}>CLASS RANK</span>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#1261c9' }}>#{latestAttempt.rank || 1}</div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('results')}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Detailed Analytics & Marksheets →
          </button>
        </div>
      </div>

      {/* Latest Study Materials Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', color: '#092b63', margin: '0 0 2px 0' }}>
              Recent {selectedClass} Study Materials
            </h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Download PDF notes, formula sheets, question banks, and sample papers.
            </p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            style={{
              fontSize: '13px',
              color: '#1261c9',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            View All Materials ({materials.filter((m) => m.grade === selectedClass).length}) →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {classMaterials.map((mat) => (
            <div
              key={mat.id}
              onClick={() => setActiveMaterialToView(mat)}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: '#eff6ff',
                      color: '#1261c9',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {mat.category}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{mat.fileSize}</span>
                </div>
                <h4 style={{ fontSize: '14px', color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                  {mat.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                  {mat.description.slice(0, 75)}...
                </p>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#1261c9', fontWeight: 600 }}>{mat.subject}</span>
                <span style={{ fontSize: '12px', color: '#1261c9', fontWeight: 700 }}>Read & Download 📥</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Modals if launched from Dashboard */}
      {activeTestToRun && (
        <TestRunnerModal
          test={activeTestToRun}
          onClose={() => setActiveTestToRun(null)}
          onCompleted={() => {
            setActiveTestToRun(null);
            onNavigate('results');
          }}
        />
      )}

      {activeMaterialToView && (
        <MaterialViewerModal
          material={activeMaterialToView}
          onClose={() => setActiveMaterialToView(null)}
        />
      )}
    </div>
  );
};
