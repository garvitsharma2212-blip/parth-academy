import React from 'react';
import { VideoLecture } from '../types';
import { useApp } from '../context/AppContext';

interface VideoPlayerModalProps {
  video: VideoLecture;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const { toggleVideoWatched } = useApp();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: '720px', padding: 0 }}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', background: '#fee2e2', padding: '2px 8px', borderRadius: '6px' }}>
                YOUTUBE LECTURE
              </span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>• {video.grade}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>• {video.subject}</span>
            </div>
            <h3 style={{ margin: '4px 0 0 0', fontSize: '16px', color: '#092b63' }}>{video.title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close video player">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '0', background: '#000000' }}>
          <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div style={{ padding: '16px 20px', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: '#092b63',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                {video.instructor.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <b style={{ fontSize: '13px', color: '#0f172a', display: 'block' }}>{video.instructor}</b>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Faculty of {video.subject} • Duration: {video.duration}</span>
              </div>
            </div>

            <button
              onClick={() => toggleVideoWatched(video.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: video.isWatched ? '1.5px solid #16a34a' : '1px solid #cbd5e1',
                background: video.isWatched ? '#f0fdf4' : '#ffffff',
                color: video.isWatched ? '#15803d' : '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{video.isWatched ? '✓' : '○'}</span>
              <span>{video.isWatched ? 'Watched' : 'Mark as Watched'}</span>
            </button>
          </div>

          <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};
