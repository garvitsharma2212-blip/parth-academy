import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudentUser, StudentClass } from '../../types';

export const AdminStudents: React.FC = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useApp();
  const [filterClass, setFilterClass] = useState<StudentClass | 'All'>('All');
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [studentClass, setStudentClass] = useState<StudentClass>('Class 12th');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [parentContact, setParentContact] = useState('');
  const [rollNo, setRollNo] = useState('');

  const filtered = students.filter((s) => {
    const matchClass = filterClass === 'All' || s.studentClass === filterClass;
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    return matchClass && matchSearch;
  });

  const handleOpenAdd = () => {
    setName('');
    setEmail('');
    setPhone('');
    setParentContact('');
    setRollNo(`PA-2026-${String(students.length + 1).padStart(3, '0')}`);
    setStudentClass('Class 12th');
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (st: StudentUser) => {
    setEditingStudent(st);
    setName(st.name);
    setEmail(st.email);
    setPhone(st.phone);
    setParentContact(st.parentContact);
    setRollNo(st.rollNo);
    setStudentClass(st.studentClass);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        parentContact: parentContact.trim(),
        rollNo: rollNo.trim(),
        studentClass,
      });
    } else {
      addStudent({
        name: name.trim(),
        email: email.trim() || `${rollNo.toLowerCase()}@parthacademy.edu`,
        phone: phone.trim() || '+91 98765 00000',
        parentContact: parentContact.trim() || '+91 98765 44444',
        rollNo: rollNo.trim(),
        studentClass,
        admissionDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#092b63', margin: '0 0 4px 0' }}>Student Enrollment Roster</h1>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            Manage candidate admissions, roll numbers, class allocations, and guardian contact details.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            background: '#16a34a',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '13px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)',
          }}
        >
          <span>👤</span> Enroll New Student
        </button>
      </div>

      {/* Filter and search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['All', 'Class 12th', 'Class 10th'] as const).map((cls) => {
            const isSel = filterClass === cls;
            return (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: isSel ? '1px solid #092b63' : '1px solid #cbd5e1',
                  background: isSel ? '#092b63' : '#ffffff',
                  color: isSel ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {cls === 'All' ? 'All Classes' : cls}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, roll no, or mobile..."
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1.5px solid #cbd5e1',
            fontSize: '13px',
            width: '280px',
          }}
        />
      </div>

      {/* Students Table */}
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
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Roll No</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Candidate Name</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Class</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Contact Phone</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>Parent Mobile</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>Admission Date</th>
                <th style={{ textAlign: 'right', padding: '10px 12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <code style={{ background: '#eff6ff', color: '#1261c9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {st.rollNo}
                    </code>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <b style={{ color: '#092b63' }}>{st.name}</b>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{st.email}</div>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{st.studentClass}</td>
                  <td style={{ padding: '12px', color: '#334155' }}>{st.phone}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{st.parentContact || st.parentPhone || '-'}</td>
                  <td style={{ textAlign: 'center', padding: '12px', color: '#64748b' }}>{st.admissionDate}</td>
                  <td style={{ textAlign: 'right', padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEdit(st)}
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
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${st.name} from records?`)) {
                            deleteStudent(st.id);
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

      {/* Add / Edit Student Modal */}
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
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>ACADEMY ADMISSIONS</span>
                <h3 style={{ margin: '4px 0 0 0' }}>{editingStudent ? 'Edit Student Details' : 'Enroll New Student'}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aryan Malhotra"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Class / Batch *
                    </label>
                    <select
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value as StudentClass)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', background: '#fff' }}
                    >
                      <option value="Class 12th">Class 12th (PCM)</option>
                      <option value="Class 10th">Class 10th</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. PA-2026-006"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Mobile Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 00000"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      Parent Contact
                    </label>
                    <input
                      type="text"
                      value={parentContact}
                      onChange={(e) => setParentContact(e.target.value)}
                      placeholder="+91 98765 44444"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 3px 8px rgba(22, 163, 74, 0.25)',
                  }}
                >
                  {editingStudent ? 'Update Student Record' : 'Save & Allocate Batch'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
