import React, { useState, useEffect } from 'react';
import { TestItem, TestResultRecord } from '../types';

interface TestModalProps {
  test: TestItem;
  candidateName?: string;
  candidateClass?: string;
  candidateRollNo?: string;
  onClose: () => void;
  onTestComplete: (record: TestResultRecord) => void;
}

export const TestModal: React.FC<TestModalProps> = ({
  test,
  candidateName,
  candidateClass,
  candidateRollNo,
  onClose,
  onTestComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optIndex,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    // scale to 100
    const score100 = Math.round((correctCount / test.questions.length) * 100);
    return { correctCount, totalQuestions: test.questions.length, score100 };
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const { score100 } = calculateScore();
    const newRecord: TestResultRecord = {
      id: `${test.id}-${Date.now()}`,
      title: test.title,
      score: score100,
      total: 100,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      subject: test.subject,
      studentName: candidateName,
      studentClass: (candidateClass as any) || test.grade,
      rollNo: candidateRollNo,
    };
    onTestComplete(newRecord);
  };

  const currentQ = test.questions[currentQuestionIndex];
  const { correctCount, totalQuestions, score100 } = calculateScore();

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className={`badge ${test.badgeClass || ''}`}>{test.subject}</span>
              {test.grade && (
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
                  {test.grade}
                </span>
              )}
              {!isSubmitted && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: timeLeft < 300 ? '#dc2626' : '#1261c9',
                    background: timeLeft < 300 ? '#fee2e2' : '#eff6ff',
                    padding: '3px 8px',
                    borderRadius: '12px',
                  }}
                >
                  ⏱️ {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <h3 style={{ marginTop: '4px', marginBottom: candidateName ? '2px' : undefined }}>{test.title}</h3>
            {candidateName && (
              <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>👤 Candidate: <b>{candidateName}</b></span>
                {candidateClass && <span>• {candidateClass}</span>}
                {candidateRollNo && <span>• Roll: <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: '4px' }}>{candidateRollNo}</code></span>}
              </div>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!isSubmitted ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  fontSize: '13px',
                  color: '#64748b',
                }}
              >
                <span>
                  Question <b>{currentQuestionIndex + 1}</b> of {test.questions.length}
                </span>
                <span>
                  Answered: <b>{Object.keys(selectedAnswers).length}</b>/{test.questions.length}
                </span>
              </div>

              {/* Progress bar */}
              <div
                style={{
                  height: '6px',
                  background: '#e2e8f0',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${((currentQuestionIndex + 1) / test.questions.length) * 100}%`,
                    background: '#1261c9',
                    transition: 'width 0.2s',
                  }}
                />
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '16px',
                  marginBottom: '18px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1e293b',
                  lineHeight: '1.5',
                }}
              >
                {currentQ.question}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                  const optionLetters = ['A', 'B', 'C', 'D'];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #1261c9' : '1px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: isSelected ? '#1261c9' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '12px',
                          flexShrink: 0,
                        }}
                      >
                        {optionLetters[idx]}
                      </span>
                      <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: isSelected ? 600 : 400 }}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* Score summary view */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px 10px',
                  background: score100 >= 60 ? '#f0fdf4' : '#fff7ed',
                  borderRadius: '16px',
                  border: score100 >= 60 ? '1px solid #bbf7d0' : '1px solid #fed7aa',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '42px', marginBottom: '8px' }}>
                  {score100 >= 80 ? '🏆' : score100 >= 60 ? '🎉' : '📖'}
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                  {score100 >= 80 ? 'Outstanding Performance!' : score100 >= 60 ? 'Great Effort!' : 'Keep Practicing!'}
                </h4>
                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>
                  You scored <b>{score100} / 100</b> ({correctCount} of {totalQuestions} correct)
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginTop: '16px',
                  }}
                >
                  <div style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <small style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>ACCURACY</small>
                    <b style={{ color: '#1261c9', fontSize: '16px' }}>{score100}%</b>
                  </div>
                  <div style={{ background: '#ffffff', padding: '8px 16px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                    <small style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>STATUS</small>
                    <b style={{ color: score100 >= 40 ? '#16864c' : '#dc2626', fontSize: '16px' }}>
                      {score100 >= 40 ? 'Passed' : 'Needs Work'}
                    </b>
                  </div>
                </div>
              </div>

              {/* Review button or toggle */}
              <button
                onClick={() => setReviewMode(!reviewMode)}
                style={{
                  width: '100%',
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#334155',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>{reviewMode ? 'Hide Answer Review' : '📝 Review Questions & Solutions'}</span>
              </button>

              {reviewMode && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {test.questions.map((q, idx) => {
                    const userChoice = selectedAnswers[idx];
                    const isRight = userChoice === q.correctIndex;
                    return (
                      <div
                        key={idx}
                        style={{
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '14px',
                          background: '#ffffff',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                            Q{idx + 1}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: isRight ? '#16a34a' : '#dc2626',
                              background: isRight ? '#f0fdf4' : '#fef2f2',
                              padding: '2px 8px',
                              borderRadius: '8px',
                            }}
                          >
                            {isRight ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>
                          {q.question}
                        </p>
                        <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                          Your answer: <b>{userChoice !== undefined ? q.options[userChoice] : 'Not Attempted'}</b>
                        </div>
                        {!isRight && (
                          <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '6px' }}>
                            Correct answer: <b>{q.options[q.correctIndex]}</b>
                          </div>
                        )}
                        <div
                          style={{
                            background: '#f8fafc',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#64748b',
                            marginTop: '6px',
                          }}
                        >
                          💡 <b>Explanation:</b> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!isSubmitted ? (
            <>
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                style={{
                  background: 'transparent',
                  border: '1px solid #cbd5e1',
                  color: currentQuestionIndex === 0 ? '#94a3b8' : '#334155',
                  padding: '9px 14px',
                  borderRadius: '9px',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                Previous
              </button>

              {currentQuestionIndex < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  style={{
                    background: '#1261c9',
                    border: 'none',
                    color: '#ffffff',
                    padding: '9px 18px',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  style={{
                    background: '#16a34a',
                    border: 'none',
                    color: '#ffffff',
                    padding: '9px 18px',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  Submit Test
                </button>
              )}
            </>
          ) : (
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
              Done & View Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
