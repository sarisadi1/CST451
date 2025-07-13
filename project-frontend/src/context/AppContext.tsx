import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Progress, CodeExecution } from '../types';

interface AppContextType {
  courses: Course[];
  userProgress: Progress[];
  enrolledCourses: Course[];
  enrollInCourse: (courseId: string) => void;
  updateProgress: (courseId: string, lessonId?: string, challengeId?: string) => void;
  executeCode: (code: string, language: string, input?: string) => Promise<CodeExecution>;
  saveCodeDraft: (challengeId: string, code: string) => void;
  getCodeDraft: (challengeId: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<Progress[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    // 👇 Mock Data
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Python Fundamentals',
        description: 'Learn Python programming from scratch.',
        instructor: {
          id: '2',
          name: 'Dr. Sarah Wilson',
          email: 'sarah@test.com',
          role: 'INSTRUCTOR',
          createdAt: '2024-01-01',
          isVerified: true
        },
        enrollmentCount: 1200,
        duration: '8 weeks',
        level: 'BEGINNER',
        tags: ['Python', 'Programming'],
        thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
        lessons: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'JavaScript Mastery',
        description: 'Master modern JavaScript with ES6+ features.',
        instructor: {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@test.com',
          role: 'INSTRUCTOR',
          createdAt: '2024-01-01',
          isVerified: true
        },
        enrollmentCount: 890,
        duration: '10 weeks',
        level: 'INTERMEDIATE',
        tags: ['JavaScript', 'Web Development'],
        thumbnail: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg',
        lessons: [],
        createdAt: '2024-01-05',
        updatedAt: '2024-01-20'
      }
    ];
    setCourses(mockCourses);
  }, []);

  const enrollInCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course && !enrolledCourses.find(c => c.id === courseId)) {
      setEnrolledCourses([...enrolledCourses, { ...course, isEnrolled: true, progress: 0 }]);
      const newProgress: Progress = {
        userId: '1',
        courseId,
        completedLessons: [],
        completedChallenges: [],
        totalProgress: 0,
        lastAccessed: new Date().toISOString()
      };
      setUserProgress([...userProgress, newProgress]);
    }
  };

  const updateProgress = (courseId: string, lessonId?: string, challengeId?: string) => {
    setUserProgress(prev =>
      prev.map(progress => {
        if (progress.courseId === courseId) {
          const updated = { ...progress };
          if (lessonId && !updated.completedLessons.includes(lessonId)) {
            updated.completedLessons.push(lessonId);
          }
          if (challengeId && !updated.completedChallenges.includes(challengeId)) {
            updated.completedChallenges.push(challengeId);
          }
          updated.lastAccessed = new Date().toISOString();
          updated.totalProgress = Math.min(
            ((updated.completedLessons.length + updated.completedChallenges.length) / 10) * 100,
            100
          );
          return updated;
        }
        return progress;
      })
    );
  };

  const executeCode = async (code: string, language: string, input?: string): Promise<CodeExecution> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    let output = '';
    if (language === 'javascript' && code.includes('console.log')) {
      output = code.match(/console\.log\(['"`](.+?)['"`]\)/)?.[1] || 'Output';
    } else if (language === 'python' && code.includes('print')) {
      output = code.match(/print\(['"`](.+?)['"`]\)/)?.[1] || 'Output';
    }
    return {
      code,
      language,
      input,
      output: output || 'Code executed successfully',
      executionTime: Math.random() * 1000,
      memory: Math.random() * 50,
      status: 'SUCCESS'
    };
  };

  const saveCodeDraft = (challengeId: string, code: string) => {
    localStorage.setItem(`draft_${challengeId}`, code);
  };

  const getCodeDraft = (challengeId: string): string => {
    return localStorage.getItem(`draft_${challengeId}`) || '';
  };

  return (
    <AppContext.Provider
      value={{
        courses,
        userProgress,
        enrolledCourses,
        enrollInCourse,
        updateProgress,
        executeCode,
        saveCodeDraft,
        getCodeDraft
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
