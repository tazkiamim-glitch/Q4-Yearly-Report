import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { StudentData } from '../utils/mockStudents';
import { useStudentData } from '../hooks/useStudentData';

interface StudentDataContextType {
  studentData: StudentData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setStudentIds: (studentId: string, academicProgramId: string) => void;
  currentStudentId: string | null;
  currentAcademicProgramId: string | null;
}

const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

interface StudentDataProviderProps {
  children: ReactNode;
}

export const StudentDataProvider: React.FC<StudentDataProviderProps> = ({ children }) => {
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [currentAcademicProgramId, setCurrentAcademicProgramId] = useState<string | null>(null);
  const { studentData, loading, error, refetch } = useStudentData(currentStudentId || '', currentAcademicProgramId || '');

  const setStudentIds = (studentId: string, academicProgramId: string) => {
    if (studentId !== currentStudentId || academicProgramId !== currentAcademicProgramId) {
      setCurrentStudentId(studentId);
      setCurrentAcademicProgramId(academicProgramId);
    }
  };

  return (
    <StudentDataContext.Provider
      value={{
        studentData,
        loading,
        error,
        refetch,
        setStudentIds,
        currentStudentId,
        currentAcademicProgramId,
      }}
    >
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentDataContext = () => {
  const context = useContext(StudentDataContext);
  if (context === undefined) {
    throw new Error('useStudentDataContext must be used within a StudentDataProvider');
  }
  return context;
}; 