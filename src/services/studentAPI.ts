import type { StudentData } from '../utils/mockStudents';
import { ENV_CONFIG, getStudentAPIUrl } from '../config/environment';

export interface APIResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface APIError {
  message: string;
  status?: number;
}

// Fetch student data from API
export async function fetchStudentData(studentId: string, academicProgramId: string): Promise<StudentData> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ENV_CONFIG.API_TIMEOUT);

  try {
    const response = await fetch(getStudentAPIUrl(studentId, academicProgramId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': ENV_CONFIG.AUTHORIZATION,
        'X-API-Key': ENV_CONFIG.API_KEY,
        'X-Client-Version': ENV_CONFIG.CLIENT_VERSION,
        // Add any authentication headers here if needed
        // 'Authorization': `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: APIResponse<StudentData> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch student data');
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again');
      }
      throw error;
    }
    
    throw new Error('An unexpected error occurred');
  }
}

// Mock API function for testing (returns the same data as mockStudents)
export async function fetchStudentDataMock(studentId: string, academicProgramId: string): Promise<StudentData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Import mock data
  const { getStudentByIdAndProgram } = await import('../utils/mockStudents');
  const studentData = getStudentByIdAndProgram(studentId, academicProgramId);
  
  if (!studentData) {
    throw new Error('Student not found');
  }
  
  return studentData;
} 