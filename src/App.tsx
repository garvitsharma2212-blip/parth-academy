/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageId, SubjectMaterial, NoteItem, TestItem, TestResultRecord, StudentClass, WeeklyTestRegistration } from './types';
import { STUDY_MATERIALS, REVISION_NOTES, TESTS_DATA, INITIAL_RESULTS } from './data';
import { TestModal } from './components/TestModal';
import { NotesModal } from './components/NotesModal';
import { MaterialModal } from './components/MaterialModal';
import { ResultModal } from './components/ResultModal';
import { WeeklyRegisterModal } from './components/WeeklyRegisterModal';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [resultsList, setResultsList] = useState<TestResultRecord[]>(INITIAL_RESULTS);

  // Class Selection state: Class 10th or Class 12th
  const [selectedClass, setSelectedClass] = useState<StudentClass>(() => {
    const saved = localStorage.getItem('pa_selected_class');
    return (saved === 'Class 10th' || saved === 'Class 12th') ? saved : 'Class 12th';
  });

  // User registration for weekly test
  const [weeklyRegistration, setWeeklyRegistration] = useState<WeeklyTestRegistration | null>(() => {
    try {
      const saved = localStorage.getItem('pa_weekly_reg');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      studentName: 'Garvit Sharma',
      studentClass: 'Class 12th',
      rollNo: 'PA-2026-1084',
      registeredAt: '12 Sep 2026',
    };
  });

  // Active modals
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<SubjectMaterial | null>(null);
  const [activeResultDetail, setActiveResultDetail] = useState<TestResultRecord | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [pendingWeeklyTestId, setPendingWeeklyTestId] = useState<string | null>(null);

  // Filters for sub-pages
  const [notesFilter, setNotesFilter] = useState<'all' | '12th' | '10th'>(() =>
    selectedClass === 'Class 12th' ? '12th' : '10th'
  );
  const [materialsFilter, setMaterialsFilter] = useState<'all' | '12th' | '10th'>(() =>
    selectedClass === 'Class 12th' ? '12th' : '10th'
  );
  const [testsFilter, setTestsFilter] = useState<'all' | '12th' | '10th'>(() =>
    selectedClass === 'Class 12th' ? '12th' : '10th'
  );

  const handleSelectClass = (newClass: StudentClass) => {
    setSelectedClass(newClass);
    localStorage.setItem('pa_selected_class', newClass);
    const filterKey = newClass === 'Class 12th' ? '12th' : '10th';
    setNotesFilter(filterKey);
    setMaterialsFilter(filterKey);
    setTestsFilter(filterKey);
  };

  const showPage = (page: PageId) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterSubmit = (reg: WeeklyTestRegistration, autoStart: boolean) => {
    setWeeklyRegistration(reg);
    localStorage.setItem('pa_weekly_reg', JSON.stringify(reg));
    setIsRegisterModalOpen(false);

    if (reg.studentClass !== selectedClass) {
      handleSelectClass(reg.studentClass);
    }

    if (autoStart) {
      const testIdToLaunch = pendingWeeklyTestId || (reg.studentClass === 'Class 12th' ? 'weekly-13-12th' : 'weekly-13-10th');
      setPendingWeeklyTestId(null);
      const target = TESTS_DATA.find((t) => t.id === testIdToLaunch) || TESTS_DATA[0];
      setActiveTest(target);
    }
  };

  const handleStartWeeklyTestClick = (testId: string) => {
    if (!weeklyRegistration || !weeklyRegistration.studentName.trim()) {
      setPendingWeeklyTestId(testId);
      setIsRegisterModalOpen(true);
      return;
    }
    const targetTest = TESTS_DATA.find((t) => t.id === testId) || TESTS_DATA[0];
    setActiveTest(targetTest);
  };

  const handleStartTest = (testId?: string) => {
    const targetTest = TESTS_DATA.find((t) => t.id === testId) || TESTS_DATA[0];
    setActiveTest(targetTest);
  };

  const handleTestComplete = (newRecord: TestResultRecord) => {
    setResultsList((prev) => [newRecord, ...prev]);
  };

  // Calculate dynamic stats
  const totalTests = resultsList.length;
  const avgScore =
    totalTests > 0
      ? Math.round(resultsList.reduce((acc, r) => acc + (r.score / r.total) * 100, 0) / totalTests)
      : 84;
  const passedTests = resultsList.filter((r) => r.score / r.total >= 0.4).length;

  // Filtered lists
  const filteredNotes = REVISION_NOTES.filter((note) => {
    if (notesFilter === '12th') return note.grade === 'Class 12th';
    if (notesFilter === '10th') return note.grade === 'Class 10th';
    return true;
  });

  const filteredMaterials = STUDY_MATERIALS.filter((mat) => {
    if (materialsFilter === '12th') return mat.grade === 'Class 12th';
    if (materialsFilter === '10th') return mat.grade === 'Class 10th';
    return true;
  });

  const regularTests = TESTS_DATA.filter(
    (t) => t.id !== 'weekly-13' && t.id !== 'weekly-13-12th' && t.id !== 'weekly-13-10th'
  ).filter((t) => {
    if (testsFilter === '12th') return t.grade === 'Class 12th';
    if (testsFilter === '10th') return t.grade === 'Class 10th';
    return true;
  });

  const currentWeeklyTestId = selectedClass === 'Class 12th' ? 'weekly-13-12th' : 'weekly-13-10th';
  const currentWeeklyTest = TESTS_DATA.find((t) => t.id === currentWeeklyTestId) || TESTS_DATA[0];

  return (
    <div className="app-container">
      {/* TOP BAR */}
      <header id="topbar" className="topbar">
        <div className="topbar-content">
          <div className="logo" onClick={() => showPage('home')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">PA</div>
            <div>
              <h1>Parth Academy</h1>
              <p>Learn • Practice • Succeed</p>
            </div>
          </div>

          <div className="header-actions">
            {/* Class Toggle (10th / 12th) */}
            <div
              id="header-class-selector"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.18)',
                borderRadius: '24px',
                padding: '3px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
              title="Select Class"
            >
              <button
                id="btn-header-class-12"
                onClick={() => handleSelectClass('Class 12th')}
                style={{
                  background: selectedClass === 'Class 12th' ? '#ffffff' : 'transparent',
                  color: selectedClass === 'Class 12th' ? '#092b63' : '#ffffff',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '4px 11px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: selectedClass === 'Class 12th' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                12th
              </button>
              <button
                id="btn-header-class-10"
                onClick={() => handleSelectClass('Class 10th')}
                style={{
                  background: selectedClass === 'Class 10th' ? '#ffffff' : 'transparent',
                  color: selectedClass === 'Class 10th' ? '#092b63' : '#ffffff',
                  border: 'none',
                  borderRadius: '18px',
                  padding: '4px 11px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: selectedClass === 'Class 10th' ? '0 2px 6px rgba(0,0,0,0.2)' : 'none',
                }}
              >
                10th
              </button>
            </div>

            {/* Candidate / Registration Profile Pill */}
            <button
              id="btn-header-candidate"
              onClick={() => setIsRegisterModalOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                maxWidth: '150px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title="Click to register or edit student profile for weekly test"
            >
              <span>👤</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {weeklyRegistration?.studentName ? weeklyRegistration.studentName.split(' ')[0] : 'Register'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* HOME */}
        <section id="home" className={`page ${currentPage === 'home' ? 'active' : ''}`}>
          {/* Welcome Card with Class Switcher */}
          <div className="welcome" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <p style={{ margin: 0 }}>
                Welcome back, <b>{weeklyRegistration?.studentName || 'Student'}</b> 👋
              </p>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: '#e0f2fe',
                  color: '#0369a1',
                  border: '1px solid #bae6fd',
                  padding: '3px 10px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                🎓 Active: {selectedClass}
              </div>
            </div>
            <h2 style={{ margin: 0 }}>Study smarter, score better.</h2>
          </div>

          {/* Class 10 / 12 Quick Switcher Banner */}
          <div
            id="home-class-selector-card"
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '14px 16px',
              marginBottom: '16px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                Select Your Class:
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Tailors syllabus & weekly tests
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                id="btn-home-select-12"
                onClick={() => handleSelectClass('Class 12th')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: selectedClass === 'Class 12th' ? '2px solid #1261c9' : '1px solid #cbd5e1',
                  background: selectedClass === 'Class 12th' ? '#eff6ff' : '#f8fafc',
                  color: selectedClass === 'Class 12th' ? '#092b63' : '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🎓</span> Class 12th (PCM)
              </button>
              <button
                id="btn-home-select-10"
                onClick={() => handleSelectClass('Class 10th')}
                style={{
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: selectedClass === 'Class 10th' ? '2px solid #1261c9' : '1px solid #cbd5e1',
                  background: selectedClass === 'Class 10th' ? '#eff6ff' : '#f8fafc',
                  color: selectedClass === 'Class 10th' ? '#092b63' : '#475569',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🎒</span> Class 10th (General)
              </button>
            </div>
          </div>

          {/* Announcement Banner */}
          <div className="announcement" role="alert">
            <span>📢</span>
            <div style={{ flex: 1 }}>
              <b>Latest Announcement</b>
              <p>Weekly Test #13 for {selectedClass} is scheduled for Sunday at 10:00 AM.</p>
            </div>
            <button
              onClick={() => showPage('weekly')}
              style={{
                background: '#1261c9',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {weeklyRegistration ? 'View Exam' : 'Register Now'}
            </button>
          </div>

          <h3 className="section-title">What do you want to study?</h3>

          <div className="cards">
            <button id="card-materials" className="card" onClick={() => showPage('materials')}>
              <span>📚</span>
              <b>Study Materials</b>
              <small>{selectedClass} Books & PDFs</small>
            </button>

            <button id="card-notes" className="card" onClick={() => showPage('notes')}>
              <span>📝</span>
              <b>Notes</b>
              <small>{selectedClass} Revision Sheets</small>
            </button>

            <button id="card-tests" className="card" onClick={() => showPage('tests')}>
              <span>✅</span>
              <b>Tests</b>
              <small>Chapter-wise Quizzes</small>
            </button>

            <button id="card-weekly" className="card" onClick={() => showPage('weekly')}>
              <span>📅</span>
              <b>Weekly Tests</b>
              <small>Sunday 10:00 AM Exam</small>
            </button>
          </div>

          <div className="performance">
            <h3>Your Performance</h3>

            <div className="stats">
              <div id="stat-tests-completed">
                <strong>{totalTests}</strong>
                <span>Tests Completed</span>
              </div>

              <div id="stat-average-score">
                <strong>{avgScore}%</strong>
                <span>Average Score</span>
              </div>

              <div id="stat-certificates">
                <strong>{passedTests}</strong>
                <span>Passed</span>
              </div>
            </div>
          </div>
        </section>

        {/* MATERIALS */}
        <section id="materials" className={`page ${currentPage === 'materials' ? 'active' : ''}`}>
          <button className="page-back-btn" onClick={() => showPage('home')}>
            ← Back to Home
          </button>
          <h2>📚 Study Materials</h2>
          <p className="subtitle">Official syllabus, books, PDFs & reference guides.</p>

          {/* Class Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '18px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            <button
              id="btn-mat-filter-12"
              onClick={() => setMaterialsFilter('12th')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: materialsFilter === '12th' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: materialsFilter === '12th' ? '#1261c9' : '#ffffff',
                color: materialsFilter === '12th' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🎓 Class 12th Materials
            </button>
            <button
              id="btn-mat-filter-10"
              onClick={() => setMaterialsFilter('10th')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: materialsFilter === '10th' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: materialsFilter === '10th' ? '#1261c9' : '#ffffff',
                color: materialsFilter === '10th' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🎒 Class 10th Materials
            </button>
            <button
              id="btn-mat-filter-all"
              onClick={() => setMaterialsFilter('all')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: materialsFilter === 'all' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: materialsFilter === 'all' ? '#1261c9' : '#ffffff',
                color: materialsFilter === 'all' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              All Materials ({STUDY_MATERIALS.length})
            </button>
          </div>

          {filteredMaterials.map((item) => (
            <div key={item.id} className="list-card">
              <div className="item-icon">{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <b>{item.name}</b>
                  {item.grade && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '8px',
                        background: item.grade === 'Class 12th' ? '#eff6ff' : '#f1f5f9',
                        color: item.grade === 'Class 12th' ? '#1261c9' : '#475569',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      {item.grade}
                    </span>
                  )}
                </div>
                <p>{item.description}</p>
              </div>
              <button
                id={`btn-open-material-${item.id}`}
                onClick={() => setActiveMaterial(item)}
              >
                Open
              </button>
            </div>
          ))}
        </section>

        {/* NOTES */}
        <section id="notes" className={`page ${currentPage === 'notes' ? 'active' : ''}`}>
          <button className="page-back-btn" onClick={() => showPage('home')}>
            ← Back to Home
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2>📝 Revision Notes</h2>
              <p className="subtitle" style={{ marginBottom: '14px' }}>
                High-yield revision notes, derivations & formula sheets.
              </p>
            </div>
          </div>

          {/* Grade Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '18px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            <button
              id="btn-notes-filter-12"
              onClick={() => setNotesFilter('12th')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: notesFilter === '12th' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: notesFilter === '12th' ? '#1261c9' : '#ffffff',
                color: notesFilter === '12th' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>⭐</span> Class 12th Notes (Physics, Chem, Maths)
            </button>
            <button
              id="btn-notes-filter-10"
              onClick={() => setNotesFilter('10th')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: notesFilter === '10th' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: notesFilter === '10th' ? '#1261c9' : '#ffffff',
                color: notesFilter === '10th' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              Class 10th Notes
            </button>
            <button
              id="btn-notes-filter-all"
              onClick={() => setNotesFilter('all')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: notesFilter === 'all' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: notesFilter === 'all' ? '#1261c9' : '#ffffff',
                color: notesFilter === 'all' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              All Notes ({REVISION_NOTES.length})
            </button>
          </div>

          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="note" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{note.icon}</span>
                  {note.grade && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '12px',
                        background: note.grade === 'Class 12th' ? '#eff6ff' : '#f1f5f9',
                        color: note.grade === 'Class 12th' ? '#1261c9' : '#475569',
                        border: note.grade === 'Class 12th' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                      }}
                    >
                      {note.grade}
                    </span>
                  )}
                </div>
                <h3>{note.subject}</h3>
                <p style={{ minHeight: '38px' }}>{note.description}</p>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>⚡ {note.formulas.length} Formulas</span>
                  <span>•</span>
                  <span>{note.chapters ? `${note.chapters.length} Chapters` : `${note.keyPoints.length} Key Points`}</span>
                </div>
                <button
                  id={`btn-view-notes-${note.id}`}
                  onClick={() => setActiveNote(note)}
                  style={{ marginTop: 'auto' }}
                >
                  View Notes
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* TESTS */}
        <section id="tests" className={`page ${currentPage === 'tests' ? 'active' : ''}`}>
          <button className="page-back-btn" onClick={() => showPage('home')}>
            ← Back to Home
          </button>
          <h2>✅ Chapter-wise Tests</h2>
          <p className="subtitle">Timed practice tests with automated scoring and analytics.</p>

          {/* Class Filter Bar */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '18px',
              overflowX: 'auto',
              paddingBottom: '4px',
            }}
          >
            <button
              id="btn-tests-filter-12"
              onClick={() => setTestsFilter('12th')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: testsFilter === '12th' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: testsFilter === '12th' ? '#1261c9' : '#ffffff',
                color: testsFilter === '12th' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🎓 Class 12th Tests
            </button>
            <button
              id="btn-tests-filter-10"
              onClick={() => setTestsFilter('10th')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: testsFilter === '10th' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: testsFilter === '10th' ? '#1261c9' : '#ffffff',
                color: testsFilter === '10th' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              🎒 Class 10th Tests
            </button>
            <button
              id="btn-tests-filter-all"
              onClick={() => setTestsFilter('all')}
              style={{
                padding: '7px 14px',
                borderRadius: '20px',
                border: testsFilter === 'all' ? '1px solid #1261c9' : '1px solid #cbd5e1',
                background: testsFilter === 'all' ? '#1261c9' : '#ffffff',
                color: testsFilter === 'all' ? '#ffffff' : '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              All Tests ({TESTS_DATA.length})
            </button>
          </div>

          {regularTests.map((test) => (
            <div key={test.id} className="test-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span className={`badge ${test.badgeClass || ''}`}>{test.subject}</span>
                  {test.grade && (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '8px',
                        background: '#eff6ff',
                        color: '#1261c9',
                        border: '1px solid #bfdbfe',
                      }}
                    >
                      {test.grade}
                    </span>
                  )}
                </div>
                <h3>{test.title}</h3>
                <p>{test.questionsCount} Questions • {test.durationMinutes} Minutes</p>
              </div>
              <button
                id={`btn-start-test-${test.id}`}
                onClick={() => handleStartTest(test.id)}
              >
                Start Test
              </button>
            </div>
          ))}
        </section>

        {/* WEEKLY */}
        <section id="weekly" className={`page ${currentPage === 'weekly' ? 'active' : ''}`}>
          <button className="page-back-btn" onClick={() => showPage('home')}>
            ← Back to Home
          </button>
          <h2>📅 Weekly Examination Portal</h2>
          <p className="subtitle">Official weekly tests for Class 10th and Class 12th.</p>

          {/* Class Switcher for Weekly Tests */}
          <div
            id="weekly-class-tabs"
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <button
              id="btn-weekly-tab-12"
              onClick={() => handleSelectClass('Class 12th')}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: selectedClass === 'Class 12th' ? '2px solid #1261c9' : '1px solid #cbd5e1',
                background: selectedClass === 'Class 12th' ? '#eff6ff' : '#ffffff',
                color: selectedClass === 'Class 12th' ? '#092b63' : '#475569',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🎓</span> Class 12th Weekly Exam
            </button>
            <button
              id="btn-weekly-tab-10"
              onClick={() => handleSelectClass('Class 10th')}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '12px',
                border: selectedClass === 'Class 10th' ? '2px solid #1261c9' : '1px solid #cbd5e1',
                background: selectedClass === 'Class 10th' ? '#eff6ff' : '#ffffff',
                color: selectedClass === 'Class 10th' ? '#092b63' : '#475569',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>🎒</span> Class 10th Weekly Exam
            </button>
          </div>

          {/* USER REGISTRATION FOR WEEKLY TEST CARD */}
          <div
            id="weekly-registration-card"
            style={{
              background: '#ffffff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '16px',
              padding: '16px 18px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(18, 97, 201, 0.08)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  ✓ VERIFIED ADMIT CARD
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Parth Academy Board
                </span>
              </div>

              <button
                id="btn-edit-registration"
                onClick={() => setIsRegisterModalOpen(true)}
                style={{
                  background: '#eff6ff',
                  border: '1px solid #93c5fd',
                  color: '#1261c9',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>✏️</span> Change Name / Details
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                background: '#f8fafc',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>STUDENT NAME</span>
                <b style={{ fontSize: '14px', color: '#092b63' }}>
                  {weeklyRegistration?.studentName || 'Not Registered'}
                </b>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>EXAM CLASS</span>
                <b style={{ fontSize: '14px', color: '#1261c9' }}>
                  {weeklyRegistration?.studentClass || selectedClass}
                </b>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>ROLL NUMBER</span>
                <code style={{ fontSize: '12px', color: '#334155' }}>
                  {weeklyRegistration?.rollNo || 'PA-2026-AUTO'}
                </code>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block' }}>EXAM TIME</span>
                <b style={{ fontSize: '13px', color: '#16a34a' }}>Sun 10:00 AM</b>
              </div>
            </div>
          </div>

          {/* Current Class Weekly Test Card */}
          <div className="weekly-box" style={{ marginBottom: '14px' }}>
            <div className="calendar">
              14<br /><small>SEP</small>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span className="badge">Upcoming Weekly</span>
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
                  {currentWeeklyTest.grade}
                </span>
              </div>
              <h3 style={{ margin: '4px 0' }}>{currentWeeklyTest.title}</h3>
              <p style={{ fontWeight: 600, color: '#1e293b' }}>
                {currentWeeklyTest.subject}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Sunday • 10:00 AM • {currentWeeklyTest.questionsCount} Questions • {currentWeeklyTest.durationMinutes} Mins
              </p>
            </div>

            <button
              id={`btn-start-weekly-${selectedClass === 'Class 12th' ? '12th' : '10th'}`}
              onClick={() => handleStartWeeklyTestClick(currentWeeklyTestId)}
              style={{
                minWidth: '100px',
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #092b63, #1261c9)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(18, 97, 201, 0.2)',
              }}
            >
              Start
            </button>
          </div>

          {/* Past Completed Weekly Test */}
          <div className="weekly-box completed">
            <div className="calendar">
              07<br /><small>SEP</small>
            </div>

            <div>
              <span className="badge gray">Completed</span>
              <h3>Weekly Test #12</h3>
              <p>Score: 84 / 100 • Candidate: {weeklyRegistration?.studentName || 'Garvit Sharma'}</p>
            </div>

            <button
              id="btn-show-weekly-12-result"
              onClick={() => {
                showPage('results');
                const prev = resultsList.find((r) => r.id === 'wt-12');
                if (prev) setActiveResultDetail(prev);
              }}
            >
              Result
            </button>
          </div>
        </section>

        {/* RESULTS */}
        <section id="results" className={`page ${currentPage === 'results' ? 'active' : ''}`}>
          <button className="page-back-btn" onClick={() => showPage('home')}>
            ← Back to Home
          </button>
          <h2>📊 Test Results & Marksheets</h2>
          <p className="subtitle">Official student test records and performance cards.</p>

          <div className="summary-box">
            <div>
              <strong>{avgScore}%</strong>
              <span>Avg Score</span>
            </div>

            <div>
              <strong>{totalTests}</strong>
              <span>Tests</span>
            </div>

            <div>
              <strong>{passedTests}</strong>
              <span>Passed</span>
            </div>
          </div>

          {resultsList.map((res) => (
            <div
              key={res.id}
              className="result-row"
              onClick={() => setActiveResultDetail(res)}
              title="Click to view detailed report"
              style={{ cursor: 'pointer' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <b>{res.title}</b>
                  {res.studentClass && (
                    <span
                      style={{
                        fontSize: '10px',
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '1px 6px',
                        borderRadius: '6px',
                      }}
                    >
                      {res.studentClass}
                    </span>
                  )}
                </div>
                <small style={{ color: '#64748b' }}>
                  {res.date} • {res.studentName || weeklyRegistration?.studentName || 'Student'}
                </small>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: res.score >= 60 ? '#16a34a' : '#dc2626' }}>
                  {res.score} / {res.total}
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>›</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav id="bottom-navigation" className="bottom-nav" aria-label="Main Navigation">
        <button
          id="nav-home"
          onClick={() => showPage('home')}
          className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
        >
          <span>🏠</span>
          Home
        </button>

        <button
          id="nav-materials"
          onClick={() => showPage('materials')}
          className={`nav-btn ${currentPage === 'materials' ? 'active' : ''}`}
        >
          <span>📚</span>
          Materials
        </button>

        <button
          id="nav-tests"
          onClick={() => showPage('tests')}
          className={`nav-btn ${currentPage === 'tests' || currentPage === 'weekly' ? 'active' : ''}`}
        >
          <span>✅</span>
          Tests
        </button>

        <button
          id="nav-results"
          onClick={() => showPage('results')}
          className={`nav-btn ${currentPage === 'results' ? 'active' : ''}`}
        >
          <span>📊</span>
          Results
        </button>
      </nav>

      {/* DESIGN CREDIT */}
      <footer id="footer-credit">
        <b>Parth Academy</b>
        <br />
        Design by Garvit Sharma
      </footer>

      {/* INTERACTIVE MODALS */}
      {isRegisterModalOpen && (
        <WeeklyRegisterModal
          initialName={weeklyRegistration?.studentName || 'Garvit Sharma'}
          initialClass={selectedClass}
          existingRegistration={weeklyRegistration}
          targetTestTitle={currentWeeklyTest.title}
          onRegister={(reg, autoStart) => handleRegisterSubmit(reg, autoStart)}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setPendingWeeklyTestId(null);
          }}
        />
      )}

      {activeTest && (
        <TestModal
          test={activeTest}
          candidateName={weeklyRegistration?.studentName}
          candidateClass={weeklyRegistration?.studentClass || selectedClass}
          candidateRollNo={weeklyRegistration?.rollNo}
          onClose={() => {
            setActiveTest(null);
            showPage('results');
          }}
          onTestComplete={(record) => {
            handleTestComplete(record);
          }}
        />
      )}

      {activeNote && (
        <NotesModal
          note={activeNote}
          onClose={() => setActiveNote(null)}
        />
      )}

      {activeMaterial && (
        <MaterialModal
          material={activeMaterial}
          onClose={() => setActiveMaterial(null)}
        />
      )}

      {activeResultDetail && (
        <ResultModal
          result={activeResultDetail}
          onClose={() => setActiveResultDetail(null)}
        />
      )}
    </div>
  );
}
