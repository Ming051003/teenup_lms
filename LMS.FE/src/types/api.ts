// API Types based on OpenAPI schema

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'COMPLETED';

// Request Types
export interface CreateStudentRequest {
  name: string;
  dateOfBirth: string; // ISO date format
  gender: number; // 0: MALE, 1: FEMALE, 2: OTHER
  currentGrade: string;
  parentId: number;
}

export interface UpdateStudentRequest {
  name?: string;
  dateOfBirth?: string;
  gender?: number;
  currentGrade?: string;
  parentId?: number;
}

export interface CreateParentRequest {
  name: string;
  phone: string; // pattern: ^[0-9]{10,11}$
  email: string;
}

export interface UpdateParentRequest {
  name?: string;
  phone?: string; // pattern: ^[0-9]{10,11}$
  email?: string;
}

export interface CreateClassRequest {
  name: string;
  subject: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
  startTime: string;
  endTime: string;
  teacherName: string;
  maxStudents: number; // minimum: 1
}

export interface UpdateClassRequest {
  name?: string;
  subject?: string;
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
  startTime?: string;
  endTime?: string;
  teacherName?: string;
  maxStudents?: number; // minimum: 1
}

export interface CreateSubscriptionRequest {
  studentId: number;
  packageName: string;
  startDate: string; // date format
  endDate: string; // date format
  totalSessions: number; // minimum: 1
}

export interface UpdateSubscriptionRequest {
  packageName?: string;
  startDate?: string; // date format
  endDate?: string; // date format
  totalSessions?: number; // minimum: 1
  status?: SubscriptionStatus;
}

export interface RegisterStudentToClassRequest {
  studentId: number;
}

// Detail Response Types (for new endpoints)
export interface StudentClassInfo {
  id: number;
  name: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  timeSlot: string;
  teacherName: string;
  registrationStatus: string;
}

export interface StudentDetailResponse {
 parentId: number;
  parentName: string;
  classes?: StudentClassInfo[];
}

export interface StudentClassInfo {
  id: number;
  name: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  timeSlot: string;
  registrationStatus: string;
}

export interface ClassStudentInfo {
  id: number;
  name: string;
  currentGrade: string;
  parentName: string;
  parentPhone: string;
  registrationStatus: string;
  registrationDate: string;
}

export interface ClassDetailResponse {
  id: number;
  name: string;
  students: ClassStudentInfo[];
}

// Response Types
export interface ParentBasicResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export interface StudentResponse {
  id: number;
  name: string;
  dateOfBirth: string; // ISO date format
  gender: number; // 0: MALE, 1: FEMALE, 2: OTHER
  currentGrade: string;
  parentId: number;
  parentName: string;
  parent: ParentBasicResponse;
  createdAt: string; // date-time format
  updatedAt: string; // date-time format
}

export interface ParentResponse {
  id: number;
  name: string;
  phone: string;
  email: string;
  students: StudentResponse[];
  createdAt: string; // date-time format
  updatedAt: string; // date-time format
}

export interface ClassResponse {
  id: number;
  name: string;
  subject: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  timeSlot?: string; // Optional, can be generated from startTime and endTime
  teacherName: string;
  maxStudents: number;
  currentStudentsCount?: number; // Optional, default to 0
  createdAt: string; // date-time format
  updatedAt: string; // date-time format
  full?: boolean; // Optional, can be calculated from currentStudentsCount and maxStudents
}

export interface SubscriptionResponse {
  id: number;
  studentId: number;
  studentName?: string; // Optional, may not be in API response
  packageName: string;
  startDate: string; // date format
  endDate: string; // date format
  totalSessions: number;
  usedSessions: number;
  remainingSessions?: number; // Optional, can be calculated from totalSessions - usedSessions
  status: SubscriptionStatus | number; // Can be string or number (1 = ACTIVE, etc.)
  createdAt: string; // date-time format
  updatedAt: string; // date-time format
  active?: boolean; // Optional
  expired?: boolean; // Optional
}
