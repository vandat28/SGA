export interface FormState {
  teacherName: string;
  lessonTitle: string;
  subject: string;
  classLevel: string;
  program: string;
  circulars: string[];
  duration: string;
  notes: string;
  useCustomTemplate: boolean;
  customTemplate: string;
}

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  title: string;
  lessonPlan: string;
}
