import React, { useState } from 'react';
import { StudyMaterialItem } from '../types';

interface MaterialViewerModalProps {
  material: StudyMaterialItem;
  onClose: () => void;
}

export const MaterialViewerModal: React.FC<MaterialViewerModalProps> = ({ material, onClose }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      // create a mock blob file download for true interactivity
      const blob = new Blob(
        [
          `PARTH ACADEMY - OFFICIAL STUDY MATERIAL\n\nTitle: ${material.title}\nSubject: ${material.subject}\nClass: ${material.grade}\nCategory: ${material.category}\nUpload Date: ${material.uploadDate}\n\nSummary:\n${material.description}\n\nKey Concepts & Formulas:\n${material.contentSnippet || 'Refer to classroom syllabus and coaching lecture notes for step-by-step problem proofs.'}\n\n---\nParth Academy, All rights reserved.`,
        ],
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material.title.replace(/\s+/g, '_')}_ParthAcademy.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '620px', padding: 0 }}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#eff6ff',
                color: '#1261c9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
              }}
            >
              📄
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9', background: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>
                  {material.category.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>• {material.grade}</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>• {material.subject}</span>
              </div>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#092b63' }}>{material.title}</h3>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close document viewer">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px', maxHeight: '65vh', overflowY: 'auto' }}>
          {/* Metadata bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>FILE SIZE</span>
              <b>{material.fileSize}</b>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>PAGES</span>
              <b>{material.pdfPages || 18} Pages (PDF)</b>
            </div>
            <div>
              <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>PUBLISHED ON</span>
              <b>{material.uploadDate}</b>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ fontSize: '13px', color: '#1e293b', marginBottom: '6px' }}>Overview & Scope:</h4>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
              {material.description}
            </p>
          </div>

          {/* Simulated PDF Preview Container */}
          <div
            style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              padding: '18px',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.5px' }}>
                PARTH ACADEMY DIGITAL READER (PAGE 1 OF {material.pdfPages || 18})
              </span>
              <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                Verified Verified
              </span>
            </div>

            <div style={{ background: '#fdfdfe', padding: '16px', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
              <h5 style={{ fontSize: '14px', color: '#092b63', marginTop: 0, marginBottom: '8px' }}>
                {material.subject}: High-Yield Core Concept Formulations
              </h5>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, fontFamily: 'monospace', background: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
                {material.contentSnippet ||
                  'Raoult Law, Electric flux derivation, Gauss integral, Standard chemical reactions, and high-frequency examination proofs.'}
              </p>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', fontStyle: 'italic' }}>
                Tip: Use the button below to download the complete {material.fileSize} printable document with full illustrations and solved numericals.
              </p>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {downloaded ? '✓ Download complete' : 'Free for enrolled Parth Academy students'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#1261c9',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{downloading ? '⏳' : '📥'}</span>
              <span>{downloading ? 'Preparing Download...' : downloaded ? 'Download Again' : 'Download Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
