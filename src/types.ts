export type PageId = 'home' | 'materials' | 'notes' | 'tests' | 'weekly' | 'results';

export type StudentClass = 'Class 10th' | 'Class 12th';

export interface WeeklyTestRegistration {
  studentName: string;
  studentClass: StudentClass;
  rollNo: string;
  registeredAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TestItem {
  id: string;
  title: string;
  subject: string;
  grade?: StudentClass;
  badgeClass?: string;
  questionsCount: number;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface SubjectMaterial {
  id: string;
  name: string;
  icon: string;
  description: string;
  grade?: StudentClass;
  chaptersCount: number;
  chapters: {
    title: string;
    description: string;
    pdfSize: string;
    readTime: string;
  }[];
}

export interface NoteChapter {
  title: string;
  keyPoints: string[];
  formulas: { name: string; formula: string }[];
}

export interface NoteItem {
  id: string;
  subject: string;
  grade?: string;
  badgeClass?: string;
  icon: string;
  description: string;
  keyPoints: string[];
  formulas: { name: string; formula: string }[];
  chapters?: NoteChapter[];
}

export interface TestResultRecord {
  id: string;
  title: string;
  score: number;
  total: number;
  date: string;
  subject: string;
  studentName?: string;
  studentClass?: StudentClass;
  rollNo?: string;
}
