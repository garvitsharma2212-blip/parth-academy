import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Announcement, StudentClass, NoticeCategory } from '../../types';

export const AdminAnnouncements: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('Exam Schedule');
  const [targetClass, setTargetClass] = useState<StudentClass | 'All'>('All');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addAnnouncement({
      title: title.trim(),
      content: content.trim(),
      category,
      targetClass,
      priority: category === 'Exam Schedule' || category === 'Emergency' ? 'high' : 'normal',
      author: 'Academic Directorate',
    });

    setTitle('');
    setContent('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Public Announcements & Notices</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Broadcast exam notifications, timetable changes, holiday circulars, and fee reminders to student portals.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: '#092b63',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 8px rgba(9, 43, 99, 0.25)',
          }}
        >
          <span>📢</span> Post Notice
        </button>
      </div>

      {/* Announcements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
        {announcements.map((anc) => (
          <div
            key={anc.id}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background:
                      anc.category === 'Exam Schedule' || anc.category === 'Exam'
                        ? '#eff6ff'
                        : anc.category === 'Holiday'
                        ? '#fef3c7'
                        : anc.category === 'Fee'
                        ? '#fee2e2'
                        : '#f1f5f9',
                    color:
                      anc.category === 'Exam Schedule' || anc.category === 'Exam'
                        ? '#1261c9'
                        : anc.category === 'Holiday'
                        ? '#b45309'
                        : anc.category === 'Fee'
                        ? '#b91c1c'
                        : '#475569',
                  }}
                >
                  {anc.category.toUpperCase()} NOTICE
                </span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{anc.date}</span>
              </div>

              <h3 style={{ fontSize: '16px', color: '#092b63', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                {anc.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                {anc.content}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '11px', color: '#64748b' }}>
                Audience: <b>{anc.targetClass || 'All Students'}</b>
              </span>
              <button
                onClick={() => {
                  if (confirm(`Delete announcement "${anc.title}"?`)) {
                    deleteAnnouncement(anc.id);
                  }
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Delete Notice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Post Notice Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            style={{ maxWidth: '480px' }}
          >
            <div className="modal-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#092b63' }}>OFFICIAL BROADCAST</span>
                <h3 style={{ margin: '4px 0 0 0' }}>Post Announcement</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. CBSE Practical Exam Schedule Announced"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="Exam Schedule">Exam Schedule</option>
                      <option value="Important">Important Notice</option>
                      <option value="Holiday">Holiday Notification</option>
                      <option value="Fee">Fee Reminder</option>
                      <option value="Emergency">Emergency Alert</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Target Audience *
                    </label>
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value as any)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="All">All Students</option>
                      <option value="Class 12th">Class 12th Only</option>
                      <option value="Class 10th">Class 10th Only</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Notice Body Content *
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the full text of the announcement..."
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#092b63',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(9, 43, 99, 0.25)',
                  }}
                >
                  Broadcast Notice Instantly
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
