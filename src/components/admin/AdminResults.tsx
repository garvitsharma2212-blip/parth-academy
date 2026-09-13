import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentClass, StudentTestAttempt } from '../../types';
import { MarksheetModal } from '../MarksheetModal';

export const AdminResults: React.FC = () => {
  const { attempts, students, publishResult, publishAllResults, createManualResult } = useApp();
  const [filterClass, setFilterClass] = useState<StudentClass | 'All'>('All');
  const [filterSubject, setFilterSubject] = useState<string>('All');
  const [selectedAttempt, setSelectedAttempt] = useState<StudentTestAttempt | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Manual result entry form
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [testTitle, setTestTitle] = useState('Weekly Chapter Evaluation #13');
  const [subject, setSubject] = useState('Physics');
  const [score, setScore] = useState<number>(85);
  const [totalMarks, setTotalMarks] = useState<number>(100);

  // Filter attempts
  const filtered = attempts.filter((a) => {
    const matchClass = filterClass === 'All' || a.studentClass === filterClass;
    const matchSub = filterSubject === 'All' || a.subject === filterSubject;
    return matchClass && matchSub;
  });

  // Calculate stats
  const totalSubmissions = filtered.length;
  const publishedCount = filtered.filter((a) => a.isPublished !== false).length;
  const avgAccuracy = totalSubmissions > 0 ? Math.round(filtered.reduce((acc, a) => acc + a.percentage, 0) / totalSubmissions) : 0;
  const highestScore = totalSubmissions > 0 ? Math.max(...filtered.map((a) => a.score)) : 0;
  const passingSubmissions = filtered.filter((a) => a.percentage >= 40).length;
  const passRate = totalSubmissions > 0 ? Math.round((passingSubmissions / totalSubmissions) * 100) : 0;

  // Rank list sorted by score descending
  const rankList = [...filtered].sort((a, b) => b.score - a.score);

  const handlePublishAll = async () => {
    await publishAllResults();
    setPublishSuccessMsg('All student examination scorecards have been published and synced to Firebase Firestore!');
    setTimeout(() => setPublishSuccessMsg(null), 4000);
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId) || students[0];
    if (!st) return;

    const percentage = Math.round((Number(score) / Number(totalMarks)) * 100);

    await createManualResult({
      testId: `test-manual-${Date.now()}`,
      testTitle: testTitle.trim(),
      subject: subject.trim(),
      studentId: st.id,
      studentName: st.name,
      studentClass: st.studentClass,
      rollNo: st.rollNo,
      score: Number(score),
      totalMarks: Number(totalMarks),
      percentage,
      rank: 1,
      answers: {},
      timeTakenSeconds: 1800,
      status: 'evaluated',
      isPublished: true,
    });

    setIsAddModalOpen(false);
    setPublishSuccessMsg(`Published result scorecard for ${st.name} (${score}/${totalMarks})!`);
    setTimeout(() => setPublishSuccessMsg(null), 4000);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Stats */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Examination Results & Marksheet Control</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Publish official student scorecards to student portal, evaluate rankings, and log offline test marks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#092b63',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(9,43,99,0.25)',
            }}
          >
            <span>➕</span> Log Offline Test Result
          </button>

          <button
            onClick={handlePublishAll}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#16a34a',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(22,163,74,0.25)',
            }}
          >
            <span>📢</span> Publish All Results to Students
          </button>

          <button
            onClick={() => window.print()}
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#0f172a',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🖨️</span> Print Master List
          </button>
        </div>
      </div>

      {publishSuccessMsg && (
        <div
          style={{
            background: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '18px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>✅</span>
          <span>{publishSuccessMsg}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SUBMISSIONS EVALUATED</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#092b63', margin: '4px 0' }}>{totalSubmissions}</div>
          <small style={{ fontSize: '11px', color: '#16a34a' }}>{publishedCount} Published to Students</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>CLASS AVERAGE SCORE</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#1261c9', margin: '4px 0' }}>{avgAccuracy}%</div>
          <small style={{ fontSize: '11px', color: '#1261c9' }}>Aggregate performance</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>HIGHEST MARKS</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>{highestScore} / 100</div>
          <small style={{ fontSize: '11px', color: '#15803d' }}>Institute top score</small>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>PASS PERCENTAGE (≥40%)</span>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>{passRate}%</div>
          <small style={{ fontSize: '11px', color: '#b45309' }}>Standard qualifying mark</small>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['All', 'Class 12th', 'Class 10th'] as const).map((cls) => {
            const isSel = filterClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSel ? '1px solid #092b63' : '1px solid #cbd5e1',
                  background: isSel ? '#092b63' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  fontSize: '13px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {cls}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'Physics + Chemistry', 'Mathematics + Science'].map((sub) => {
            const isSel = filterSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setFilterSubject(sub)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSel ? '1px solid #1261c9' : '1px solid #cbd5e1',
                  background: isSel ? '#eff6ff' : '#ffffff',
                  color: isSel ? '#1261c9' : '#475569',
                  fontSize: '13px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rank List Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: '16px', color: '#092b63', margin: 0 }}>Official Candidate Rank List ({rankList.length})</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Live Firestore sync with Student Portal results</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ textAlign: 'center', padding: '10px 12px', width: '60px' }}>Rank</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Student Name</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Roll Number</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Class / Subject</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Test Title</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Score</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Accuracy</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Publish Status</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rankList.map((att, idx) => {
                const isPub = att.isPublished !== false;
                return (
                  <tr key={att.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: idx === 0 ? '#ffb703' : idx === 1 ? '#94a3b8' : idx === 2 ? '#cd7f32' : '#f1f5f9',
                          color: idx < 3 ? '#092b63' : '#475569',
                          fontWeight: 800,
                          fontSize: '12px',
                          lineHeight: '24px',
                        }}
                      >
                        {idx + 1}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <b style={{ color: '#092b63' }}>{att.studentName}</b>
                    </td>
                    <td style={{ padding: '12px', color: '#475569' }}>{att.rollNo}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontWeight: 600 }}>{att.studentClass}</span>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{att.subject}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#334155' }}>
                      {att.testTitle}
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{att.date}</div>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: '#16a34a' }}>
                      {att.score} / {att.totalMarks}
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
                    <td style={{ textAlign: 'center', padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isPub ? '#dcfce7' : '#fef3c7',
                          color: isPub ? '#15803d' : '#b45309',
                          border: isPub ? '1px solid #86efac' : '1px solid #fde68a',
                        }}
                      >
                        {isPub ? '✅ Published' : '🔒 Draft'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => publishResult(att.id, !isPub)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: isPub ? '#fef3c7' : '#dcfce7',
                            border: '1px solid ' + (isPub ? '#fde68a' : '#86efac'),
                            color: isPub ? '#b45309' : '#15803d',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                          title={isPub ? 'Hide from student portal' : 'Publish to student portal'}
                        >
                          {isPub ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => setSelectedAttempt(att)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '6px',
                            background: '#1261c9',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          📜 Marksheet
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Result Entry Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '500px' }}
          >
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Publish Offline Test Scorecard</h3>
                <p className="modal-subtitle">Add scorecards for classroom weekly tests or board pre-mock exams</p>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreateManual}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Select Student *
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    required
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.rollNo} • {s.studentClass})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Test Title *
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="e.g. Weekly Offline Test #13 (Optics & Organic)"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Physics + Chemistry"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Marks Obtained *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={totalMarks}
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
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
                    boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)',
                  }}
                >
                  📢 Save & Publish Result to Firestore
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedAttempt && (
        <MarksheetModal attempt={selectedAttempt} onClose={() => setSelectedAttempt(null)} />
      )}
    </div>
  );
};
