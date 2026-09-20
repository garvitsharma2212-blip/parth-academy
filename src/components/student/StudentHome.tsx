import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentNavTab, Announcement } from '../../types';

interface StudentHomeProps {
  onNavigate: (tab: StudentNavTab) => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({ onNavigate }) => {
  const {
    currentStudent,
    selectedClass,
    setSelectedClass,
    announcements,
    setIsAuthModalOpen,
    tests,
    materials,
  } = useApp();

  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(null);
  const [joinedClassNotice, setJoinedClassNotice] = useState<string | null>(null);

  // Filter announcements for current class or 'All'
  const relevantNotices = announcements.filter(
    (a) => a.targetClass === 'All' || a.targetClass === selectedClass
  );

  // Filter upcoming tests
  const upcomingWeekly = tests.find((t) => t.grade === selectedClass && t.testType === 'weekly');

  // Upcoming classes schedule data
  const upcomingClasses = selectedClass === 'Class 12th'
    ? [
        {
          id: 'cls-1',
          subject: 'Physics',
          topic: 'Electromagnetic Induction & Faraday Laws',
          faculty: 'Er. Garvit Sharma',
          time: 'Today • 04:30 PM - 06:00 PM',
          room: 'Hall A • Antah Campus',
          status: 'live_soon',
          badge: 'High Priority',
          color: '#092b63',
        },
        {
          id: 'cls-2',
          subject: 'Chemistry',
          topic: 'Aldehydes, Ketones & Carboxylic Mechanism',
          faculty: 'Dr. V.K. Agrawal',
          time: 'Today • 06:15 PM - 07:45 PM',
          room: 'Hall B • Smart Lab',
          status: 'upcoming',
          badge: 'Boards Focus',
          color: '#0284c7',
        },
        {
          id: 'cls-3',
          subject: 'Mathematics',
          topic: 'Three-Dimensional Geometry & Vectors',
          faculty: 'Prof. R.P. Gautam',
          time: 'Tomorrow • 05:00 PM - 06:30 PM',
          room: 'Hall A • Live Stream',
          status: 'upcoming',
          badge: 'JEE Mains',
          color: '#4f46e5',
        },
      ]
    : [
        {
          id: 'cls-4',
          subject: 'Science (Physics)',
          topic: 'Light: Reflection and Refraction Numericals',
          faculty: 'Er. Garvit Sharma',
          time: 'Today • 04:30 PM - 05:45 PM',
          room: 'Hall C • Antah Center',
          status: 'live_soon',
          badge: 'CBSE Board 2026',
          color: '#092b63',
        },
        {
          id: 'cls-5',
          subject: 'Mathematics',
          topic: 'Quadratic Equations & Arithmetic Progressions',
          faculty: 'Prof. Ankit Mehta',
          time: 'Today • 06:00 PM - 07:15 PM',
          room: 'Hall C • Main Wing',
          status: 'upcoming',
          badge: 'Super-40 Batch',
          color: '#0284c7',
        },
        {
          id: 'cls-6',
          subject: 'Science (Chemistry)',
          topic: 'Acids, Bases & Salts: Balanced Reactions',
          faculty: 'Dr. S.K. Verma',
          time: 'Tomorrow • 04:30 PM - 05:45 PM',
          room: 'Hall B • Antah',
          status: 'upcoming',
          badge: 'Chapter Test Rev',
          color: '#16a34a',
        },
      ];

  const handleJoinClass = (className: string) => {
    setJoinedClassNotice(`Connected to ${className}. Audio & digital blackboard live synced!`);
    setTimeout(() => {
      setJoinedClassNotice(null);
    }, 4500);
  };

  return (
    <div style={{ padding: '16px 0 32px 0' }}>
      {/* Toast Notification for Join Class */}
      {joinedClassNotice && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#092b63',
            color: '#ffb703',
            border: '1.5px solid #ffb703',
            padding: '10px 20px',
            borderRadius: '50px',
            fontSize: '13px',
            fontWeight: 700,
            zIndex: 100,
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🔴</span>
          <span>{joinedClassNotice}</span>
        </div>
      )}

      {/* 1. WELCOME CARD */}
      <div
        style={{
          background: 'linear-gradient(135deg, #092b63 0%, #1261c9 60%, #1d4ed8 100%)',
          borderRadius: '20px',
          padding: '24px 22px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(9, 43, 99, 0.22)',
          marginBottom: '20px',
        }}
      >
        {/* Background decorative gold orb */}
        <div
          style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 183, 3, 0.35) 0%, rgba(255, 183, 3, 0) 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  background: 'rgba(255, 183, 3, 0.2)',
                  color: '#ffb703',
                  border: '1px solid rgba(255, 183, 3, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                }}
              >
                ★ {selectedClass.toUpperCase()} SUPER-40 BATCH
              </span>
              <span style={{ fontSize: '11px', color: '#93c5fd' }}>• Academic Year 2026-27</span>
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
              Welcome, {currentStudent ? currentStudent.name : 'Student'}! 👋
            </h1>

            <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', maxWidth: '520px', lineHeight: 1.5 }}>
              "Excellence is never an accident; it is always the result of high intention, sincere effort, and intelligent execution."
            </p>
          </div>

          {/* Quick Profile / Login Pill */}
          <div>
            {currentStudent ? (
              <div
                onClick={() => onNavigate('profile')}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{ fontSize: '20px' }}>{currentStudent.avatar || '👨‍🎓'}</div>
                <div style={{ textAlign: 'left' }}>
                  <b style={{ fontSize: '12px', color: '#ffffff', display: 'block' }}>{currentStudent.rollNo}</b>
                  <span style={{ fontSize: '10px', color: '#ffb703' }}>View Profile →</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                style={{
                  background: '#ffb703',
                  color: '#092b63',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(255,183,3,0.3)',
                }}
              >
                Student Sign In
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Row inside Welcome Card */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '10px',
          }}
        >
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>CAMPUS LOCATION</span>
            <b style={{ fontSize: '12px', color: '#ffffff' }}>Near Priya School, Antah</b>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>HELPLINE</span>
            <b style={{ fontSize: '12px', color: '#ffb703' }}>+91 97846 64518</b>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '8px 12px', borderRadius: '10px' }}>
            <span style={{ fontSize: '10px', color: '#93c5fd', display: 'block' }}>STUDENT ATTENDANCE</span>
            <b style={{ fontSize: '12px', color: '#4ade80' }}>94% Present (Verified)</b>
          </div>
        </div>
      </div>

      {/* 2. QUICK ACTION BUTTONS */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#092b63', margin: 0 }}>
            ⚡ Quick Shortcuts
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>One-tap navigation</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}
        >
          {[
            {
              label: 'Study Material',
              sub: 'PDF Notes & Papers',
              icon: '📚',
              color: '#092b63',
              bg: '#eff6ff',
              action: () => onNavigate('materials'),
            },
            {
              label: 'Video Lectures',
              sub: 'Recorded Classes',
              icon: '🎥',
              color: '#dc2626',
              bg: '#fef2f2',
              action: () => onNavigate('videos'),
            },
            {
              label: 'Online Tests',
              sub: 'Weekly Mocks',
              icon: '⏱️',
              color: '#d97706',
              bg: '#fffbeb',
              action: () => onNavigate('tests'),
            },
            {
              label: 'My Profile & Fees',
              sub: 'Attendance & Dues',
              icon: '👤',
              color: '#16a34a',
              bg: '#f0fdf4',
              action: () => onNavigate('profile'),
            },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.action}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: btn.bg,
                  color: btn.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                {btn.icon}
              </div>
              <div>
                <b style={{ fontSize: '13px', color: '#092b63', display: 'block' }}>{btn.label}</b>
                <span style={{ fontSize: '11px', color: '#64748b' }}>{btn.sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. UPCOMING CLASSES */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📅</span>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#092b63', margin: 0 }}>
              Upcoming Classes & Lectures
            </h2>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px' }}>
            Live Schedule
          </span>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {upcomingClasses.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: '#eff6ff',
                    border: '1.5px solid #bfdbfe',
                    color: item.color,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 800 }}>LIVE</span>
                  <span style={{ fontSize: '14px' }}>📚</span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: item.color, background: '#e0f2fe', padding: '1px 6px', borderRadius: '4px' }}>
                      {item.subject}
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 style={{ margin: '3px 0 2px 0', fontSize: '14px', fontWeight: 700, color: '#092b63' }}>
                    {item.topic}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span>👨‍🏫 {item.faculty}</span>
                    <span>•</span>
                    <span>🕒 {item.time}</span>
                    <span>•</span>
                    <span>📍 {item.room}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleJoinClass(item.subject)}
                  style={{
                    background: '#092b63',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>🔴</span> Join Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. LATEST NOTICES & ANNOUNCEMENTS */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>📢</span>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#092b63', margin: 0 }}>
              Latest Notices & Circulars
            </h2>
          </div>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {relevantNotices.length} Published Notices
          </span>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {relevantNotices.slice(0, 4).map((notice) => {
            const isHigh = notice.priority === 'high';
            return (
              <div
                key={notice.id}
                onClick={() => setSelectedNotice(notice)}
                style={{
                  background: isHigh ? '#fffbeb' : '#ffffff',
                  border: isHigh ? '1.5px solid #fde68a' : '1px solid #e2e8f0',
                  borderLeft: isHigh ? '5px solid #ffb703' : '4px solid #1261c9',
                  borderRadius: '14px',
                  padding: '16px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: isHigh ? '#ffb703' : '#eff6ff',
                        color: isHigh ? '#092b63' : '#1261c9',
                      }}
                    >
                      {notice.category.toUpperCase()}
                    </span>
                    {isHigh && (
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>
                        URGENT
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{notice.date}</span>
                </div>

                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#092b63', margin: '0 0 4px 0' }}>
                  {notice.title}
                </h3>

                <p
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    margin: 0,
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {notice.content}
                </p>

                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: '#1261c9', fontWeight: 700 }}>
                    Read full circular →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="modal-backdrop" onClick={() => setSelectedNotice(null)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{ maxWidth: '520px', borderRadius: '16px', padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  background: '#eff6ff',
                  color: '#1261c9',
                  padding: '3px 10px',
                  borderRadius: '6px',
                }}
              >
                {selectedNotice.category} Notice
              </span>
              <button
                onClick={() => setSelectedNotice(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#64748b', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: '18px', color: '#092b63', margin: '0 0 6px 0' }}>{selectedNotice.title}</h2>
            <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>
              Published: {selectedNotice.date} • For: {selectedNotice.targetClass} Students
            </div>

            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
              {selectedNotice.content}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button
                onClick={() => setSelectedNotice(null)}
                style={{
                  background: '#092b63',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
