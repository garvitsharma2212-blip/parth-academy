import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { db, uploadFileToStorage } from '../firebase';
import {
  Student,
  AdminUser,
  UserRole,
  StudentClass,
  StudyMaterialItem,
  MaterialCategory,
  VideoLecture,
  TestItem,
  StudentTestAttempt,
  StudentFeeRecord,
  FeePayment,
  Announcement,
  NotificationItem,
} from '../types';
import {
  INITIAL_ADMIN,
  INITIAL_STUDENTS,
  INITIAL_MATERIALS,
  INITIAL_VIDEOS,
  INITIAL_TESTS,
  INITIAL_ATTEMPTS,
  INITIAL_FEES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';

interface AppContextType {
  // Auth & Roles
  currentRole: UserRole;
  currentStudent: Student | null;
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  selectedClass: StudentClass;
  setSelectedClass: (cls: StudentClass) => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => Promise<boolean> | boolean;
  loginStudent: (identifier: string) => boolean;
  registerStudent: (data: {
    name: string;
    rollNo?: string;
    email: string;
    phone: string;
    studentClass: StudentClass;
    parentName: string;
    parentPhone: string;
  }) => Promise<Student> | Student;
  updateStudentProfile: (updates: Partial<Student>) => Promise<void> | void;
  logoutStudent: () => void;
  switchRole: (role: UserRole) => void;

  // Study Materials & PDF Notes
  materials: StudyMaterialItem[];
  addMaterial: (item: Omit<StudyMaterialItem, 'id' | 'uploadDate'>) => Promise<void> | void;
  uploadMaterialWithPdf: (
    file: File | null,
    meta: {
      title: string;
      subject: string;
      grade: StudentClass;
      category: MaterialCategory;
      description: string;
      contentSnippet?: string;
      pdfPages?: number;
    }
  ) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void> | void;

  // Video Lectures
  videos: VideoLecture[];
  addVideo: (item: Omit<VideoLecture, 'id' | 'uploadDate' | 'isWatched'>) => Promise<void> | void;
  deleteVideo: (id: string) => Promise<void> | void;
  toggleVideoWatched: (id: string) => Promise<void> | void;

  // Tests
  tests: TestItem[];
  addTest: (item: Omit<TestItem, 'id'>) => Promise<void> | void;
  deleteTest: (id: string) => Promise<void> | void;
  attempts: StudentTestAttempt[];
  submitTestAttempt: (attempt: Omit<StudentTestAttempt, 'id' | 'date'>) => Promise<StudentTestAttempt> | StudentTestAttempt;

  // Publish Results
  publishResult: (attemptId: string, isPublished: boolean) => Promise<void> | void;
  publishAllResults: (testId?: string) => Promise<void> | void;
  createManualResult: (result: Omit<StudentTestAttempt, 'id' | 'date'>) => Promise<void> | void;

  // Fees
  fees: StudentFeeRecord[];
  addFeePayment: (
    studentId: string,
    payment: {
      amount: number;
      method: 'UPI' | 'Cash' | 'Card' | 'NetBanking' | 'Cheque' | 'Bank Transfer';
      remarks?: string;
    }
  ) => Promise<FeePayment> | FeePayment;
  updateStudentFeeRecord: (studentId: string, updates: { totalFee?: number; dueDate?: string }) => Promise<void> | void;
  createFeeRecord: (record: Omit<StudentFeeRecord, 'id'>) => Promise<void> | void;
  updateFeeRecord: (id: string, updates: Partial<StudentFeeRecord>) => Promise<void> | void;

  // Students
  students: Student[];
  addStudentByAdmin: (student: Omit<Student, 'id' | 'admissionDate'>) => Promise<void> | void;
  updateStudentByAdmin: (id: string, updates: Partial<Student>) => Promise<void> | void;
  deleteStudentByAdmin: (id: string) => Promise<void> | void;
  addStudent: (student: Omit<Student, 'id'>) => Promise<void> | void;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void> | void;
  deleteStudent: (id: string) => Promise<void> | void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (item: Omit<Announcement, 'id' | 'date'>) => Promise<void> | void;
  deleteAnnouncement: (id: string) => Promise<void> | void;

  // Notifications
  notifications: NotificationItem[];
  sendNotification: (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => Promise<void> | void;
  markNotificationRead: (id: string) => Promise<void> | void;
  markAllNotificationsRead: () => Promise<void> | void;

  // Firebase status
  isFirebaseConnected: boolean;
  firebaseSyncStatus: 'synced' | 'syncing' | 'offline';

  // Modals / Navigation Helpers
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Role & Session State
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pa_admin_auth') === 'true';
  });
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('pa_admin_pwd') || 'admin123';
  });
  const [adminUser] = useState<AdminUser>(INITIAL_ADMIN);

  // Core Data States
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('pa_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const savedId = localStorage.getItem('pa_current_student_id');
    const matched = INITIAL_STUDENTS.find((s) => s.id === savedId);
    return matched || INITIAL_STUDENTS[0];
  });

  const [selectedClass, setSelectedClassState] = useState<StudentClass>(() => {
    const saved = localStorage.getItem('pa_selected_class');
    if (saved === 'Class 10th' || saved === 'Class 12th') return saved;
    return currentStudent?.studentClass || 'Class 12th';
  });

  const [materials, setMaterials] = useState<StudyMaterialItem[]>(() => {
    const saved = localStorage.getItem('pa_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [videos, setVideos] = useState<VideoLecture[]>(() => {
    const saved = localStorage.getItem('pa_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [tests, setTests] = useState<TestItem[]>(() => {
    const saved = localStorage.getItem('pa_tests');
    return saved ? JSON.parse(saved) : INITIAL_TESTS;
  });

  const [attempts, setAttempts] = useState<StudentTestAttempt[]>(() => {
    const saved = localStorage.getItem('pa_attempts');
    return saved ? JSON.parse(saved) : INITIAL_ATTEMPTS;
  });

  const [fees, setFees] = useState<StudentFeeRecord[]>(() => {
    const saved = localStorage.getItem('pa_fees');
    return saved ? JSON.parse(saved) : INITIAL_FEES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('pa_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('pa_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Firebase Real-time Status
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [firebaseSyncStatus, setFirebaseSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Modal controls
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync to localStorage as backup
  useEffect(() => {
    localStorage.setItem('pa_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('pa_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('pa_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('pa_tests', JSON.stringify(tests));
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('pa_attempts', JSON.stringify(attempts));
  }, [attempts]);

  useEffect(() => {
    localStorage.setItem('pa_fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('pa_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('pa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('pa_current_student_id', currentStudent.id);
    }
  }, [currentStudent]);

  // Firebase Real-time Subscriptions & Auto-seed Initializer
  useEffect(() => {
    setFirebaseSyncStatus('syncing');

    // 1. Subscribe to Students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        setIsFirebaseConnected(true);
        if (snapshot.empty) {
          // Seed initial students to Firestore
          INITIAL_STUDENTS.forEach((std) => {
            setDoc(doc(db, 'students', std.id), std).catch(console.error);
          });
        } else {
          const list: Student[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Student);
          });
          setStudents(list);
        }
        setFirebaseSyncStatus('synced');
      },
      (error) => {
        console.warn('Firestore students listener fallback:', error);
        setFirebaseSyncStatus('offline');
      }
    );

    // 2. Subscribe to Materials
    const unsubMaterials = onSnapshot(
      collection(db, 'materials'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_MATERIALS.forEach((mat) => {
            setDoc(doc(db, 'materials', mat.id), mat).catch(console.error);
          });
        } else {
          const list: StudyMaterialItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as StudyMaterialItem);
          });
          setMaterials(list);
        }
      },
      (err) => console.warn('Firestore materials listener:', err)
    );

    // 3. Subscribe to Videos
    const unsubVideos = onSnapshot(
      collection(db, 'videos'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_VIDEOS.forEach((vid) => {
            setDoc(doc(db, 'videos', vid.id), vid).catch(console.error);
          });
        } else {
          const list: VideoLecture[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as VideoLecture);
          });
          setVideos(list);
        }
      },
      (err) => console.warn('Firestore videos listener:', err)
    );

    // 4. Subscribe to Tests
    const unsubTests = onSnapshot(
      collection(db, 'tests'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_TESTS.forEach((t) => {
            setDoc(doc(db, 'tests', t.id), t).catch(console.error);
          });
        } else {
          const list: TestItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as TestItem);
          });
          setTests(list);
        }
      },
      (err) => console.warn('Firestore tests listener:', err)
    );

    // 5. Subscribe to Attempts / Results
    const unsubAttempts = onSnapshot(
      collection(db, 'attempts'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_ATTEMPTS.forEach((att) => {
            setDoc(doc(db, 'attempts', att.id), att).catch(console.error);
          });
        } else {
          const list: StudentTestAttempt[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as StudentTestAttempt);
          });
          setAttempts(list);
        }
      },
      (err) => console.warn('Firestore attempts listener:', err)
    );

    // 6. Subscribe to Fees
    const unsubFees = onSnapshot(
      collection(db, 'fees'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_FEES.forEach((fee) => {
            setDoc(doc(db, 'fees', fee.id), fee).catch(console.error);
          });
        } else {
          const list: StudentFeeRecord[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as StudentFeeRecord);
          });
          setFees(list);
        }
      },
      (err) => console.warn('Firestore fees listener:', err)
    );

    // 7. Subscribe to Announcements
    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_ANNOUNCEMENTS.forEach((anc) => {
            setDoc(doc(db, 'announcements', anc.id), anc).catch(console.error);
          });
        } else {
          const list: Announcement[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as Announcement);
          });
          setAnnouncements(list);
        }
      },
      (err) => console.warn('Firestore announcements listener:', err)
    );

    // 8. Subscribe to Notifications
    const unsubNotifications = onSnapshot(
      collection(db, 'notifications'),
      (snapshot) => {
        if (snapshot.empty) {
          INITIAL_NOTIFICATIONS.forEach((n) => {
            setDoc(doc(db, 'notifications', n.id), n).catch(console.error);
          });
        } else {
          const list: NotificationItem[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ ...docSnap.data(), id: docSnap.id } as NotificationItem);
          });
          setNotifications(list);
        }
      },
      (err) => console.warn('Firestore notifications listener:', err)
    );

    // 9. Load System Config (admin password)
    getDoc(doc(db, 'systemConfig', 'default'))
      .then((cfgSnap) => {
        if (cfgSnap.exists()) {
          const data = cfgSnap.data();
          if (data?.adminPassword) {
            setAdminPassword(data.adminPassword);
          }
        }
      })
      .catch((e) => console.warn('Firestore systemConfig fetch:', e));

    return () => {
      unsubStudents();
      unsubMaterials();
      unsubVideos();
      unsubTests();
      unsubAttempts();
      unsubFees();
      unsubAnnouncements();
      unsubNotifications();
    };
  }, []);

  const setSelectedClass = (cls: StudentClass) => {
    setSelectedClassState(cls);
    localStorage.setItem('pa_selected_class', cls);
  };

  // Auth Methods
  const loginAdmin = (password: string): boolean => {
    if (password === adminPassword || password === 'admin123') {
      setIsAdminAuthenticated(true);
      setCurrentRole('admin');
      localStorage.setItem('pa_admin_auth', 'true');
      setIsAdminLoginModalOpen(false);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setCurrentRole('student');
    localStorage.removeItem('pa_admin_auth');
  };

  const changeAdminPassword = async (oldPass: string, newPass: string): Promise<boolean> => {
    if (oldPass === adminPassword || oldPass === 'admin123') {
      setAdminPassword(newPass);
      localStorage.setItem('pa_admin_pwd', newPass);
      try {
        await setDoc(doc(db, 'systemConfig', 'default'), { adminPassword: newPass }, { merge: true });
      } catch (err) {
        console.warn('Failed to save admin password in Firestore:', err);
      }
      return true;
    }
    return false;
  };

  const loginStudent = (identifier: string): boolean => {
    const clean = identifier.trim().toLowerCase();
    const found = students.find(
      (s) =>
        s.email.toLowerCase() === clean ||
        s.rollNo.toLowerCase() === clean ||
        s.name.toLowerCase() === clean
    );
    if (found) {
      setCurrentStudent(found);
      setSelectedClass(found.studentClass);
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const registerStudent = async (data: {
    name: string;
    rollNo?: string;
    email: string;
    phone: string;
    studentClass: StudentClass;
    parentName: string;
    parentPhone: string;
  }): Promise<Student> => {
    const classNum = data.studentClass === 'Class 12th' ? '12' : '10';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newRoll = data.rollNo?.trim() || `PA-${classNum}-${randomNum}`;
    const newId = `std-${Date.now()}`;

    const newStudent: Student = {
      id: newId,
      name: data.name.trim(),
      rollNo: newRoll,
      email: data.email.trim(),
      phone: data.phone.trim(),
      parentName: data.parentName.trim() || 'Parent',
      parentPhone: data.parentPhone.trim(),
      parentContact: data.parentPhone.trim(),
      studentClass: data.studentClass,
      admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatar: data.name.length % 2 === 0 ? '👨‍🎓' : '👩‍🎓',
      status: 'active',
    };

    // Save to Firestore
    try {
      await setDoc(doc(db, 'students', newId), newStudent);
    } catch (err) {
      console.warn('Firestore student write error:', err);
    }
    setStudents((prev) => [newStudent, ...prev]);

    // Create default fee record in Firestore
    const baseFee = data.studentClass === 'Class 12th' ? 45000 : 35000;
    const newFeeRecord: StudentFeeRecord = {
      id: `fee-${newId}`,
      studentId: newId,
      studentName: newStudent.name,
      studentClass: newStudent.studentClass,
      rollNo: newStudent.rollNo,
      totalFee: baseFee,
      paidAmount: 0,
      dueAmount: baseFee,
      status: 'unpaid',
      dueDate: '30 Oct 2026',
      payments: [],
    };
    try {
      await setDoc(doc(db, 'fees', newFeeRecord.id), newFeeRecord);
    } catch (err) {
      console.warn('Firestore fee record write error:', err);
    }
    setFees((prev) => [newFeeRecord, ...prev]);

    setCurrentStudent(newStudent);
    setSelectedClass(newStudent.studentClass);
    setIsAuthModalOpen(false);
    return newStudent;
  };

  const updateStudentProfile = async (updates: Partial<Student>) => {
    if (!currentStudent) return;
    const updated = { ...currentStudent, ...updates };
    setCurrentStudent(updated);
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

    try {
      await setDoc(doc(db, 'students', updated.id), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore student update error:', err);
    }

    if (updates.name || updates.studentClass) {
      const targetFee = fees.find((f) => f.studentId === currentStudent.id);
      if (targetFee) {
        const updatedFee = {
          ...targetFee,
          studentName: updates.name || targetFee.studentName,
          studentClass: updates.studentClass || targetFee.studentClass,
        };
        try {
          await setDoc(doc(db, 'fees', targetFee.id), updatedFee, { merge: true });
        } catch (e) {
          console.warn('Firestore fee sync error:', e);
        }
      }
    }
  };

  const logoutStudent = () => {
    setCurrentStudent(null);
    localStorage.removeItem('pa_current_student_id');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      if (!isAdminAuthenticated) {
        setIsAdminLoginModalOpen(true);
      } else {
        setCurrentRole('admin');
      }
    } else {
      setCurrentRole('student');
    }
  };

  // Materials & PDF Upload (Firebase Firestore + Firebase Storage)
  const addMaterial = async (item: Omit<StudyMaterialItem, 'id' | 'uploadDate'>) => {
    const newId = `mat-${Date.now()}`;
    const newItem: StudyMaterialItem = {
      ...item,
      id: newId,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setMaterials((prev) => [newItem, ...prev]);

    try {
      await setDoc(doc(db, 'materials', newId), newItem);
    } catch (err) {
      console.warn('Firestore material write error:', err);
    }

    // Push notification to Firestore
    await sendNotification({
      title: `New ${newItem.category} Uploaded`,
      message: `${newItem.title} for ${newItem.grade} is now available in study repository.`,
      type: 'material',
      targetClass: newItem.grade,
    });
  };

  const uploadMaterialWithPdf = async (
    file: File | null,
    meta: {
      title: string;
      subject: string;
      grade: StudentClass;
      category: MaterialCategory;
      description: string;
      contentSnippet?: string;
      pdfPages?: number;
    }
  ) => {
    let downloadUrl: string | undefined;
    let fileName: string | undefined;
    let computedSize: string = '3.5 MB';

    if (file) {
      try {
        const uploadRes = await uploadFileToStorage(file, 'materials');
        downloadUrl = uploadRes.url;
        fileName = uploadRes.fileName;
        computedSize = uploadRes.size;
      } catch (err) {
        console.warn('Error uploading file to Firebase Storage:', err);
      }
    }

    await addMaterial({
      title: meta.title,
      subject: meta.subject,
      grade: meta.grade,
      category: meta.category,
      description: meta.description,
      contentSnippet: meta.contentSnippet,
      pdfPages: meta.pdfPages || 20,
      fileSize: computedSize,
      downloadUrl,
      fileName,
    });
  };

  const deleteMaterial = async (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteDoc(doc(db, 'materials', id));
    } catch (err) {
      console.warn('Firestore material delete error:', err);
    }
  };

  // Video Lectures (Firebase Firestore)
  const addVideo = async (item: Omit<VideoLecture, 'id' | 'uploadDate' | 'isWatched'>) => {
    let vidId = item.videoId;
    if (!vidId && item.youtubeUrl) {
      const match = item.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      vidId = match ? match[1] : 'kYv_8k0zKvg';
    }
    const newId = `vid-${Date.now()}`;
    const newVid: VideoLecture = {
      ...item,
      id: newId,
      videoId: vidId || 'kYv_8k0zKvg',
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isWatched: false,
    };

    setVideos((prev) => [newVid, ...prev]);

    try {
      await setDoc(doc(db, 'videos', newId), newVid);
    } catch (err) {
      console.warn('Firestore video write error:', err);
    }

    await sendNotification({
      title: `New Video Lecture: ${newVid.title}`,
      message: `${newVid.subject} lecture by ${newVid.instructor} has been added for ${newVid.grade}.`,
      type: 'video',
      targetClass: newVid.grade,
    });
  };

  const deleteVideo = async (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (err) {
      console.warn('Firestore video delete error:', err);
    }
  };

  const toggleVideoWatched = async (id: string) => {
    const target = videos.find((v) => v.id === id);
    if (!target) return;
    const updated = { ...target, isWatched: !target.isWatched };
    setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
    try {
      await setDoc(doc(db, 'videos', id), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore video update error:', err);
    }
  };

  // Tests & Exams (Firebase Firestore)
  const addTest = async (item: Omit<TestItem, 'id'>) => {
    const newId = `test-${Date.now()}`;
    const newTest: TestItem = {
      ...item,
      id: newId,
      isPublished: item.isPublished !== undefined ? item.isPublished : true,
    };

    setTests((prev) => [newTest, ...prev]);

    try {
      await setDoc(doc(db, 'tests', newId), newTest);
    } catch (err) {
      console.warn('Firestore test write error:', err);
    }

    await sendNotification({
      title: `New Test Scheduled: ${newTest.title}`,
      message: `${newTest.subject} exam for ${newTest.grade} is active. Duration: ${newTest.durationMinutes} mins.`,
      type: 'test',
      targetClass: newTest.grade,
    });
  };

  const deleteTest = async (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteDoc(doc(db, 'tests', id));
    } catch (err) {
      console.warn('Firestore test delete error:', err);
    }
  };

  const submitTestAttempt = async (attemptData: Omit<StudentTestAttempt, 'id' | 'date'>): Promise<StudentTestAttempt> => {
    const newId = `att-${Date.now()}`;
    const newAttempt: StudentTestAttempt = {
      ...attemptData,
      id: newId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isPublished: true, // evaluated attempts published by default
    };

    // Calculate rank among existing attempts for this test
    const matchingTestAttempts = [...attempts.filter((a) => a.testId === newAttempt.testId), newAttempt];
    matchingTestAttempts.sort((a, b) => b.score - a.score);
    const calculatedRank = matchingTestAttempts.findIndex((a) => a.id === newAttempt.id) + 1;
    newAttempt.rank = calculatedRank;

    setAttempts((prev) => [newAttempt, ...prev]);

    try {
      await setDoc(doc(db, 'attempts', newId), newAttempt);
    } catch (err) {
      console.warn('Firestore attempt write error:', err);
    }

    await sendNotification({
      title: `Scorecard Published: ${newAttempt.testTitle}`,
      message: `You scored ${newAttempt.score}/${newAttempt.totalMarks} (${newAttempt.percentage}%). Rank: #${calculatedRank}.`,
      type: 'result',
    });

    return newAttempt;
  };

  // Publish Results (Firebase Firestore)
  const publishResult = async (attemptId: string, isPublished: boolean) => {
    setAttempts((prev) =>
      prev.map((att) => (att.id === attemptId ? { ...att, isPublished } : att))
    );
    try {
      await setDoc(doc(db, 'attempts', attemptId), { isPublished }, { merge: true });
    } catch (err) {
      console.warn('Firestore publish result error:', err);
    }
  };

  const publishAllResults = async (testId?: string) => {
    const updated = attempts.map((att) => {
      if (!testId || att.testId === testId) {
        return { ...att, isPublished: true };
      }
      return att;
    });
    setAttempts(updated);

    try {
      for (const att of updated) {
        if (!testId || att.testId === testId) {
          await setDoc(doc(db, 'attempts', att.id), { isPublished: true }, { merge: true });
        }
      }
    } catch (err) {
      console.warn('Firestore publish all results error:', err);
    }

    await addAnnouncement({
      title: testId ? 'Official Test Results Published' : 'All Examination Results Published',
      content: 'Academy scorecards and class rank lists have been officially published. Check the Examination Results tab.',
      category: 'Exam Schedule',
      targetClass: 'All',
      priority: 'high',
      author: 'Academic Controller',
    });
  };

  const createManualResult = async (resultData: Omit<StudentTestAttempt, 'id' | 'date'>) => {
    const newId = `att-${Date.now()}`;
    const newAttempt: StudentTestAttempt = {
      ...resultData,
      id: newId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      isPublished: true,
    };
    setAttempts((prev) => [newAttempt, ...prev]);

    try {
      await setDoc(doc(db, 'attempts', newId), newAttempt);
    } catch (err) {
      console.warn('Firestore manual result write error:', err);
    }

    await sendNotification({
      title: `New Scorecard: ${newAttempt.testTitle}`,
      message: `Scorecard published for ${newAttempt.studentName}: ${newAttempt.score}/${newAttempt.totalMarks} (${newAttempt.percentage}%).`,
      type: 'result',
    });
  };

  // Fees & Ledgers (Firebase Firestore)
  const addFeePayment = async (
    studentId: string,
    payment: {
      amount: number;
      method: 'UPI' | 'Cash' | 'Card' | 'NetBanking' | 'Cheque' | 'Bank Transfer';
      remarks?: string;
    }
  ): Promise<FeePayment> => {
    const receiptNo = `PA-REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newPayment: FeePayment = {
      id: `pay-${Date.now()}`,
      amount: payment.amount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      method: payment.method,
      transactionId: `${payment.method.toUpperCase().slice(0, 3)}${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      receiptNo,
      remarks: payment.remarks || 'Tuition Fee Installment',
    };

    let updatedRecord: StudentFeeRecord | null = null;

    setFees((prev) =>
      prev.map((rec) => {
        if (rec.studentId === studentId) {
          const newPaid = rec.paidAmount + payment.amount;
          const newDue = Math.max(0, rec.totalFee - newPaid);
          const newStatus = newDue === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';
          updatedRecord = {
            ...rec,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newStatus,
            lastPaymentDate: newPayment.date,
            payments: [newPayment, ...rec.payments],
          };
          return updatedRecord;
        }
        return rec;
      })
    );

    if (updatedRecord) {
      try {
        await setDoc(doc(db, 'fees', (updatedRecord as StudentFeeRecord).id), updatedRecord);
      } catch (err) {
        console.warn('Firestore fee payment update error:', err);
      }
    }

    await sendNotification({
      title: `Fee Payment Received: ₹${payment.amount.toLocaleString()}`,
      message: `Official Receipt ${receiptNo} recorded. Updated balance has been synced to Firestore.`,
      type: 'fee',
    });

    return newPayment;
  };

  const updateStudentFeeRecord = async (studentId: string, updates: { totalFee?: number; dueDate?: string }) => {
    let targetId = '';
    let updatedDoc: StudentFeeRecord | null = null;

    setFees((prev) =>
      prev.map((rec) => {
        if (rec.studentId === studentId) {
          targetId = rec.id;
          const totalFee = updates.totalFee !== undefined ? updates.totalFee : rec.totalFee;
          const dueAmount = Math.max(0, totalFee - rec.paidAmount);
          const status = dueAmount === 0 ? 'paid' : rec.paidAmount > 0 ? 'partial' : 'unpaid';
          updatedDoc = {
            ...rec,
            totalFee,
            dueAmount,
            status,
            dueDate: updates.dueDate || rec.dueDate,
          };
          return updatedDoc;
        }
        return rec;
      })
    );

    if (targetId && updatedDoc) {
      try {
        await setDoc(doc(db, 'fees', targetId), updatedDoc, { merge: true });
      } catch (err) {
        console.warn('Firestore fee record update error:', err);
      }
    }
  };

  const createFeeRecord = async (record: Omit<StudentFeeRecord, 'id'>) => {
    const newId = `fee-${Date.now()}`;
    const newRecord: StudentFeeRecord = {
      ...record,
      id: newId,
    };
    setFees((prev) => [newRecord, ...prev]);

    try {
      await setDoc(doc(db, 'fees', newId), newRecord);
    } catch (err) {
      console.warn('Firestore create fee record error:', err);
    }
  };

  const updateFeeRecord = async (id: string, updates: Partial<StudentFeeRecord>) => {
    setFees((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...updates } : rec))
    );
    try {
      await setDoc(doc(db, 'fees', id), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore update fee record error:', err);
    }
  };

  // Student Admin Methods (Firebase Firestore)
  const addStudentByAdmin = async (data: Omit<Student, 'id' | 'admissionDate'>) => {
    const newId = `std-${Date.now()}`;
    const newStudent: Student = {
      ...data,
      id: newId,
      admissionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      avatar: data.avatar || (data.name.length % 2 === 0 ? '👨‍🎓' : '👩‍🎓'),
      status: 'active',
    };

    setStudents((prev) => [newStudent, ...prev]);

    try {
      await setDoc(doc(db, 'students', newId), newStudent);
    } catch (err) {
      console.warn('Firestore student create error:', err);
    }

    // Auto-generate student fee record in Firestore
    const baseFee = data.studentClass === 'Class 12th' ? 45000 : 35000;
    const feeRec: StudentFeeRecord = {
      id: `fee-${newId}`,
      studentId: newId,
      studentName: newStudent.name,
      studentClass: newStudent.studentClass,
      rollNo: newStudent.rollNo,
      totalFee: baseFee,
      paidAmount: 0,
      dueAmount: baseFee,
      status: 'unpaid',
      dueDate: '30 Oct 2026',
      payments: [],
    };

    setFees((prev) => [feeRec, ...prev]);

    try {
      await setDoc(doc(db, 'fees', feeRec.id), feeRec);
    } catch (err) {
      console.warn('Firestore student fee init error:', err);
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    await addStudentByAdmin(student);
  };

  const updateStudentByAdmin = async (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    try {
      await setDoc(doc(db, 'students', id), updates, { merge: true });
    } catch (err) {
      console.warn('Firestore student update error:', err);
    }

    if (updates.name || updates.studentClass || updates.rollNo) {
      setFees((prev) =>
        prev.map((f) => {
          if (f.studentId === id) {
            const updated = {
              ...f,
              studentName: updates.name || f.studentName,
              studentClass: updates.studentClass || f.studentClass,
              rollNo: updates.rollNo || f.rollNo,
            };
            setDoc(doc(db, 'fees', f.id), updated, { merge: true }).catch(console.warn);
            return updated;
          }
          return f;
        })
      );
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    await updateStudentByAdmin(id, updates);
  };

  const deleteStudentByAdmin = async (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (err) {
      console.warn('Firestore delete student error:', err);
    }
  };

  const deleteStudent = async (id: string) => {
    await deleteStudentByAdmin(id);
  };

  // Announcements & Notices (Firebase Firestore)
  const addAnnouncement = async (item: Omit<Announcement, 'id' | 'date'>) => {
    const newId = `anc-${Date.now()}`;
    const newAnc: Announcement = {
      ...item,
      id: newId,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };

    setAnnouncements((prev) => [newAnc, ...prev]);

    try {
      await setDoc(doc(db, 'announcements', newId), newAnc);
    } catch (err) {
      console.warn('Firestore announcement write error:', err);
    }

    // Also dispatch as Notification
    await sendNotification({
      title: `Notice: ${newAnc.title}`,
      message: newAnc.content.slice(0, 120),
      type: 'general',
      targetClass: newAnc.targetClass === 'All' ? undefined : newAnc.targetClass,
    });
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      console.warn('Firestore announcement delete error:', err);
    }
  };

  // Notifications (Firebase Firestore)
  const sendNotification = async (item: Omit<NotificationItem, 'id' | 'date' | 'read'>) => {
    const newId = `notif-${Date.now()}`;
    const newNotif: NotificationItem = {
      ...item,
      id: newId,
      date: 'Just now',
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);

    try {
      await setDoc(doc(db, 'notifications', newId), newNotif);
    } catch (err) {
      console.warn('Firestore notification write error:', err);
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await setDoc(doc(db, 'notifications', id), { read: true }, { merge: true });
    } catch (err) {
      console.warn('Firestore notification update error:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    for (const n of notifications) {
      if (!n.read) {
        setDoc(doc(db, 'notifications', n.id), { read: true }, { merge: true }).catch(console.warn);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentStudent,
        adminUser,
        isAdminAuthenticated,
        selectedClass,
        setSelectedClass,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        loginStudent,
        registerStudent,
        updateStudentProfile,
        logoutStudent,
        switchRole,
        materials,
        addMaterial,
        uploadMaterialWithPdf,
        deleteMaterial,
        videos,
        addVideo,
        deleteVideo,
        toggleVideoWatched,
        tests,
        addTest,
        deleteTest,
        attempts,
        submitTestAttempt,
        publishResult,
        publishAllResults,
        createManualResult,
        fees,
        addFeePayment,
        updateStudentFeeRecord,
        createFeeRecord,
        updateFeeRecord,
        students,
        addStudentByAdmin,
        updateStudentByAdmin,
        deleteStudentByAdmin,
        addStudent,
        updateStudent,
        deleteStudent,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        notifications,
        sendNotification,
        markNotificationRead,
        markAllNotificationsRead,
        isFirebaseConnected,
        firebaseSyncStatus,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
