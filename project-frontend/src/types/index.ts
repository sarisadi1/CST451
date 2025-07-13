export interface User {
  id: string;
  name: string;
  email: string;
  role: 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: User;
  enrollmentCount: number;
  duration: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  tags: string[];
  thumbnail: string;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
  isEnrolled?: boolean;
  progress?: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
  order: number;
  challenges: Challenge[];
  isCompleted?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
  language: 'javascript' | 'python' | 'java' | 'cpp';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  points: number;
  isCompleted?: boolean;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedChallenges: string[];
  totalProgress: number;
  lastAccessed: string;
  certificate?: Certificate;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  certificateUrl: string;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  details: string;
}

export interface CodeExecution {
  code: string;
  language: string;
  input?: string;
  output?: string;
  error?: string;
  executionTime?: number;
  memory?: number;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'ERROR' | 'TIMEOUT';
}