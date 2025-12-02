export interface StudentData {
  id: string;
  academicProgramId: string;
  name: string;
  class: string;
  section: string;
  engagementLevel: string;
  attendance: {
    percent: number;
    total: number;
    attended: number;
    missed: number;
  };
  quiz: {
    completed: number;
    correctAnswers: number;
    totalQuestions: number;
  };
  liveTests: {
    total: number;
    completed: number;
    avgScore: number;
    avgTime: string;
  };
  streak: {
    longest: number;
  };
  studyTime: {
    total: string;
    october: string;
    november: string;
    december: string;
  };
  yearlyAttendance?: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  yearlyStudyTime?: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
    totalHours: string;
  };
  finalScore: number;
  dayOfWeek: number[]; // [Sunday, Monday, ..., Saturday] percentages
  lastQuarter?: {
    attendance: {
      percent: number;
    };
    liveTests: {
      avgScore: number;
    };
    streak: {
      longest: number;
    };
    studyTime: {
      total: string;
    };
    finalScore: number;
  };
}

export const students: StudentData[] = [
  {
    id: '1937',
    academicProgramId: 'A1',
    name: 'তাসনিম হাসান',
    class: 'ক্লাস ৯',
    section: 'বিজ্ঞান বিভাগ',
    engagementLevel: 'high',
    attendance: { percent: 95, total: 40, attended: 38, missed: 2 },
    quiz: { completed: 40, correctAnswers: 110, totalQuestions: 130 },
    liveTests: { total: 12, completed: 12, avgScore: 85, avgTime: '38 mins' },
    streak: { longest: 200 },
    studyTime: { total: '60:00', october: '18:00', november: '20:00', december: '22:00' },
    finalScore: 92,
    yearlyAttendance: { q1: 88, q2: 92, q3: 96, q4: 95 },
    dayOfWeek: [12.34, 13.45, 14.56, 10.12, 18.43, 16.10, 15.00],
    lastQuarter: {
      attendance: { percent: 88 },
      liveTests: { avgScore: 78 },
      streak: { longest: 9 },
      studyTime: { total: '45:00' },
      finalScore: 89,
    },
  },
  {
    id: '4821',
    academicProgramId: 'A2',
    name: 'রাফি আক্তার',
    class: 'ক্লাস ১০',
    section: 'বিজ্ঞান বিভাগ',
    engagementLevel: 'moderate',
    attendance: { percent: 83, total: 36, attended: 30, missed: 6 },
    quiz: { completed: 36, correctAnswers: 89, totalQuestions: 120 },
    liveTests: { total: 10, completed: 8, avgScore: 65, avgTime: '45 mins' },
    streak: { longest: 6 },
    studyTime: { total: '48:30', october: '12:45', november: '15:30', december: '20:05' },
    finalScore: 79,
    yearlyAttendance: { q1: 78, q2: 82, q3: 85, q4: 83 },
    dayOfWeek: [10.00, 12.00, 28.00, 5.00, 18.00, 17.00, 10.00],
    lastQuarter: {
      attendance: { percent: 83 },
      liveTests: { avgScore: 72 },
      streak: { longest: 6 },
      studyTime: { total: '35:20' },
      finalScore: 76,
    },
  },
  {
    id: '5704',
    academicProgramId: 'A1',
    name: 'মাহি রহমান',
    class: 'ক্লাস ৮',
    section: 'বিজ্ঞান বিভাগ',
    engagementLevel: 'low',
    attendance: { percent: 60, total: 30, attended: 18, missed: 12 },
    quiz: { completed: 20, correctAnswers: 50, totalQuestions: 100 },
    liveTests: { total: 8, completed: 4, avgScore: 45, avgTime: '55 mins' },
    streak: { longest: 2 },
    studyTime: { total: '20:15', october: '5:00', november: '7:15', december: '8:00' },
    finalScore: 50,
    yearlyAttendance: { q1: 55, q2: 60, q3: 62, q4: 60 },
    dayOfWeek: [8.00, 12.00, 15.00, 20.00, 18.00, 17.00, 10.00],
    lastQuarter: {
      attendance: { percent: 65 },
      liveTests: { avgScore: 40 },
      streak: { longest: 5 },
      studyTime: { total: '15:30' },
      finalScore: 45,
    },
  },
];

export function getStudentByIdAndProgram(id: string, academicProgramId: string): StudentData | undefined {
  return students.find(s => s.id === id && s.academicProgramId === academicProgramId);
} 