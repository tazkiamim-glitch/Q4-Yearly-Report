import { useState, useEffect, useCallback } from 'react';
import type { StudentData } from '../utils/mockStudents';
import { fetchStudentData, fetchStudentDataMock } from '../services/studentAPI';
import { shouldUseAPI } from '../config/environment';

export interface UseStudentDataReturn {
  studentData: StudentData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStudentData(studentId: string, academicProgramId: string): UseStudentDataReturn {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!studentId || !academicProgramId) {
      setError('Student ID and Academic Program ID are required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data: StudentData;

      if (shouldUseAPI()) {
        // Production mode: fetch from API
        data = await fetchStudentData(studentId, academicProgramId);
      } else {
        // Development mode: use mock API (simulates real API behavior)
        data = await fetchStudentDataMock(studentId, academicProgramId);
      }

      setStudentData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch student data';
      setError(errorMessage);
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  }, [studentId, academicProgramId]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    studentData,
    loading,
    error,
    refetch,
  };
} 