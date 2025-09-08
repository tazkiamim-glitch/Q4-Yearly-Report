import { useNavigate } from 'react-router-dom';
import { students } from '../utils/mockStudents';
import { useStudentDataContext } from '../context/StudentDataContext';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTime(maxHours = 60) {
  const hours = getRandomInt(0, maxHours);
  const minutes = getRandomInt(0, 59);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

// Helper function to convert time string to hours
function timeStringToHours(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
}

// Calculate final score based on student metrics
function calculateFinalScore(metrics: {
  attendance: { percent: number; total: number; attended: number; missed: number };
  quiz: { completed: number; correctAnswers: number; totalQuestions: number };
  liveTests: { total: number; completed: number; avgScore: number; avgTime: string };
  streak: { longest: number };
  studyTime: { total: string; october: string; november: string; december: string };
}): number {
  let score = 0;
  
  // Attendance weight: 25%
  const attendanceScore = metrics.attendance.percent;
  score += attendanceScore * 0.25;
  
  // Quiz performance weight: 20%
  const quizScore = metrics.quiz.totalQuestions > 0 ? (metrics.quiz.correctAnswers / metrics.quiz.totalQuestions) * 100 : 0;
  score += quizScore * 0.20;
  
  // Model test performance weight: 20%
  const liveTestScore = metrics.liveTests.avgScore;
  score += liveTestScore * 0.20;
  
  // Streak weight: 25% (high weight as requested)
  const maxStreak = 30; // Maximum possible streak
  const streakScore = Math.min((metrics.streak.longest / maxStreak) * 100, 100);
  score += streakScore * 0.25;
  
  // Study time weight: 10%
  const totalStudyHours = timeStringToHours(metrics.studyTime.total);
  const maxStudyHours = 60; // Maximum possible study hours
  const studyTimeScore = Math.min((totalStudyHours / maxStudyHours) * 100, 100);
  score += studyTimeScore * 0.10;
  
  return Math.round(score);
}

// Determine engagement level based on final score
function getEngagementLevel(finalScore: number): string {
  if (finalScore >= 70) {
    return 'high';
  } else if (finalScore >= 40) {
    return 'moderate';
  } else {
    return 'low';
  }
}

export const TestPage = () => {
  const navigate = useNavigate();
  const { setStudentIds } = useStudentDataContext();
  
  // Map engagementLevel to a readable type
  const typeMap: Record<string, string> = {
    high: 'High Engagement',
    moderate: 'Moderate Engagement',
    low: 'Low Engagement',
  };

  const mockNames = students.map(s => s.name);

  function generateRandomStudent() {
    // Pick a random name from mock data
    const name = mockNames[getRandomInt(0, mockNames.length - 1)];
    const classOptions = ['ক্লাস ৮', 'ক্লাস ৯', 'ক্লাস ১০'];
    const sectionOptions = ['বিজ্ঞান বিভাগ', 'মানবিক বিভাগ', 'বাণিজ্য বিভাগ'];
    const className = classOptions[getRandomInt(0, classOptions.length - 1)];
    const section = sectionOptions[getRandomInt(0, sectionOptions.length - 1)];
    
    // Attendance
    const totalClasses = getRandomInt(20, 50);
    const attended = getRandomInt(0, totalClasses);
    const missed = totalClasses - attended;
    const percent = Math.round((attended / totalClasses) * 100);
    
    // Quiz
    const quizTotal = getRandomInt(10, 50);
    const quizCorrect = getRandomInt(0, quizTotal);
    
    // Model tests
    const liveTotal = getRandomInt(3, 15);
    const liveCompleted = getRandomInt(0, liveTotal);
    const avgScore = getRandomInt(0, 100);
    const avgTime = `${getRandomInt(20, 60)} mins`;
    
    // Streak
    const streakLongest = getRandomInt(0, 30);
    
    // Study time
    const studyTotal = getRandomTime(60);
    const studyOct = getRandomTime(30);
    const studyNov = getRandomTime(30);
    const studyDec = getRandomTime(30);
    
    // Generate random academic program id
    const academicProgramIds = ['A1', 'A2', 'A3'];
    const academicProgramId = academicProgramIds[getRandomInt(0, academicProgramIds.length - 1)];
    
    // Calculate final score based on metrics
    const metrics = {
      attendance: { percent, total: totalClasses, attended, missed },
      quiz: { completed: quizTotal, correctAnswers: quizCorrect, totalQuestions: quizTotal },
      liveTests: { total: liveTotal, completed: liveCompleted, avgScore, avgTime },
      streak: { longest: streakLongest },
      studyTime: { total: studyTotal, october: studyOct, november: studyNov, december: studyDec },
    };
    
    const finalScore = calculateFinalScore(metrics);
    const engagementLevel = getEngagementLevel(finalScore);
    
    // Generate unique ID
    const id = Date.now().toString();
    // Generate random dayOfWeek array (7 numbers summing to 100, 2 decimal places)
    function generateRandomDayOfWeek() {
      let arr = Array(7).fill(0).map(() => Math.random());
      const sum = arr.reduce((a, b) => a + b, 0);
      arr = arr.map(v => v / sum * 100);
      // Round to 2 decimals, and fix sum to exactly 100
      const rounded = arr.map((v, i) => i < 6 ? Math.round(v * 100) / 100 : 0);
      rounded[6] = Math.round((100 - rounded.slice(0, 6).reduce((a, b) => a + b, 0)) * 100) / 100;
      return rounded;
    }
    const dayOfWeek = generateRandomDayOfWeek();
    const student = {
      id,
      academicProgramId,
      name,
      class: className,
      section,
      engagementLevel,
      attendance: { percent, total: totalClasses, attended, missed },
      quiz: { completed: quizTotal, correctAnswers: quizCorrect, totalQuestions: quizTotal },
      liveTests: { total: liveTotal, completed: liveCompleted, avgScore, avgTime },
      streak: { longest: streakLongest },
      studyTime: { total: studyTotal, october: studyOct, november: studyNov, december: studyDec },
      finalScore,
      dayOfWeek,
    };
    students.push(student);
    
    // Pre-load the student data before navigating
    setStudentIds(id, academicProgramId);
    navigate(`/${id}/${academicProgramId}`);
  }

  const handleStudentSelect = (studentId: string, academicProgramId: string) => {
    // Pre-load the student data before navigating
    setStudentIds(studentId, academicProgramId);
    navigate(`/${studentId}/${academicProgramId}`);
  };

  return (
    <div className="slide-container flex flex-col justify-start px-2 items-center min-h-screen" style={{ height: 'var(--real-vh)' }}>
      <div className="gradient-bg" />

      <div className="card-oval w-[90vw] max-w-[400px] flex flex-col items-center py-6 mb-4 mt-16 fade-in-slide visible">
      <p className="text-gray-600 font-noto-bengali text-sm mb-4">Select a student:</p>
        <div className="flex flex-col gap-4 w-full">
          {students.map((student) => (
            <button
              key={student.id + '-' + student.academicProgramId}
              className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center border border-[#F9D7EC] hover:bg-[#FFF7FB] transition cursor-pointer w-full"
              onClick={() => handleStudentSelect(student.id, student.academicProgramId)}
            >
              <span className="text-gray-600 font-noto-bengali text-sm">{student.name}</span>
              <span className="text-m font-noto-bengali font-semibold text-shikho-blue">{typeMap[student.engagementLevel] || student.engagementLevel}</span>
            </button>
          ))}
        </div>
        <div className="w-full border-t border-gray-200 my-6"></div>
        <button
          className="bg-shikho-yellow text-shikho-blue font-noto-bengali font-bold rounded-full text-base px-4 py-2 mt-2 shadow-lg w-full"
          onClick={generateRandomStudent}
        >
          Generate Random Student
        </button>
      </div>
    </div>
  );
}; 