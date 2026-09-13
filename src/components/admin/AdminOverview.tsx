import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdminNavTab } from '../../types';

interface AdminOverviewProps {
  onNavigate: (tab: AdminNavTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const { students, tests, materials, videos, fees, attempts, announcements } = useApp();

  const totalStudents = students.length;
  const class12Count = students.filter((s) => s.studentClass === 'Class 12th').length;
  const class10Count = students.filter((s) => s.studentClass === 'Class 10th').length;

  const totalCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDue = fees.reduce((sum, f) => sum + f.dueAmount, 0);
  const totalSubmissions = attempts.length;

  const recentAttempts = attempts.slice(0, 5);

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title */}
      <div style={{ marginBottom: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Director’s Control Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Real-time analytics across admissions, test series submissions, fee collections, and digital study resources.
          </p>
        </div>

        {/* Fast Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onNavigate('tests')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#092b63',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + New Test
          </button>
          <button
            onClick={() => onNavigate('materials')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#1261c9',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Upload Notes
          </button>
          <button
            onClick={() => onNavigate('students')}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#16a34a',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            + Enroll Student
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Total Students */}
        <div
          onClick={() => onNavigate('students')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>TOTAL STUDENTS</span>
            <span style={{ fontSize: '20px' }}>👥</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#092b63', margin: '6px 0 4px 0' }}>
            {totalStudents}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Class 12th: <b>{class12Count}</b> • Class 10th: <b>{class10Count}</b>
          </div>
        </div>

        {/* Total Fee Collected */}
        <div
          onClick={() => onNavigate('fees')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>FEES COLLECTED</span>
            <span style={{ fontSize: '20px' }}>💰</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#15803d', margin: '6px 0 4px 0' }}>
            ₹{totalCollected.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#dc2626' }}>
            Pending Dues: <b>₹{totalDue.toLocaleString()}</b>
          </div>
        </div>

        {/* Tests & Submissions */}
        <div
          onClick={() => onNavigate('tests')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#1e40af', fontWeight: 600 }}>TEST SERIES & EVALUATIONS</span>
            <span style={{ fontSize: '20px' }}>⏱️</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1261c9', margin: '6px 0 4px 0' }}>
            {tests.length} Active
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            Evaluated Attempts: <b>{totalSubmissions} submissions</b>
          </div>
        </div>

        {/* Study Materials & Videos */}
        <div
          onClick={() => onNavigate('materials')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '20px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#6b21a8', fontWeight: 600 }}>CONTENT ASSETS</span>
            <span style={{ fontSize: '20px' }}>📚</span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#7e22ce', margin: '6px 0 4px 0' }}>
            {materials.length + videos.length}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b' }}>
            {materials.length} PDF Docs • {videos.length} YouTube Lectures
          </div>
        </div>
      </div>

      {/* Two-column layout: Recent Test Attempts & Fee Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '20px' }}>
        {/* Recent Submissions */}
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
            <h3 style={{ fontSize: '16px', color: '#092b63', margin: 0 }}>Recent Test Submissions & Auto-Scores</h3>
            <button
              onClick={() => onNavigate('results')}
              style={{
                fontSize: '12px',
                color: '#1261c9',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              View Full Rank List →
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                  <th style={{ textAlign: 'left', padding: '8px 10px' }}>Student</th>
                  <th style={{ textAlign: 'left', padding: '8px 10px' }}>Test Title</th>
                  <th style={{ textAlign: 'center', padding: '8px 10px' }}>Score</th>
                  <th style={{ textAlign: 'center', padding: '8px 10px' }}>Rank</th>
                  <th style={{ textAlign: 'right', padding: '8px 10px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.map((att) => (
                  <tr key={att.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px' }}>
                      <b style={{ color: '#0f172a' }}>{att.studentName}</b>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{att.rollNo} • {att.studentClass}</div>
                    </td>
                    <td style={{ padding: '10px', color: '#334155' }}>{att.testTitle}</td>
                    <td style={{ textAlign: 'center', padding: '10px' }}>
                      <span style={{ fontWeight: 800, color: '#16a34a' }}>{att.score}</span> / {att.totalMarks}
                    </td>
                    <td style={{ textAlign: 'center', padding: '10px', fontWeight: 800, color: '#1261c9' }}>
                      #{att.rank || 1}
                    </td>
                    <td style={{ textAlign: 'right', padding: '10px', color: '#94a3b8' }}>{att.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements & Fee Defaulters quick alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Active Announcements */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '15px', color: '#092b63', margin: 0 }}>Active Public Notices ({announcements.length})</h3>
              <button
                onClick={() => onNavigate('announcements')}
                style={{ fontSize: '11px', color: '#1261c9', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Manage
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {announcements.slice(0, 3).map((anc) => (
                <div key={anc.id} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, color: '#1261c9' }}>{anc.category}</span>
                    <span style={{ color: '#94a3b8' }}>{anc.date}</span>
                  </div>
                  <b style={{ fontSize: '12px', color: '#0f172a' }}>{anc.title}</b>
                </div>
              ))}
            </div>
          </div>

          {/* Fee defaulters alert */}
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '14px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '15px', color: '#9f1239', margin: 0 }}>Outstanding Fees Alert</h3>
              <button
                onClick={() => onNavigate('fees')}
                style={{ fontSize: '11px', color: '#be123c', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Send Reminders →
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#881337', margin: '0 0 10px 0', lineHeight: 1.4 }}>
              {fees.filter((f) => f.dueAmount > 0).length} students have pending installment balances totaling <b>₹{totalDue.toLocaleString()}</b>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
