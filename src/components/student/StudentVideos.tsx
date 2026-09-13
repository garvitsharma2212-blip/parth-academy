import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoLecture } from '../../types';
import { VideoPlayerModal } from '../VideoPlayerModal';

export const StudentVideos: React.FC = () => {
  const { videos, selectedClass, toggleVideoWatched } = useApp();
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);

  const classVideos = videos.filter((v) => v.grade === selectedClass);
  const subjects = ['All', ...Array.from(new Set(classVideos.map((v) => v.subject)))];

  const filtered = classVideos.filter((v) => {
    return activeSubject === 'All' || v.subject === activeSubject;
  });

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              background: '#dc2626',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            YOUTUBE VIDEO VAULT
          </span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedClass} Video Lectures</span>
        </div>
        <h1 style={{ fontSize: '24px', color: '#092b63', margin: '4px 0' }}>Recorded Video Classes & Concepts</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
          Watch interactive video lectures by expert faculty, complete with numerical shortcuts and derivation breakdowns.
        </p>
      </div>

      {/* Subject Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {subjects.map((sub) => {
          const isActive = activeSubject === sub;
          return (
            <button
              key={sub}
              onClick={() => setActiveSubject(sub)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: isActive ? '1.5px solid #1261c9' : '1px solid #cbd5e1',
                background: isActive ? '#eff6ff' : '#ffffff',
                color: isActive ? '#1261c9' : '#475569',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Video Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎬</div>
          <h3 style={{ fontSize: '16px', color: '#092b63', margin: '0 0 6px 0' }}>No video lectures available in this category</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Check back later as new faculty classes are uploaded daily.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((vid) => (
            <div
              key={vid.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Video thumbnail with play trigger */}
                <div
                  onClick={() => setSelectedVideo(vid)}
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    background: '#092b63',
                    cursor: 'pointer',
                    overflow: 'hidden',
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
                      opacity: 0.9,
                    }}
                  />
                  {/* Play button overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'rgba(220, 38, 38, 0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '22px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    }}
                  >
                    ▶
                  </div>
                  {/* Duration badge */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(0,0,0,0.8)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    ⏱️ {vid.duration}
                  </span>
                  {/* Watched tag */}
                  {vid.isWatched && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: '#16a34a',
                        color: '#ffffff',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      ✓ WATCHED
                    </span>
                  )}
                </div>

                {/* Card details */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#1261c9', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                      {vid.subject}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{vid.uploadDate}</span>
                  </div>

                  <h3
                    onClick={() => setSelectedVideo(vid)}
                    style={{
                      fontSize: '15px',
                      color: '#092b63',
                      margin: '0 0 8px 0',
                      cursor: 'pointer',
                      lineHeight: 1.35,
                    }}
                  >
                    {vid.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                    {vid.description}
                  </p>

                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Instructor: <b>{vid.instructor}</b>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f5f9', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => toggleVideoWatched(vid.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: vid.isWatched ? '#16a34a' : '#64748b',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{vid.isWatched ? '✓' : '○'}</span>
                  <span>{vid.isWatched ? 'Watched' : 'Mark Watched'}</span>
                </button>

                <button
                  onClick={() => setSelectedVideo(vid)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: '#1261c9',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Play Lecture ▶
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedVideo && (
        <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
};
