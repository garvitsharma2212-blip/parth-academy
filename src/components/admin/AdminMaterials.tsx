import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyMaterialItem, StudentClass, MaterialCategory } from '../../types';
import { MaterialViewerModal } from '../MaterialViewerModal';

export const AdminMaterials: React.FC = () => {
  const { materials, addMaterial, uploadMaterialWithPdf, deleteMaterial } = useApp();
  const [selectedGrade, setSelectedGrade] = useState<StudentClass | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterialItem | null>(null);

  // New material form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState<StudentClass>('Class 12th');
  const [category, setCategory] = useState<MaterialCategory>('Notes');
  const [fileSize, setFileSize] = useState('3.8 MB');
  const [pdfPages, setPdfPages] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [contentSnippet, setContentSnippet] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const filtered = materials.filter((m) => {
    return selectedGrade === 'All' || m.grade === selectedGrade;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${mb} MB`);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsUploading(true);
    try {
      if (selectedFile) {
        await uploadMaterialWithPdf(selectedFile, {
          title: title.trim(),
          subject,
          grade,
          category,
          description: description.trim(),
          contentSnippet: contentSnippet.trim() || 'Comprehensive revision formulas and theory notes.',
          pdfPages: Number(pdfPages) || 16,
        });
      } else {
        await addMaterial({
          title: title.trim(),
          subject,
          grade,
          category,
          fileSize: fileSize.trim() || '3.5 MB',
          pdfPages: Number(pdfPages) || 16,
          description: description.trim(),
          contentSnippet: contentSnippet.trim() || 'Formulas and theoretical principles for exam preparation.',
        });
      }

      // Reset
      setTitle('');
      setDescription('');
      setContentSnippet('');
      setSelectedFile(null);
      setIsAddModalOpen(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Study Material Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Upload, organize, categorize, and publish PDF Notes, Assignments, Question Banks, and Model Papers.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: '#1261c9',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 8px rgba(18, 97, 201, 0.25)',
          }}
        >
          <span>📤</span> Upload Study Material
        </button>
      </div>

      {/* Class Switcher Filter */}
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

      {/* Materials Table */}
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
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Material Title</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Class</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Subject</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Category</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Size / Pages</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Upload Date</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((mat) => (
                <tr key={mat.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <b style={{ color: '#092b63' }}>{mat.title}</b>
                      {mat.downloadUrl && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            border: '1px solid #bbf7d0',
                          }}
                          title="Hosted in Firebase Cloud Storage"
                        >
                          ☁️ Storage PDF
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{mat.description.slice(0, 75)}...</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{mat.grade}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#475569' }}>{mat.subject}</td>
                  <td style={{ padding: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        background: '#eff6ff',
                        color: '#1261c9',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {mat.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#64748b' }}>
                    {mat.fileSize} ({mat.pdfPages || 18}p)
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#94a3b8' }}>
                    {mat.uploadDate}
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {mat.downloadUrl && (
                        <a
                          href={mat.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={mat.fileName || `${mat.title}.pdf`}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            color: '#15803d',
                            fontSize: '11px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <span>📥</span> PDF
                        </a>
                      )}
                      <button
                        onClick={() => setPreviewMaterial(mat)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          background: '#eff6ff',
                          border: '1px solid #bfdbfe',
                          color: '#1261c9',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${mat.title}"?`)) {
                            deleteMaterial(mat.id);
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

      {/* Upload Material Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '520px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9' }}>PARTH ACADEMY REPOSITORY</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Upload New Study Material</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreate}>
                {/* PDF File Picker for Firebase Storage */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Attach PDF Note / Worksheet (Firebase Storage)
                  </label>
                  <div
                    style={{
                      border: selectedFile ? '2px solid #16a34a' : '2px dashed #cbd5e1',
                      borderRadius: '10px',
                      padding: '14px',
                      textAlign: 'center',
                      background: selectedFile ? '#f0fdf4' : '#f8fafc',
                      cursor: 'pointer',
                    }}
                    onClick={() => document.getElementById('pdf-file-input')?.click()}
                  >
                    <input
                      id="pdf-file-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    {selectedFile ? (
                      <div>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>📄</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#15803d' }}>
                          {selectedFile.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#166534' }}>
                          Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload to Firebase Storage
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>☁️</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#092b63' }}>
                          Click to select a PDF Note or drop file here
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Supports syllabus PDFs, formula books, handwritten scans up to 50MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Electromagnetic Induction Formula Handbook"
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
                      placeholder="e.g. Physics, Chemistry, Maths"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="Notes">Notes</option>
                      <option value="Assignment">Assignment</option>
                      <option value="Question Bank">Question Bank</option>
                      <option value="Sample Paper">Sample Paper</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      PDF Pages / Est. Size
                    </label>
                    <input
                      type="text"
                      value={fileSize}
                      onChange={(e) => setFileSize(e.target.value)}
                      placeholder="e.g. 4.2 MB"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Document Description *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of chapters, syllabus topics, and derivations covered..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Key Formulas / Snippet Preview
                  </label>
                  <input
                    type="text"
                    value={contentSnippet}
                    onChange={(e) => setContentSnippet(e.target.value)}
                    placeholder="Key concepts or formula highlight displayed to students"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUploading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: isUploading ? '#94a3b8' : '#1261c9',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    boxShadow: isUploading ? 'none' : '0 3px 8px rgba(18, 97, 201, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {isUploading ? (
                    <>
                      <span>⏳</span> Uploading PDF to Firebase Storage...
                    </>
                  ) : (
                    <>
                      <span>☁️</span> Publish Material to Firebase
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document viewer preview */}
      {previewMaterial && (
        <MaterialViewerModal material={previewMaterial} onClose={() => setPreviewMaterial(null)} />
      )}
    </div>
  );
};
