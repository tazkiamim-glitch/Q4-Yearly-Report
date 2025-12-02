import React from 'react';
import { useParams } from 'react-router-dom';
import { useStudentDataContext } from '../context/StudentDataContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode?: string }>();
  const { studentData, loading, error, refetch, setStudentIds, currentStudentId, currentAcademicProgramId, setReportMode } = useStudentDataContext();

  // Set the student ID and academic program ID if they're different from current
  React.useEffect(() => {
    if (
      studentId && academicProgramId &&
      (studentId !== currentStudentId || academicProgramId !== currentAcademicProgramId)
    ) {
      setStudentIds(studentId, academicProgramId);
    }
  }, [studentId, academicProgramId, currentStudentId, currentAcademicProgramId, setStudentIds]);

  React.useEffect(() => {
    if (mode) {
      const normalized = mode.toLowerCase() === 'yearly' ? 'YEARLY' : 'QUARTERLY';
      setReportMode(normalized);
    }
  }, [mode, setReportMode]);

  // Show loading only if we don't have data yet
  if (loading && !studentData) {
    return <LoadingSpinner message="তোমার কোয়ার্টার রিভিউ প্রস্তুত হচ্ছে!" />;
  }

  // Show error if there's an error and no data
  if (error && !studentData) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  // If we have data, render the children
  if (studentData) {
    return <>{children}</>;
  }

  // Fallback loading state
  return <LoadingSpinner message="তোমার কোয়ার্টার রিভিউ প্রস্তুত হচ্ছে!" />;
}; 