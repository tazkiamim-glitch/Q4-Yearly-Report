import { WelcomeSlide } from './components/WelcomeSlide';
import { LiveClassSlide } from './components/LiveClassSlide';
import { DayOfWeekSlide } from './components/DayOfWeekSlide';
import { LiveTestSlide } from './components/LiveTestSlide';
import { StreakTrackerSlide } from './components/StreakTrackerSlide';
import { StudyTimeSlide } from './components/StudyTimeSlide';
import { FinalCongratsSlide } from './components/FinalCongratsSlide';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { TestPage } from './components/TestPage';
import { StudentDataProvider, useStudentDataContext } from './context/StudentDataContext';
import { RouteGuard } from './components/RouteGuard';

function WelcomeSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <WelcomeSlide studentData={studentData!} onNext={() => navigate(`/${studentId}/${academicProgramId}/class`)} />
    </RouteGuard>
  );
}

function LiveClassSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <LiveClassSlide studentData={studentData!} onPrev={() => navigate(`/${studentId}/${academicProgramId}`)} onNext={() => navigate(`/${studentId}/${academicProgramId}/livetest`)} />
    </RouteGuard>
  );
}

function LiveTestSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <LiveTestSlide studentData={studentData!} onPrev={() => navigate(`/${studentId}/${academicProgramId}/class`)} onNext={() => navigate(`/${studentId}/${academicProgramId}/weekday`)} />
    </RouteGuard>
  );
}

function DayOfWeekSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <DayOfWeekSlide studentData={studentData!} onPrev={() => navigate(`/${studentId}/${academicProgramId}/livetest`)} onNext={() => navigate(`/${studentId}/${academicProgramId}/streak`)} />
    </RouteGuard>
  );
}

function StudyTimeSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <StudyTimeSlide studentData={studentData!} onPrev={() => navigate(`/${studentId}/${academicProgramId}/streak`)} onNext={() => navigate(`/${studentId}/${academicProgramId}/final`)} />
    </RouteGuard>
  );
}




function StreakTrackerSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <StreakTrackerSlide studentData={studentData!} onPrev={() => navigate(`/${studentId}/${academicProgramId}/weekday`)} onNext={() => navigate(`/${studentId}/${academicProgramId}/studytime`)} />
    </RouteGuard>
  );
}

function FinalCongratsSlideRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <FinalCongratsSlide studentData={studentData!} onPrev={() => navigate(`/${studentId}/${academicProgramId}/studytime`)} onNext={() => {}} />
    </RouteGuard>
  );
}

function App() {
  return (
    <StudentDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path=":studentId/:academicProgramId" element={<WelcomeSlideRoute />} />
          <Route path=":studentId/:academicProgramId/class" element={<LiveClassSlideRoute />} />
          <Route path=":studentId/:academicProgramId/livetest" element={<LiveTestSlideRoute />} />
          <Route path=":studentId/:academicProgramId/weekday" element={<DayOfWeekSlideRoute />} />
          <Route path=":studentId/:academicProgramId/studytime" element={<StudyTimeSlideRoute />} />
          <Route path=":studentId/:academicProgramId/streak" element={<StreakTrackerSlideRoute />} />
          <Route path=":studentId/:academicProgramId/final" element={<FinalCongratsSlideRoute />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-xl">Please provide a student ID and academic program ID in the URL.</div>} />
        </Routes>
      </BrowserRouter>
    </StudentDataProvider>
  );
}

export default App;
