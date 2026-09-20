import React, { useState } from 'react';
import { StudyMaterialItem } from '../../types';

interface InAppPdfViewerModalProps {
  material: StudyMaterialItem;
  onClose: () => void;
}

export const InAppPdfViewerModal: React.FC<InAppPdfViewerModalProps> = ({ material, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeTab, setActiveTab] = useState<'reader' | 'formulas' | 'index'>('reader');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const totalPages = material.pdfPages || 14;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 160));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 75));
  const handleResetZoom = () => setZoomLevel(100);

  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      const textContent = `PARTH ACADEMY - OFFICIAL STUDY MATERIAL\n=========================================\nTitle: ${material.title}\nSubject: ${material.subject} | Grade: ${material.grade}\nCategory: ${material.category} | File Size: ${material.fileSize}\nAdmissions Helpline: +91 97846 64518\nAddress: Near Priya School, Baran Road, Antah, Rajasthan\n\nOVERVIEW:\n${material.description}\n\nCORE HIGH-YIELD FORMULAS & CONCEPTS:\n${material.contentSnippet || 'Comprehensive classroom formulas, derivation shortcuts, and board exam model questions.'}\n\n© 2026 Parth Academy. Designed by Garvit Sharma. All rights reserved.`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${material.title.replace(/\s+/g, '_')}_ParthAcademy.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }, 600);
  };

  // Sample page contents tailored to the subject and page number
  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="pdf-page-content" style={{ padding: '24px', minHeight: '440px' }}>
            <div style={{ textAlign: 'center', borderBottom: '2px solid #092b63', paddingBottom: '16px', marginBottom: '20px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#1261c9', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Parth Academy • Antah (Rajasthan)
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#092b63', margin: '6px 0 4px 0' }}>
                {material.title}
              </h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '12px', color: '#64748b' }}>
                <span>Subject: <b>{material.subject}</b></span>
                <span>•</span>
                <span>Class: <b>{material.grade}</b></span>
                <span>•</span>
                <span>Verified: <b>CBSE 2026 Curriculum</b></span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', borderLeft: '4px solid #ffb703', padding: '14px', borderRadius: '6px', marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#092b63' }}>Module Abstract & Syllabus Weightage</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>
                {material.description}
              </p>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '14px', color: '#092b63', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>📌</span> Key Conceptual Foundations (Page 1)
              </h4>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7, background: '#ffffff', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px' }}>
                {material.contentSnippet ||
                  'Fundamental definitions, vector relations, thermodynamic laws, and state functions governing high-frequency board questions.'}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                <b style={{ color: '#1e40af', fontSize: '12px', display: 'block' }}>Board Exam Weightage</b>
                <span style={{ fontSize: '13px', color: '#1e293b' }}>8 to 12 Marks (Confirmed)</span>
              </div>
              <div style={{ background: '#fefce8', padding: '12px', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <b style={{ color: '#854d0e', fontSize: '12px', display: 'block' }}>Difficulty Level</b>
                <span style={{ fontSize: '13px', color: '#1e293b' }}>Medium to High Yield</span>
              </div>
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <b style={{ color: '#166534', fontSize: '12px', display: 'block' }}>Expected Questions</b>
                <span style={{ fontSize: '13px', color: '#1e293b' }}>2 MCQ + 1 Case Study + 1 Long</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="pdf-page-content" style={{ padding: '24px', minHeight: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#092b63' }}>CHAPTER DERIVATIONS & STEP-BY-STEP PROOFS</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>PAGE 2</span>
            </div>

            <h3 style={{ fontSize: '15px', color: '#092b63', marginBottom: '10px' }}>
              Core Formulation: {material.subject} Fundamental Equation
            </h3>

            <div style={{ background: '#092b63', color: '#ffb703', padding: '14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '16px' }}>
              {'∮ E · dA = Q_enclosed / ε₀  |  ΔG° = -nFE°_cell = -RT ln(K_eq)'}
            </div>

            <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.7 }}>
              <h4 style={{ fontSize: '13px', color: '#0f172a', margin: '0 0 6px 0' }}>Step 1: Coordinate Symmetry & Gaussian Surface</h4>
              <p style={{ margin: '0 0 12px 0' }}>
                Consider a closed cylindrical surface coaxial with the uniform charge distribution. The electric flux through curved faces equals zero due to symmetry normal to surface vectors.
              </p>

              <h4 style={{ fontSize: '13px', color: '#0f172a', margin: '0 0 6px 0' }}>Step 2: Substitution into Gauss Theorem</h4>
              <p style={{ margin: '0 0 12px 0' }}>
                Evaluating the surface integral yields: E · 2πrL = (λ · L) / ε₀, resulting in the standard radial field intensity: E = λ / (2πε₀r).
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', marginTop: '16px' }}>
              <b style={{ fontSize: '12px', color: '#92400e' }}>Teacher Tip for Antah Batch:</b>
              <p style={{ fontSize: '12px', color: '#78350f', margin: '4px 0 0 0' }}>
                Always draw the direction of the vector area dA in CBSE answer sheets. Examiners deduct 0.5 marks if normal unit vectors are missing.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="pdf-page-content" style={{ padding: '24px', minHeight: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#092b63' }}>SOLVED NUMERICALS & BOARD PYQs</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>PAGE 3</span>
            </div>

            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', marginBottom: '14px', background: '#f8fafc' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                CBSE 2024 (3 Marks)
              </span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: '8px 0' }}>
                Problem 1: Calculate the electric potential at a distance of 9 cm from a point charge of 4 × 10⁻⁷ C.
              </p>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#334155', border: '1px solid #e2e8f0' }}>
                <b>Solution:</b><br />
                V = (1 / 4πε₀) · (q / r)<br />
                = (9 × 10⁹ N m²/C²) × (4 × 10⁻⁷ C) / (0.09 m)<br />
                = <b>4 × 10⁴ Volts</b>.
              </div>
            </div>

            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', padding: '14px', background: '#f8fafc' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '2px 8px', borderRadius: '4px' }}>
                JEE Mains 2025 Foundation
              </span>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', margin: '8px 0' }}>
                Problem 2: Determine the work done in moving a test charge of 2 × 10⁻⁹ C between two equipotential surfaces.
              </p>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '6px', fontSize: '12px', color: '#334155', border: '1px solid #e2e8f0' }}>
                <b>Solution:</b><br />
                Work Done W = q · ΔV = q · (V_final - V_initial)<br />
                Since potential on equipotential surface is uniform (ΔV = 0), W = <b>0 Joules</b>.
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="pdf-page-content" style={{ padding: '24px', minHeight: '440px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#092b63' }}>
                {material.subject.toUpperCase()} NOTES • ADVANCED PRACTICE
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>PAGE {currentPage} OF {totalPages}</span>
            </div>

            <h3 style={{ fontSize: '15px', color: '#092b63', marginBottom: '12px' }}>
              Section {currentPage}: Critical Exam Formulas & Assertion-Reason Drills
            </h3>

            <ul style={{ paddingLeft: '20px', fontSize: '13px', color: '#334155', lineHeight: 1.8 }}>
              <li>Assertion: The magnetic field inside a long current-carrying solenoid is homogeneous.</li>
              <li>Reason: The field lines inside the solenoid are parallel straight lines.</li>
              <li><b>Conclusion:</b> Both Assertion and Reason are true, and Reason is the correct explanation.</li>
              <li>Standard temperature and pressure conversions must maintain 3 significant figures.</li>
              <li>Always check vector signs when resolving components along the inclined axes.</li>
            </ul>

            <div style={{ marginTop: '24px', textAlign: 'center', background: '#f1f5f9', padding: '16px', borderRadius: '8px' }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px 0' }}>
                Viewing In-App preview of official notes. To print all {totalPages} pages, use the download button below.
              </p>
              <button
                onClick={handleDownload}
                style={{
                  background: '#1261c9',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                📥 Download Full PDF ({material.fileSize})
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          maxWidth: '820px',
          width: '95%',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          background: '#0f172a',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* PDF Viewer Header Toolbar */}
        <div
          style={{
            background: '#092b63',
            color: '#ffffff',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Document metadata info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: '#ffb703',
                color: '#092b63',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              📄
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    background: 'rgba(255, 183, 3, 0.25)',
                    color: '#ffb703',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '4px',
                  }}
                >
                  IN-APP PDF READER
                </span>
                <span style={{ fontSize: '11px', color: '#93c5fd' }}>• {material.grade}</span>
                <span style={{ fontSize: '11px', color: '#93c5fd' }}>• {material.subject}</span>
              </div>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '14px', fontWeight: 700, color: '#ffffff', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {material.title}
              </h3>
            </div>
          </div>

          {/* Controls: Zoom, Pagination, and Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2px 6px' }}>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 75}
                title="Zoom Out"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', padding: '4px 6px' }}
              >
                −
              </button>
              <span
                onClick={handleResetZoom}
                title="Click to reset zoom"
                style={{ fontSize: '11px', fontWeight: 700, color: '#ffb703', padding: '0 4px', cursor: 'pointer' }}
              >
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 160}
                title="Zoom In"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', padding: '4px 6px' }}
              >
                +
              </button>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '2px 6px' }}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                title="Previous Page"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', opacity: currentPage <= 1 ? 0.4 : 1 }}
              >
                ◀
              </button>
              <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: 600, padding: '0 4px', whiteSpace: 'nowrap' }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                title="Next Page"
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '12px', padding: '4px 8px', opacity: currentPage >= totalPages ? 0.4 : 1 }}
              >
                ▶
              </button>
            </div>

            {/* Quick Download */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              style={{
                background: '#ffb703',
                color: '#092b63',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{isDownloading ? '⏳' : downloadSuccess ? '✓' : '📥'}</span>
              <span>{isDownloading ? 'Saving...' : downloadSuccess ? 'Saved!' : 'Download'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close viewer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab switcher: Digital Reader / Formula Sheet / Index */}
        <div
          style={{
            background: '#1e293b',
            padding: '6px 16px',
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('reader')}
            style={{
              background: activeTab === 'reader' ? '#092b63' : 'transparent',
              color: activeTab === 'reader' ? '#ffb703' : '#94a3b8',
              border: activeTab === 'reader' ? '1px solid #ffb703' : 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📖 Page View ({currentPage})
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            style={{
              background: activeTab === 'formulas' ? '#092b63' : 'transparent',
              color: activeTab === 'formulas' ? '#ffb703' : '#94a3b8',
              border: activeTab === 'formulas' ? '1px solid #ffb703' : 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📐 Formula Sheet & High-Yields
          </button>
          <button
            onClick={() => setActiveTab('index')}
            style={{
              background: activeTab === 'index' ? '#092b63' : 'transparent',
              color: activeTab === 'index' ? '#ffb703' : '#94a3b8',
              border: activeTab === 'index' ? '1px solid #ffb703' : 'none',
              borderRadius: '6px',
              padding: '4px 12px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            📑 Index & Chapters
          </button>
        </div>

        {/* Reader Body Canvas */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 16px',
            background: '#334155',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {activeTab === 'reader' && (
            <div
              style={{
                width: `${Math.round(620 * (zoomLevel / 100))}px`,
                maxWidth: '100%',
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                color: '#1e293b',
                position: 'relative',
                transition: 'width 0.15s ease',
              }}
            >
              {renderPageContent()}

              {/* PDF Footer page border */}
              <div
                style={{
                  borderTop: '1px solid #e2e8f0',
                  padding: '10px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px',
                  color: '#94a3b8',
                  background: '#fafafa',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
              >
                <span>Parth Academy Digital Library • Near Priya School, Antah</span>
                <span>Page {currentPage} of {totalPages}</span>
              </div>
            </div>
          )}

          {activeTab === 'formulas' && (
            <div
              style={{
                maxWidth: '680px',
                width: '100%',
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#092b63', marginTop: 0, marginBottom: '6px' }}>
                📐 {material.subject} Instant Revision & Formula Quick-Sheet
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
                Use these memory tags to rapidly review before Sunday Weekly Mock tests and board assessments.
              </p>

              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <b style={{ color: '#092b63', fontSize: '13px' }}>1. Primary Governing Equation:</b>
                  <p style={{ margin: '4px 0 0 0', fontFamily: 'monospace', fontSize: '13px', color: '#1e40af' }}>
                    {material.contentSnippet || '∮ B · dl = μ₀ (I_c + ε₀ dΦ_E / dt)  |  PV = nRT'}
                  </p>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <b style={{ color: '#092b63', fontSize: '13px' }}>2. Dimension & SI Unit Verification:</b>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#334155' }}>
                    Always substitute SI units [N, m, s, A, K, mol] before calculating ratios to prevent 10⁻³ powers of ten mismatches.
                  </p>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                  <b style={{ color: '#092b63', fontSize: '13px' }}>3. Boundary Conditions & Special Cases:</b>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#334155' }}>
                    When distance r → ∞, electric potential V → 0. In adiabatic transformations, PV^γ remains invariant.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'index' && (
            <div
              style={{
                maxWidth: '680px',
                width: '100%',
                background: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}
            >
              <h3 style={{ fontSize: '16px', color: '#092b63', marginTop: 0, marginBottom: '6px' }}>
                📑 Table of Contents & Quick Jump
              </h3>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Click any section below to directly open that page inside the reader:
              </p>

              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  { page: 1, title: 'Chapter Overview, High-Yield Scope & Board Weightage' },
                  { page: 2, title: 'Mathematical Formulations & Theorem Derivations' },
                  { page: 3, title: 'Solved PYQ Numericals & Marking Scheme Exemplars' },
                  { page: 4, title: 'Assertion-Reason Drills & Case Study Practice' },
                  { page: 5, title: 'Multi-concept Entrance Exam Applications' },
                  { page: 6, title: 'Summary Mind-map & Self-Test Checklist' },
                ].map((item) => (
                  <div
                    key={item.page}
                    onClick={() => {
                      setCurrentPage(item.page);
                      setActiveTab('reader');
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      background: currentPage === item.page ? '#eff6ff' : '#f8fafc',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                      {item.title}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9', background: '#dbeafe', padding: '3px 8px', borderRadius: '4px' }}>
                      Page {item.page} →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Floating Bar */}
        <div
          style={{
            background: '#092b63',
            color: '#ffffff',
            padding: '10px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <span style={{ color: '#93c5fd' }}>
            No download required • Read comfortably in offline-safe mode
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                opacity: currentPage <= 1 ? 0.4 : 1,
              }}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              style={{
                background: '#ffb703',
                color: '#092b63',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: currentPage >= totalPages ? 0.4 : 1,
              }}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
