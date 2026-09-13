import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyMaterialItem, MaterialCategory } from '../../types';
import { MaterialViewerModal } from '../MaterialViewerModal';

export const StudentMaterials: React.FC = () => {
  const { materials, selectedClass } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterialItem | null>(null);

  // Filter materials for current class
  const classMaterials = materials.filter((m) => m.grade === selectedClass);

  // Get distinct subjects for this class
  const availableSubjects = ['All', ...Array.from(new Set(classMaterials.map((m) => m.subject)))];
  const categories: string[] = ['All', 'Notes', 'Assignment', 'Question Bank', 'Sample Paper'];

  // Filtered result
  const filtered = classMaterials.filter((item) => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSub = activeSubject === 'All' || item.subject === activeSubject;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSub && matchSearch;
  });

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Scope */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#092b63',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            {selectedClass.toUpperCase()}
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Curriculum Resource Center</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Study Materials & PDF Vault</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Access comprehensive lecture notes, question banks, weekly assignments, and official CBSE model sample papers.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, formula, or chapter name (e.g., Gauss Law, Raoult, Calculus)..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '16px', color: '#94a3b8' }}>
            🔍
          </span>
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginRight: '4px' }}>Category:</span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  border: isActive ? '1.5px solid #1261c9' : '1px solid #cbd5e1',
                  background: isActive ? '#eff6ff' : '#ffffff',
                  color: isActive ? '#1261c9' : '#475569',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Subjects Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginRight: '4px' }}>Subject:</span>
          {availableSubjects.map((sub) => {
            const isActive = activeSubject === sub;
            return (
              <button
                key={sub}
                onClick={() => setActiveSubject(sub)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: isActive ? '1px solid #092b63' : '1px solid #e2e8f0',
                  background: isActive ? '#092b63' : '#f8fafc',
                  color: isActive ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {sub}
              </button>
            );
          })}
        </div>
      </div>

      {/* Materials Grid */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📂</div>
          <h3 style={{ fontSize: '16px', color: '#092b63', margin: '0 0 6px 0' }}>No materials match your filter</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Try resetting your search query or selecting "All" categories.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {filtered.map((mat) => (
            <div
              key={mat.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: '#eff6ff',
                      color: '#1261c9',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #bfdbfe',
                    }}
                  >
                    {mat.category.toUpperCase()}
                  </span>
                  {mat.downloadUrl && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      ☁️ STORAGE PDF
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {mat.uploadDate}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', color: '#092b63', margin: '0 0 8px 0', lineHeight: 1.3 }}>
                  {mat.title}
                </h3>

                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                  {mat.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: '#64748b',
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginBottom: '16px',
                  }}
                >
                  <span>Subject: <b>{mat.subject}</b></span>
                  <span>•</span>
                  <span>Size: <b>{mat.fileSize}</b></span>
                  <span>•</span>
                  <span>PDF ({mat.pdfPages || 18}p)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setSelectedMaterial(mat)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#1261c9',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>📖</span> Read Online
                </button>
                {mat.downloadUrl ? (
                  <a
                    href={mat.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={mat.fileName || `${mat.title}.pdf`}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #16a34a',
                      background: '#f0fdf4',
                      color: '#15803d',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Download original PDF from Firebase Storage"
                  >
                    📥 Download
                  </a>
                ) : (
                  <button
                    onClick={() => setSelectedMaterial(mat)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                    title="Download document"
                  >
                    📥 Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMaterial && (
        <MaterialViewerModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
};
