import React, { useState, useEffect } from 'react';
import { TestItem, StudentTestAttempt } from '../types';
import { useApp } from '../context/AppContext';

interface TestRunnerModalProps {
  test: TestItem;
  onClose: () => void;
  onCompleted: (attempt: StudentTestAttempt) => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ test, onClose, onCompleted }) => {
  const { currentStudent, submitTestAttempt } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptResult, setAttemptResult] = useState<StudentTestAttempt | null>(null);

  // Timer countdown
  useEffect(() => {
    if (attemptResult) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [attemptResult]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleDescriptiveChange = (qIndex: number, text: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: text }));
  };

  const toggleFlag = (qIndex: number) => {
    setFlagged((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };

  const calculateScore = () => {
    let score = 0;
    test.questions.forEach((q, idx) => {
      const ans = selectedAnswers[idx];
      if (q.type === 'mcq' && ans !== undefined && ans === q.correctIndex) {
        score += q.marks;
      } else if (q.type === 'descriptive') {
        // give baseline evaluation if answered
        if (typeof ans === 'string' && ans.trim().length > 20) {
          score += Math.round(q.marks * 0.85);
        }
      }
    });
    return score;
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const percentage = Math.round((score / test.totalMarks) * 100);
    const timeTaken = test.durationMinutes * 60 - timeLeft;

    const studentName = currentStudent ? currentStudent.name : 'Guest Student';
    const rollNo = currentStudent ? currentStudent.rollNo : 'PA-TEMP-01';
    const studentClass = currentStudent ? currentStudent.studentClass : test.grade;

    const created = submitTestAttempt({
      testId: test.id,
      testTitle: test.title,
      subject: test.subject,
      studentId: currentStudent ? currentStudent.id : 'temp-id',
      studentName,
      studentClass,
      rollNo,
      score,
      totalMarks: test.totalMarks,
      percentage,
      answers: selectedAnswers,
      timeTakenSeconds: timeTaken,
      status: 'evaluated',
    });

    setAttemptResult(created);
    setIsSubmitting(false);
  };

  const handleAutoSubmit = () => {
    if (!attemptResult) {
      handleFinalSubmit();
    }
  };

  const currentQ = test.questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '880px', width: '95%', maxHeight: '90vh', padding: 0, display: 'flex', flexDirection: 'column' }}
      >
        {/* If test is finished, show comprehensive scorecard with review */}
        {attemptResult ? (
          <div style={{ padding: '24px', overflowY: 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: attemptResult.percentage >= 70 ? '#dcfce7' : '#fef3c7',
                  color: attemptResult.percentage >= 70 ? '#15803d' : '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  margin: '0 auto 10px auto',
                }}
              >
                {attemptResult.percentage >= 70 ? '🎉' : '🎯'}
              </div>
              <h2 style={{ color: '#092b63', margin: '0 0 4px 0', fontSize: '22px' }}>
                Test Submitted Successfully!
              </h2>
              <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
                {test.title} • Evaluated with Detailed Solutions
              </p>
            </div>

            {/* Score cards grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                marginBottom: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>YOUR SCORE</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1261c9', margin: '4px 0' }}>
                  {attemptResult.score}/{attemptResult.totalMarks}
                </div>
                <small style={{ fontSize: '11px', color: '#1261c9', fontWeight: 700 }}>
                  {attemptResult.percentage}% Accuracy
                </small>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>CLASS RANK</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#15803d', margin: '4px 0' }}>
                  #{attemptResult.rank}
                </div>
                <small style={{ fontSize: '11px', color: '#166534' }}>
                  {attemptResult.rank === 1 ? '🥇 1st Rank!' : 'Top Percentile'}
                </small>
              </div>

              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontSize: '11px', color: '#6b21a8', fontWeight: 600 }}>QUESTIONS ATTEMPTED</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#7e22ce', margin: '4px 0' }}>
                  {answeredCount}/{test.questions.length}
                </div>
                <small style={{ fontSize: '11px', color: '#6b21a8' }}>
                  {test.questions.length - answeredCount} Skipped
                </small>
              </div>

              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontSize: '11px', color: '#92400e', fontWeight: 600 }}>TIME TAKEN</span>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#b45309', margin: '4px 0' }}>
                  {Math.round(attemptResult.timeTakenSeconds / 60)}m
                </div>
                <small style={{ fontSize: '11px', color: '#92400e' }}>
                  of {test.durationMinutes}m limit
                </small>
              </div>
            </div>

            {/* Questions Review & Explanations */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '18px' }}>
              <h3 style={{ fontSize: '16px', color: '#092b63', marginBottom: '14px' }}>
                Detailed Question Solutions & Explanations:
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {test.questions.map((q, idx) => {
                  const studentAns = selectedAnswers[idx];
                  const isCorrect = q.type === 'mcq' && studentAns === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '16px',
                        background: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                          QUESTION {idx + 1} ({q.marks} Marks)
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            background: isCorrect ? '#dcfce7' : studentAns === undefined ? '#f1f5f9' : '#fee2e2',
                            color: isCorrect ? '#15803d' : studentAns === undefined ? '#64748b' : '#b91c1c',
                          }}
                        >
                          {isCorrect ? '✓ Correct (+ ' + q.marks + ')' : studentAns === undefined ? '○ Unattempted' : '✕ Incorrect'}
                        </span>
                      </div>

                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 10px 0' }}>
                        {q.question}
                      </p>

                      {q.options && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          {q.options.map((opt, optIdx) => {
                            const isSelected = studentAns === optIdx;
                            const isCorrectOpt = optIdx === q.correctIndex;
                            let bg = '#f8fafc';
                            let border = '#e2e8f0';
                            let text = '#334155';

                            if (isCorrectOpt) {
                              bg = '#f0fdf4';
                              border = '#86efac';
                              text = '#166534';
                            } else if (isSelected && !isCorrectOpt) {
                              bg = '#fef2f2';
                              border = '#fca5a5';
                              text = '#991b1b';
                            }

                            return (
                              <div
                                key={optIdx}
                                style={{
                                  padding: '8px 12px',
                                  borderRadius: '6px',
                                  border: `1.5px solid ${border}`,
                                  background: bg,
                                  color: text,
                                  fontSize: '13px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                }}
                              >
                                <b>{String.fromCharCode(65 + optIdx)}.</b>
                                <span>{opt}</span>
                                {isCorrectOpt && <span style={{ marginLeft: 'auto', fontWeight: 700 }}>✓ Correct</span>}
                                {isSelected && !isCorrectOpt && <span style={{ marginLeft: 'auto', fontWeight: 700 }}>✕ Selected</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {q.explanation && (
                        <div
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            fontSize: '12px',
                            color: '#1e40af',
                          }}
                        >
                          <b>💡 Explanation:</b> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  onCompleted(attemptResult);
                  onClose();
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#1261c9',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                View in Results & Marksheets →
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Active Test Header */}
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1.5px solid #e2e8f0',
                background: '#092b63',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    color: '#ffb703',
                  }}
                >
                  {test.grade} • {test.subject}
                </span>
                <h3 style={{ margin: '3px 0 0 0', fontSize: '16px', color: '#ffffff' }}>{test.title}</h3>
              </div>

              {/* Countdown timer */}
              <div
                style={{
                  background: timeLeft < 300 ? '#dc2626' : '#1261c9',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 800,
                  fontSize: '16px',
                  letterSpacing: '0.5px',
                }}
              >
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Test Content Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', flex: 1, minHeight: '400px', overflow: 'hidden' }}>
              {/* Question Area */}
              <div style={{ padding: '20px', overflowY: 'auto', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1261c9' }}>
                    Question {currentIndex + 1} of {test.questions.length}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Marks: +{currentQ.marks}</span>
                    <button
                      type="button"
                      onClick={() => toggleFlag(currentIndex)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: flagged[currentIndex] ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                        background: flagged[currentIndex] ? '#fef3c7' : '#ffffff',
                        color: flagged[currentIndex] ? '#b45309' : '#64748b',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {flagged[currentIndex] ? '🚩 Flagged' : '🏳️ Flag for Review'}
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div
                  style={{
                    background: '#f8fafc',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#0f172a',
                    lineHeight: 1.6,
                    marginBottom: '20px',
                  }}
                >
                  {currentQ.question}
                </div>

                {/* Options / Input */}
                {currentQ.type === 'mcq' && currentQ.options ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentIndex] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectAnswer(currentIndex, optIdx)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #1261c9' : '1.5px solid #e2e8f0',
                            background: isSelected ? '#eff6ff' : '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: isSelected ? '6px solid #1261c9' : '2px solid #cbd5e1',
                              background: '#ffffff',
                            }}
                          />
                          <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: isSelected ? 600 : 400 }}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Write Your Descriptive Solution:
                    </label>
                    <textarea
                      rows={6}
                      value={(selectedAnswers[currentIndex] as string) || ''}
                      onChange={(e) => handleDescriptiveChange(currentIndex, e.target.value)}
                      placeholder="Type formulas, steps, theorems, or final values..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        lineHeight: 1.5,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Question Navigation Palette Sidebar */}
              <div style={{ background: '#f8fafc', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#1e293b' }}>Question Palette</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {test.questions.map((_, idx) => {
                      const isAns = selectedAnswers[idx] !== undefined;
                      const isFlag = flagged[idx];
                      const isCurr = currentIndex === idx;

                      let bg = '#ffffff';
                      let color = '#475569';
                      let border = '1px solid #cbd5e1';

                      if (isAns) {
                        bg = '#16a34a';
                        color = '#ffffff';
                        border = '1px solid #16a34a';
                      } else if (isFlag) {
                        bg = '#f59e0b';
                        color = '#ffffff';
                        border = '1px solid #f59e0b';
                      }

                      if (isCurr) {
                        border = '2.5px solid #092b63';
                      }

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCurrentIndex(idx)}
                          style={{
                            height: '36px',
                            borderRadius: '6px',
                            background: bg,
                            color,
                            border,
                            fontWeight: 700,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#16a34a' }} />
                    <span>Answered ({answeredCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#ffffff', border: '1px solid #cbd5e1' }} />
                    <span>Unanswered ({test.questions.length - answeredCount})</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#f59e0b' }} />
                    <span>Flagged</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)',
                    }}
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit Test Now ✓'}
                  </button>
                </div>
              </div>
            </div>

            {/* Test Footer */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: '1px solid #e2e8f0',
                background: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button
                type="button"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: currentIndex === 0 ? '#cbd5e1' : '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {currentIndex < test.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: '#1261c9',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Save & Next →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Finish Test
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
