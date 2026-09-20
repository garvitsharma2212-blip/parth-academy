export type StudentClass = 'Class 10th' | 'Class 12th';

export type UserRole = 'admin' | 'student';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  phone: string;
  parentName?: string;
  parentPhone?: string;
  parentContact?: string;
  studentClass: StudentClass;
  admissionDate: string;
  avatar?: string;
  status?: 'active' | 'inactive';
}

export type StudentUser = Student;

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  lastLogin: string;
}

export type MaterialCategory = 'Notes' | 'Assignment' | 'Question Bank' | 'Sample Paper';

export interface StudyMaterialItem {
  id: string;
  title: string;
  subject: string;
  grade: StudentClass;
  category: MaterialCategory;
  fileSize: string;
  uploadDate: string;
  description: string;
  chaptersCount?: number;
  pdfPages?: number;
  contentSnippet?: string;
  downloadUrl?: string;
  fileStoragePath?: string;
  fileName?: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  subject: string;
  grade: StudentClass;
  youtubeUrl: string;
  videoId: string;
  duration: string;
  instructor: string;
  uploadDate: string;
  description: string;
  isWatched?: boolean;
}

export type TestType = 'weekly' | 'chapter' | 'full_syllabus';
export type QuestionType = 'mcq' | 'descriptive';

export interface QuizQuestion {
  id: number | string;
  type?: QuestionType;
  question?: string;
  questionText?: string;
  options?: string[]; // for MCQ
  correctIndex?: number; // for MCQ
  correctOptionIndex?: number; // for MCQ
  explanation?: string;
  marks?: number;
  sampleAnswer?: string; // for descriptive
}

export type QuestionItem = QuizQuestion;

export interface TestItem {
  id: string;
  title: string;
  subject: string;
  grade: StudentClass;
  testType?: TestType;
  badgeClass?: string;
  questionsCount: number;
  durationMinutes: number;
  totalMarks?: number;
  scheduledDate?: string;
  scheduledTime?: string;
  isPublished?: boolean;
  questions: QuizQuestion[];
}

export interface StudentTestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  studentClass: StudentClass;
  rollNo: string;
  score: number;
  totalMarks: number;
  percentage: number;
  rank?: number;
  date: string;
  answers: Record<number, number | string>; // questionId -> selectedIndex or text
  timeTakenSeconds: number;
  status: 'evaluated' | 'pending';
  isPublished?: boolean;
}

export interface FeePayment {
  id: string;
  amount: number;
  date: string;
  method: 'UPI' | 'Cash' | 'Card' | 'NetBanking' | 'Cheque' | 'Bank Transfer';
  transactionId: string;
  receiptNo: string;
  remarks?: string;
}

export interface StudentFeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: StudentClass;
  rollNo: string;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  status: 'paid' | 'unpaid' | 'partial';
  dueDate: string;
  lastPaymentDate?: string;
  payments: FeePayment[];
}

export type NoticeCategory = 'Important' | 'Exam Schedule' | 'Holiday' | 'Emergency' | 'General' | 'Exam' | 'Fee';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  targetClass: 'All' | StudentClass;
  date: string;
  priority: 'high' | 'normal';
  author?: string;
}

export type AnnouncementItem = Announcement;

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'material' | 'video' | 'test' | 'result' | 'fee' | 'announcement' | 'general';
  date: string;
  read: boolean;
  targetClass?: 'All' | StudentClass;
}

export type StudentNavTab =
  | 'home'
  | 'materials'
  | 'videos'
  | 'tests'
  | 'profile'
  | 'dashboard'
  | 'results'
  | 'fees';
export type AdminNavTab =
  | 'overview'
  | 'materials'
  | 'videos'
  | 'tests'
  | 'results'
  | 'fees'
  | 'students'
  | 'announcements';

// Backward compatibility types for legacy components & seed data
export type PageId = 'home' | 'materials' | 'notes' | 'tests' | 'weekly' | 'results';

export interface ChapterItem {
  title: string;
  description?: string;
  pdfSize?: string;
  readTime?: string;
  keyPoints?: string[];
  formulas?: { name: string; formula: string }[];
}

export interface FormulaItem {
  name: string;
  formula: string;
}

export interface SubjectMaterial {
  id: string;
  name: string;
  description: string;
  icon: string;
  grade?: StudentClass;
  chapters?: (string | ChapterItem)[];
  chaptersCount?: number;
}

export interface NoteItem {
  id: string;
  subject: string;
  icon: string;
  description: string;
  grade?: StudentClass;
  chapters?: (string | ChapterItem)[];
  formulas: (string | FormulaItem)[];
  keyPoints: string[];
}

export interface TestResultRecord {
  id: string;
  title: string;
  score: number;
  total: number;
  date: string;
  studentName?: string;
  studentClass?: StudentClass;
  subject?: string;
  rollNo?: string;
}

export interface WeeklyTestRegistration {
  studentName: string;
  studentClass: StudentClass;
  rollNo: string;
  registeredAt: string;
}
