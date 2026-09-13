import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TestItem, StudentClass, TestType, QuestionItem } from '../../types';
import { TestRunnerModal } from '../TestRunnerModal';

export const AdminTests: React.FC = () => {
  const { tests, addTest, deleteTest } = useApp();
  const [selectedGrade, setSelectedGrade] = useState<StudentClass | 'All'>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewTest, setPreviewTest] = useState<TestItem | null>(null);

  // New Test form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState<StudentClass>('Class 12th');
  const [testType, setTestType] = useState<TestType>('weekly');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [totalMarks, setTotalMarks] = useState<number>(20);
  const [scheduledDate, setScheduledDate] = useState('Next Sunday 10:00 AM');

  // Question builder state
  const [questions, setQuestions] = useState<QuestionItem[]>([
    {
      id: 'q-new-1',
      questionText: 'Which law states that the induced EMF is proportional to rate of change of magnetic flux?',
      options: ["Faraday's Law of Induction", "Ampere's Circuital Law", "Coulomb's Inverse Square Law", "Biot-Savart Law"],
      correctOptionIndex: 0,
      marks: 4,
      explanation: "Faraday's law states that EMF is equal to -dΦ/dt.",
    },
    {
      id: 'q-new-2',
      questionText: 'What is the SI unit of magnetic flux Φ?',
      options: ['Tesla (T)', 'Weber (Wb)', 'Henry (H)', 'Volt (V)'],
      correctOptionIndex: 1,
      marks: 4,
      explanation: 'Weber (Wb) is the SI unit of magnetic flux.',
    },
  ]);

  const [newQText, setNewQText] = useState('');
  const [newOpt0, setNewOpt0] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState<number>(0);
  const [newExp, setNewExp] = useState('');

  const handleAddQuestionToBuilder = () => {
    if (!newQText.trim() || !newOpt0.trim() || !newOpt1.trim()) return;
    const newQ: QuestionItem = {
      id: `q-${Date.now()}`,
      questionText: newQText.trim(),
      options: [newOpt0.trim(), newOpt1.trim(), newOpt2.trim() || 'None', newOpt3.trim() || 'All of the above'],
      correctOptionIndex: Number(newCorrectIdx),
      marks: 4,
      explanation: newExp.trim() || 'Verified standard board solution.',
    };
    setQuestions([...questions, newQ]);
    setNewQText('');
    setNewOpt0('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewExp('');
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    addTest({
      title: title.trim(),
      subject: subject.trim(),
      grade,
      testType,
      durationMinutes: Number(durationMinutes) || 30,
      totalMarks: Number(totalMarks) || questions.length * 4,
      questionsCount: questions.length,
      scheduledDate: scheduledDate.trim(),
      isPublished: true,
      questions,
    });

    setTitle('');
    setIsCreateModalOpen(false);
  };

  const filtered = tests.filter((t) => {
    return selectedGrade === 'All' || t.grade === selectedGrade;
  });

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Test & Exam Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Configure Weekly Mock Series, Chapter Tests, and Board Mock Exams with instant auto-grading.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            padding: '10px 18px',
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
            boxShadow: '0 3px 8px rgba(9, 43, 99, 0.25)',
          }}
        >
          <span>⏱️</span> Create New Test
        </button>
      </div>

      {/* Class filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {(['All', 'Class 12th', 'Class 10th'] as const).map((g) => {
          const isSel = selectedGrade === g;
          return (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSel ? '1.5px solid #092b63' : '1px solid #cbd5e1',
                background: isSel ? '#092b63' : '#ffffff',
                color: isSel ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: isSel ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {g === 'All' ? 'All Classes' : g}
            </button>
          );
        })}
      </div>

      {/* Tests Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Test Details</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Class / Subject</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Type</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Questions</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Duration</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Marks</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <b style={{ color: '#092b63' }}>{t.title}</b>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Schedule: {t.scheduledDate || 'Anytime'}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{t.grade}</span>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.subject}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        background: '#eff6ff',
                        color: '#1261c9',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {t.testType.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 600 }}>
                    {t.questionsCount} MCQs
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#475569' }}>
                    {t.durationMinutes} min
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', fontWeight: 700, color: '#15803d' }}>
                    {t.totalMarks}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setPreviewTest(t)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#1261c9',
                          border: 'none',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Launch Test
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete test "${t.title}"?`)) {
                            deleteTest(t.id);
                          }
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: '#fef2f2',
                          border: '1px solid #fecaca',
                          color: '#b91c1c',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Test Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '640px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#092b63' }}>PARTH ACADEMY EXAM ENGINE</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Create Online Test</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <form onSubmit={handleCreateTest}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Test Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sunday Mock: Ray Optics & Wave Optics"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Target Class *
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value as StudentClass)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="Class 12th">Class 12th</option>
                      <option value="Class 10th">Class 10th</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Physics / Chemistry / Maths"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Test Type *
                    </label>
                    <select
                      value={testType}
                      onChange={(e) => setTestType(e.target.value as TestType)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="weekly">Weekly Test</option>
                      <option value="chapter">Chapter Test</option>
                      <option value="full_syllabus">Full Syllabus</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Duration (Mins)
                    </label>
                    <input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      min="5"
                      max="180"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      min="10"
                      max="200"
                    />
                  </div>
                </div>

                {/* Questions list preview */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <b style={{ fontSize: '13px', color: '#092b63' }}>Configured Questions ({questions.length})</b>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>MCQ Auto-Evaluation Enabled</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                    {questions.map((q, idx) => (
                      <div key={q.id} style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <b>Q{idx + 1}:</b> {q.questionText}
                          <div style={{ color: '#16a34a', fontSize: '11px', marginTop: '2px' }}>
                            Ans: {q.options[q.correctOptionIndex]}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQuestions(questions.filter((item) => item.id !== q.id))}
                          style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '11px' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add question inline form */}
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      + Add New Question
                    </div>
                    <input
                      type="text"
                      value={newQText}
                      onChange={(e) => setNewQText(e.target.value)}
                      placeholder="Question statement (e.g. Find equivalent resistance...)"
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '6px', boxSizing: 'border-box' }}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                      <input
                        type="text"
                        value={newOpt0}
                        onChange={(e) => setNewOpt0(e.target.value)}
                        placeholder="Option A"
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        value={newOpt1}
                        onChange={(e) => setNewOpt1(e.target.value)}
                        placeholder="Option B"
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        value={newOpt2}
                        onChange={(e) => setNewOpt2(e.target.value)}
                        placeholder="Option C"
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                      <input
                        type="text"
                        value={newOpt3}
                        onChange={(e) => setNewOpt3(e.target.value)}
                        placeholder="Option D"
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <label style={{ fontSize: '11px', color: '#475569' }}>Correct Option:</label>
                      <select
                        value={newCorrectIdx}
                        onChange={(e) => setNewCorrectIdx(Number(e.target.value))}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      >
                        <option value={0}>Option A</option>
                        <option value={1}>Option B</option>
                        <option value={2}>Option C</option>
                        <option value={3}>Option D</option>
                      </select>

                      <button
                        type="button"
                        onClick={handleAddQuestionToBuilder}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: '#092b63',
                          color: '#fff',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          marginLeft: 'auto',
                        }}
                      >
                        Add to Test
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={questions.length === 0}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#092b63',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(9, 43, 99, 0.25)',
                  }}
                >
                  Save & Publish Test
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {previewTest && (
        <TestRunnerModal test={previewTest} onClose={() => setPreviewTest(null)} />
      )}
    </div>
  );
};
