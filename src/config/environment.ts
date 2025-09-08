// Environment configuration
export const ENV_CONFIG = {
  // Set to true for production (API calls), false for development (mock data)
  IS_PRODUCTION: false,
  
  // API base URL - update this with your actual API endpoint
  API_BASE_URL: 'http://localhost:3000/api/v1/students', // Replace with actual API URL
  
  // API timeout in milliseconds
  API_TIMEOUT: 10000,
  AUTHORIZATION: 'Bearer test-token', // Replace with your real token
  API_KEY: 'test-key',            // Replace with your real API key
  CLIENT_VERSION: '1.0.0',                 // Replace with your client version
};

// Helper function to check if we should use API
export const shouldUseAPI = () => ENV_CONFIG.IS_PRODUCTION;

// Helper function to get API URL for a specific student and program
export const getStudentAPIUrl = (studentId: string, academicProgramId: string) => 
  `${ENV_CONFIG.API_BASE_URL}/${studentId}/${academicProgramId}`; 