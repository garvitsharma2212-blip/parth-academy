import React, { useState, useMemo } from 'react';
import { NoteItem } from '../types';

interface NotesModalProps {
  note: NoteItem;
  onClose: () => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ note, onClose }) => {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleCopy = (formulaText: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(formulaText);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  // Determine current keypoints and formulas based on selected chapter
  const displayedData = useMemo(() => {
    if (activeChapterIndex === 'all' || !note.chapters || !note.chapters[activeChapterIndex]) {
      return {
        title: 'Complete Syllabus Overview',
        keyPoints: note.keyPoints,
        formulas: note.formulas,
      };
    }
    const ch = note.chapters[activeChapterIndex];
    return {
      title: ch.title,
      keyPoints: ch.keyPoints,
      formulas: ch.formulas,
    };
  }, [note, activeChapterIndex]);

  // Filter based on search term
  const filteredKeyPoints = useMemo(() => {
    if (!searchTerm.trim()) return displayedData.keyPoints;
    const term = searchTerm.toLowerCase();
    return displayedData.keyPoints.filter((pt) => pt.toLowerCase().includes(term));
  }, [displayedData.keyPoints, searchTerm]);

  const filteredFormulas = useMemo(() => {
    if (!searchTerm.trim()) return displayedData.formulas;
    const term = searchTerm.toLowerCase();
    return displayedData.formulas.filter(
      (f) => f.name.toLowerCase().includes(term) || f.formula.toLowerCase().includes(term)
    );
  }, [displayedData.formulas, searchTerm]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '640px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>{note.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0 }}>{note.subject}</h3>
                {note.grade && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: '#eff6ff',
                      color: '#1261c9',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    {note.grade}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0' }}>{note.description}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close notes modal">
            ✕
          </button>
        </div>

        {/* Chapter Selection Bar (if chapters exist) */}
        {note.chapters && note.chapters.length > 0 && (
          <div
            style={{
              padding: '10px 18px',
              background: '#f8fafc',
              borderBottom: '1px solid #edf2f7',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <button
              onClick={() => setActiveChapterIndex('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeChapterIndex === 'all' ? '#1261c9' : '#e2e8f0',
                color: activeChapterIndex === 'all' ? '#ffffff' : '#334155',
                transition: 'all 0.15s ease',
              }}
            >
              All Topics ({note.keyPoints.length})
            </button>
            {note.chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => setActiveChapterIndex(idx)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: activeChapterIndex === idx ? '#1261c9' : '#e2e8f0',
                  color: activeChapterIndex === idx ? '#ffffff' : '#334155',
                  transition: 'all 0.15s ease',
                }}
              >
                {ch.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        )}

        {/* Search Bar */}
        <div style={{ padding: '12px 18px 0', display: 'flex', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#f1f5f9',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '100%',
            }}
          >
            <span style={{ marginRight: '8px', fontSize: '13px' }}>🔍</span>
            <input
              type="text"
              placeholder="Search concepts, laws, or formulas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '12px',
                color: '#1e293b',
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: '#64748b',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '14px 18px' }}>
          {/* Active section title */}
          {activeChapterIndex !== 'all' && (
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#1261c9',
                marginBottom: '12px',
                paddingBottom: '6px',
                borderBottom: '1px dashed #cbd5e1',
              }}
            >
              📖 {displayedData.title}
            </div>
          )}

          {/* Key Concepts */}
          <div style={{ marginBottom: '22px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e293b',
                }}
              >
                <span>📌</span> Key Concepts & Important Points
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                {filteredKeyPoints.length} items
              </span>
            </div>

            {filteredKeyPoints.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: '6px 0' }}>
                No matching concepts found for "{searchTerm}".
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredKeyPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: '#f8fafc',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #edf2f7',
                    }}
                  >
                    <span style={{ color: '#1261c9', fontWeight: 800, fontSize: '14px', marginTop: '1px' }}>
                      •
                    </span>
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.45 }}>{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formula Sheet */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#1e293b',
                }}
              >
                <span>⚡</span> Formula Sheet & Important Equations
              </div>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Click card to copy</span>
            </div>

            {filteredFormulas.length === 0 ? (
              <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: '6px 0' }}>
                No matching formulas found for "{searchTerm}".
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredFormulas.map((f, idx) => {
                  const isCopied = copiedFormula === f.formula;
                  return (
                    <div
                      key={idx}
                      onClick={() => handleCopy(f.formula)}
                      title="Click to copy formula"
                      style={{
                        background: isCopied ? '#f0fdf4' : '#ffffff',
                        border: isCopied ? '1px solid #86efac' : '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: '#64748b',
                            letterSpacing: '0.4px',
                            display: 'block',
                            marginBottom: '4px',
                          }}
                        >
                          {f.name}
                        </span>
                        <code
                          style={{
                            fontSize: '13px',
                            color: '#092b63',
                            fontWeight: 600,
                            fontFamily: 'monospace',
                            display: 'block',
                            overflowWrap: 'break-word',
                          }}
                        >
                          {f.formula}
                        </code>
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: isCopied ? '#16a34a' : '#1261c9',
                          background: isCopied ? '#dcfce7' : '#eff6ff',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          flexShrink: 0,
                        }}
                      >
                        {isCopied ? 'Copied ✓' : 'Copy'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Parth Academy • High Yield Revision
          </span>
          <button
            onClick={onClose}
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
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
};
