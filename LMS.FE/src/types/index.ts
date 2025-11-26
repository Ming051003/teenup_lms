
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'COMPLETED';

export interface Parent {
  id: number;
  name: string;
  phone: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Student {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: number;
  currentGrade: string;
  parentId: number;
  parentName: string;
  parent: Parent;
  createdAt?: string;
  updatedAt?: string;
}

export interface Class {
  id: number;
  name: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  timeSlot: string;
  teacherName: string;
  maxStudents: number;
  currentStudentsCount: number;
  full: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Subscription {
  id: number;
  studentId: number;
  studentName: string;
  packageName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  status: SubscriptionStatus;
  active: boolean;
  expired: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateParentRequest {
  name: string;
  phone: string;
  email: string;
}

export interface CreateStudentRequest {
  name: string;
  dateOfBirth: string;
  gender: number;
  currentGrade: string;
  parentId: number;
}

export interface CreateClassRequest {
  name: string;
  subject: string;
  dayOfWeek: number; // 1 = Monday, 2 = Tuesday, ..., 7 = Sunday
  startTime: string;
  endTime: string;
  teacherName: string;
  maxStudents: number;
}

export interface CreateSubscriptionRequest {
  studentId: number;
  packageName: string;
  startDate: string;
  endDate: string;
  totalSessions: number;
}

// Re-export API types for convenience
export * from './api';
