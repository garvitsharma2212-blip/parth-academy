import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoLecture, StudentClass } from '../../types';
import { VideoPlayerModal } from '../VideoPlayerModal';

export const AdminVideos: React.FC = () => {
  const { videos, addVideo, deleteVideo } = useApp();
  const [selectedGrade, setSelectedGrade] = useState<StudentClass | 'All'>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoLecture | null>(null);

  // New video form
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [grade, setGrade] = useState<StudentClass>('Class 12th');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [instructor, setInstructor] = useState('Er. Parth Sharma');
  const [duration, setDuration] = useState('45:00');
  const [description, setDescription] = useState('');

  const filtered = videos.filter((v) => {
    return selectedGrade === 'All' || v.grade === selectedGrade;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeUrl.trim()) return;

    // extract videoId
    const match = youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const videoId = match ? match[1] : 'kYv_8k0zKvg';

    addVideo({
      title: title.trim(),
      subject: subject.trim(),
      grade,
      youtubeUrl: youtubeUrl.trim(),
      videoId,
      duration: duration.trim() || '45:00',
      instructor: instructor.trim() || 'Faculty Member',
      description: description.trim() || 'Comprehensive recorded conceptual lecture.',
    });

    setTitle('');
    setYoutubeUrl('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Video Lecture Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Embed YouTube lecture links, assign faculty instructors, categorize by class and syllabus topics.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: '#dc2626',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 8px rgba(220, 38, 38, 0.25)',
          }}
        >
          <span>🎬</span> Add YouTube Lecture
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

      {/* Video Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {filtered.map((vid) => (
          <div
            key={vid.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Thumbnail */}
              <div
                onClick={() => setPreviewVideo(vid)}
                style={{
                  position: 'relative',
                  paddingBottom: '56.25%',
                  background: '#092b63',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={`https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.8)',
                    color: '#fff',
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  ⏱️ {vid.duration}
                </span>
              </div>

              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                    {vid.grade} • {vid.subject}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{vid.uploadDate}</span>
                </div>

                <h3 style={{ fontSize: '14px', color: '#092b63', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                  {vid.title}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  {vid.description}
                </p>
                <div style={{ fontSize: '11px', color: '#475569' }}>
                  Faculty: <b>{vid.instructor}</b>
                </div>
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => setPreviewVideo(vid)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1261c9',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Preview Play
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete lecture "${vid.title}"?`)) {
                    deleteVideo(vid.id);
                  }
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Video Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '500px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626' }}>LECTURE UPLOAD</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Add YouTube Video Class</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                  <small style={{ fontSize: '11px', color: '#64748b' }}>
                    Supports youtube.com/watch?v= and youtu.be/ links.
                  </small>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Lecture Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Electromagnetic Induction: Faraday's & Lenz's Law"
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      placeholder="e.g. Er. Parth Sharma"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Duration (MM:SS)
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 48:20"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Lecture Synopsis
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of chapter concepts explained..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(220, 38, 38, 0.25)',
                  }}
                >
                  Publish Video Lecture
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {previewVideo && (
        <VideoPlayerModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
      )}
    </div>
  );
};
