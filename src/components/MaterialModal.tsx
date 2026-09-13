import React, { useState } from 'react';
import { SubjectMaterial } from '../types';

interface MaterialModalProps {
  material: SubjectMaterial;
  onClose: () => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({ material, onClose }) => {
  const [downloadingChapter, setDownloadingChapter] = useState<string | null>(null);
  const [readModalChapter, setReadModalChapter] = useState<string | null>(null);

  const handleDownload = (title: string) => {
    setDownloadingChapter(title);
    setTimeout(() => {
      setDownloadingChapter(null);
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>{material.icon}</span>
            <div>
              <h3>{material.name} Study Materials</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                {material.chapters.length} Chapters Available • {material.description}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close material modal">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {readModalChapter ? (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px' }}>
              <button
                onClick={() => setReadModalChapter(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1261c9',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ← Back to Chapters
              </button>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#092b63', marginBottom: '8px' }}>
                {readModalChapter}
              </h4>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                This chapter covers comprehensive theoretical principles, solved examples, NCERT exemplar problems, and previous board exam questions curated by Parth Academy faculty.
              </p>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '14px',
                }}
              >
                <b style={{ fontSize: '13px', color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                  🎯 Core Learning Outcomes
                </b>
                <ul style={{ fontSize: '12px', color: '#64748b', paddingLeft: '18px', lineHeight: 1.6 }}>
                  <li>Conceptual clarity with illustrative diagrammatic steps</li>
                  <li>Common mistakes and pitfall prevention tips for board examinations</li>
                  <li>15 Solved Practice Questions + 20 Self-Assessment Problems</li>
                </ul>
              </div>
              <button
                onClick={() => handleDownload(readModalChapter)}
                style={{
                  background: '#1261c9',
                  border: 'none',
                  color: '#ffffff',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>📥</span> {downloadingChapter === readModalChapter ? 'Downloading PDF...' : 'Download Full PDF Document'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {material.chapters.map((ch, idx) => {
                const isDownloading = downloadingChapter === ch.title;
                return (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      background: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>{ch.title}</h4>
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          flexShrink: 0,
                        }}
                      >
                        {ch.pdfSize}
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                      {ch.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '4px',
                        paddingTop: '8px',
                        borderTop: '1px dashed #edf2f7',
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>⏱️ {ch.readTime}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setReadModalChapter(ch.title)}
                          style={{
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            color: '#1261c9',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Read
                        </button>
                        <button
                          onClick={() => handleDownload(ch.title)}
                          style={{
                            background: '#1261c9',
                            border: 'none',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {isDownloading ? 'Saved ✓' : 'Download'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="modal-footer">
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
