import { WelcomeSlide } from './components/WelcomeSlide';
import { LiveClassSlide } from './components/LiveClassSlide';
import { DayOfWeekSlide } from './components/DayOfWeekSlide';
import { LiveTestSlide } from './components/LiveTestSlide';
import { StreakTrackerSlide } from './components/StreakTrackerSlide';
import { StudyTimeSlide } from './components/StudyTimeSlide';
import { FinalCongratsSlide } from './components/FinalCongratsSlide';
import { BrowserRouter, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { TestPage } from './components/TestPage';
import { StudentDataProvider, useStudentDataContext } from './context/StudentDataContext';
import type { ReportMode } from './context/StudentDataContext';
import { RouteGuard } from './components/RouteGuard';
import { ReportSelectionScreen } from './components/ReportSelectionScreen';
import { YearlyStudyTimeSlide } from './components/YearlyStudyTimeSlide';
import { YearlySubjectPodiumSlide } from './components/YearlySubjectPodiumSlide';

function WelcomeSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <WelcomeSlide studentData={studentData!} onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/class`)} />
    </RouteGuard>
  );
}

function LiveClassSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <LiveClassSlide
        studentData={studentData!}
        onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}`)}
        onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/livetest`)}
      />
    </RouteGuard>
  );
}

function LiveTestSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData, reportMode } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <LiveTestSlide
        studentData={studentData!}
        onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/class`)}
        onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/${reportMode === 'YEARLY' ? 'podium' : 'weekday'}`)}
      />
    </RouteGuard>
  );
}

function DayOfWeekSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData, reportMode } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <DayOfWeekSlide
        studentData={studentData!}
        onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/${reportMode === 'YEARLY' ? 'podium' : 'livetest'}`)}
        onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/streak`)}
      />
    </RouteGuard>
  );
}

function StudyTimeSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData, reportMode } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      {reportMode === 'YEARLY' ? (
        <YearlyStudyTimeSlide
          studentData={studentData!}
          data={studentData?.yearlyStudyTime}
          onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/streak`)}
          onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/final`)}
        />
      ) : (
        <StudyTimeSlide
          studentData={studentData!}
          onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/streak`)}
          onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/final`)}
        />
      )}
    </RouteGuard>
  );
}

function YearlySubjectPodiumSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <YearlySubjectPodiumSlide
        studentData={studentData!}
        onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/livetest`)}
        onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/weekday`)}
      />
    </RouteGuard>
  );
}




function StreakTrackerSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <StreakTrackerSlide
        studentData={studentData!}
        onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/weekday`)}
        onNext={() => navigate(`/${studentId}/${academicProgramId}/${mode}/studytime`)}
      />
    </RouteGuard>
  );
}

function FinalCongratsSlideRoute() {
  const { studentId, academicProgramId, mode } = useParams<{ studentId: string; academicProgramId: string; mode: string }>();
  const { studentData } = useStudentDataContext();
  const navigate = useNavigate();
  
  return (
    <RouteGuard>
      <FinalCongratsSlide
        studentData={studentData!}
        onPrev={() => navigate(`/${studentId}/${academicProgramId}/${mode}/studytime`)}
        onNext={() => {}}
      />
    </RouteGuard>
  );
}

function ReportSelectionRoute() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  const navigate = useNavigate();
  const { setReportMode } = useStudentDataContext();

  const handleSelectMode = (mode: ReportMode) => {
    setReportMode(mode);
    const slug = mode === 'YEARLY' ? 'yearly' : 'quarterly';
    navigate(`/${studentId}/${academicProgramId}/${slug}`);
  };

  return (
    <RouteGuard>
      <ReportSelectionScreen onSelectMode={handleSelectMode} />
    </RouteGuard>
  );
}

function RedirectToSelection() {
  const { studentId, academicProgramId } = useParams<{ studentId: string; academicProgramId: string }>();
  return <Navigate to={`/${studentId}/${academicProgramId}/select-mode`} replace />;
}

function App() {
  return (
    <StudentDataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path=":studentId/:academicProgramId" element={<RedirectToSelection />} />
          <Route path=":studentId/:academicProgramId/select-mode" element={<ReportSelectionRoute />} />
          <Route path=":studentId/:academicProgramId/:mode" element={<WelcomeSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/class" element={<LiveClassSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/livetest" element={<LiveTestSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/podium" element={<YearlySubjectPodiumSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/weekday" element={<DayOfWeekSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/studytime" element={<StudyTimeSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/streak" element={<StreakTrackerSlideRoute />} />
          <Route path=":studentId/:academicProgramId/:mode/final" element={<FinalCongratsSlideRoute />} />
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center text-xl">Please provide a valid URL.</div>} />
        </Routes>
      </BrowserRouter>
    </StudentDataProvider>
  );
}

export default App;
