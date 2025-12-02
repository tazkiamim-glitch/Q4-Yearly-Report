import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShare } from '../hooks/useShare';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getGradientClass } from '../utils/gradientManager';
import { getStudentTexts } from '../utils/studentTexts';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { StudentData } from '../utils/mockStudents';
import type { EngagementLevel } from '../utils/studentTexts';
import type { ReportMode } from '../context/StudentDataContext';

export interface YearlyStudyTimeData {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  totalHours: string;
}

interface YearlyStudyTimeSlideProps {
  studentData: StudentData;
  onPrev: () => void;
  onNext?: () => void;
  data?: YearlyStudyTimeData;
}

const defaultData: YearlyStudyTimeData = {
  q1: '42h',
  q2: '55h',
  q3: '60h',
  q4: '48h',
  totalHours: '205h',
};

export const YearlyStudyTimeSlide = ({ studentData, onPrev, onNext, data }: YearlyStudyTimeSlideProps) => {
  const resolvedData = data ?? studentData.yearlyStudyTime ?? defaultData;

  const gradientClass = getGradientClass('studyTime', studentData.engagementLevel as EngagementLevel);
  const { reportMode: contextReportMode } = useStudentDataContext();
  const { mode } = useParams<{ mode?: string }>();
  const reportMode: ReportMode = mode?.toLowerCase() === 'yearly' ? 'YEARLY' : contextReportMode;
  const texts = getStudentTexts('studyTime', studentData.engagementLevel as EngagementLevel, reportMode);
  const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({
    shareTitle: 'Shikho Year Wrapped',
    shareText: 'Check out my Shikho 2025 Year Wrapped!',
    fileName: 'shikho-year-wrapped.png',
  });

  const formatHours = (value: string) => {
    const digits = value.replace(/[^\d]/g, '') || '0';
    const bengali = digits
      .split('')
      .map((d) => toBengaliNumber(Number(d)))
      .join('');
    return `${bengali} ঘণ্টা`;
  };

  const totalHoursBn = formatHours(resolvedData.totalHours);

  // Reusable SVG path data for the road (used by both road strokes and the car animation)
  const ROAD_PATH_D = 'M -10 100 C 60 100, 80 40, 160 40 S 260 100, 350 100';

  return (
    <div className={`slide-container flex flex-col items-center justify-center px-2 relative${hideUI ? ' sharing-mode' : ''}`}>
      <img
        src="/shikho_logo.png"
        alt="Shikho Logo"
        className="absolute z-50 left-1/2 -translate-x-1/2 w-10 h-10 h-sm:w-14 h-sm:h-14 h-md:w-16 h-md:h-16"
        style={{ top: 30 }}
      />

      <div className={gradientClass} />

      {!hideUI && (
        <div className="fixed-dot-indicator">
          {[...Array(7)].map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === 5 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`} />
          ))}
        </div>
      )}

      <div className="card-oval w-[55vw] max-w-[420px] flex flex-col items-center p-4 mb-6 fade-in-slide visible overflow-visible">
        <div className="text-center mb-0 px-3">
          <h1 className="text-[#354894] text-xl font-bold text-center font-noto-bengali">
            {texts.header}
          </h1>
        </div>
        {/* Roadmap Visualization - Horizontal */}
        <div className="relative w-full px-2 mt-16" style={{ height: 180 }}>
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 340 160"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <defs>
              {/* Pin gradients */}
              <linearGradient id="pinQ1" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="pinQ2" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="pinQ3" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
              <linearGradient id="pinQ4" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>

            {/* Road path */}
            <motion.path
              id="roadPath"
              d={ROAD_PATH_D}
              stroke="#6B7280"
              strokeWidth={30}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
            />
            {/* Center dashed line */}
            <motion.path
              d={ROAD_PATH_D}
              stroke="#FFFFFF"
              strokeWidth={2}
              strokeDasharray="8 8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.3, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            />

            {/* Animated car traveling along the road */}
            <g opacity="0">
              <g transform="translate(-10, -8)">
                <g transform="scale(1.25)">
                  {/* Simple sedan body */}
                  <path
                    d="M17,11c-0.3,0-0.6,0-0.9-0.1c-0.8-1.7-2.4-2.9-4.3-2.9c-1.9,0-3.6,1.2-4.3,2.9c-0.3,0-0.6,0.1-0.9,0.1c-2.2,0-4-1.8-4-4v-1c0-1.7,1.3-3,3-3h13c1.7,0,3,1.3,3,3v1C21,9.2,19.2,11,17,11z"
                    fill="#EFAD1E"
                    stroke="#B45309"
                    strokeWidth="0.4"
                  />
                  {/* Wheels */}
                  <circle cx="6.8" cy="11.2" r="1.3" fill="#111827" />
                  <circle cx="16.8" cy="11.2" r="1.3" fill="#111827" />
                  {/* Windshield highlight */}
                  <rect x="12" y="5.2" width="3" height="1.2" fill="#FFFFFF" opacity="0.6" rx="0.3" />
                </g>
              </g>
              <animate attributeName="opacity" from="0" to="1" begin="0.5s" dur="0.01s" fill="freeze" />
              <animateMotion dur="2.5s" begin="0.5s" fill="freeze" rotate="auto">
                <mpath xlinkHref="#roadPath" />
              </animateMotion>
            </g>

            {/* Milestone pins with labels above */}
            {/* Q1 ~15% */}
            <g></g>

            {/* Q2 ~40% */}
            <g></g>

            {/* Q3 ~65% */}
            <g></g>

            {/* Q4 ~90% */}
            <g></g>
          </motion.svg>

          {/* Grouped animated map pins (label + connector + pin) */}
          {/* Q1 - left 10%, above road */}
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.2 }}
            className="absolute flex flex-col items-center"
            style={{ left: '10%', top: '32%', transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-white rounded px-1 text-center leading-tight z-10 shadow-md">
              <div className="text-[10px] font-noto-bengali font-semibold text-blue-500">কোয়ার্টার ১</div>
              <div className="text-[10px] font-noto-bengali text-gray-700">{formatHours(resolvedData.q1)}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="pinG1" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#pinG1)" />
              <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
            </svg>
          </motion.div>

          {/* Q2 - left 35%, below road */}
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.5 }}
            className="absolute flex flex-col items-center"
            style={{ left: '35%', top: '12%', transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-white rounded px-1 text-center leading-tight z-10 shadow-md">
              <div className="text-[10px] font-noto-bengali font-semibold text-emerald-500">কোয়ার্টার ২</div>
              <div className="text-[10px] font-noto-bengali text-gray-700">{formatHours(resolvedData.q2)}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="pinG2" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#pinG2)" />
              <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
            </svg>
          </motion.div>

          {/* Q3 - left 60%, above road */}
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.8 }}
            className="absolute flex flex-col items-center"
            style={{ left: '60%', top: '26%', transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-white rounded px-1 text-center leading-tight z-10 shadow-md">
              <div className="text-[10px] font-noto-bengali font-semibold text-amber-500">কোয়ার্টার ৩</div>
              <div className="text-[10px] font-noto-bengali text-gray-700">{formatHours(resolvedData.q3)}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="pinG3" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#pinG3)" />
              <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
            </svg>
          </motion.div>

          {/* Q4 - left 85%, below road */}
          <motion.div
            initial={{ y: -300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 1.1 }}
            className="absolute flex flex-col items-center"
            style={{ left: '85%', top: '48%', transform: 'translate(-50%, -100%)' }}
          >
            <div className="bg-white rounded px-1 text-center leading-tight z-10 shadow-md">
              <div className="text-[10px] font-noto-bengali font-semibold text-pink-500">কোয়ার্টার ৪</div>
              <div className="text-[10px] font-noto-bengali text-gray-700">{formatHours(resolvedData.q4)}</div>
            </div>
            <svg width="28" height="28" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="pinG4" x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F43F5E" />
                </linearGradient>
              </defs>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="url(#pinG4)" />
              <circle cx="12" cy="9" r="4" fill="#FFFFFF" />
            </svg>
          </motion.div>
        </div>

        {/* Total hours & footer inside card */}
        <div className="w-full px-3 mt-4 mb-0">
          <div className="rounded-xl bg-gray-50 p-2 sm:p-2.5 text-center">
            <p className="text-xl sm:text-2xl font-semibold text-shikho-blue">{totalHoursBn}</p>
            <p className="text-slate-600 mt-1 font-noto-bengali text-sm">সারা বছরের অর্জন</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm text-center font-medium font-noto-bengali px-4 mt-2 mb-2">
          {texts.footer}
        </p>

      </div>
      {!hideUI && (
        <>
          <ArrowButton
            direction="left"
            onClick={onPrev}
            className="fixed top-1/2 -translate-y-1/2 z-30"
            style={{ left: -5 }}
          />
          {onNext && (
            <ArrowButton
              direction="right"
              onClick={onNext}
              className="fixed top-1/2 -translate-y-1/2 z-30"
              style={{ right: -5 }}
            />
          )}
        </>
      )}

      {!hideUI && (
        <div className="w-full flex justify-center z-30 mt-4">
          <button
            className="fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 bg-shikho-yellow text-shikho-blue font-noto-bengali font-bold rounded-full text-base px-4 py-2 sm:text-lg sm:px-8 sm:py-3 shadow-lg"
            onClick={handleShare}
            style={{ maxWidth: '90vw' }}
          >
            শেয়ার করো!
          </button>
        </div>
      )}

      <div className="fixed left-1/2 bottom-16 mb-2 z-30 text-center student-name-display">
        <p className="text-gray-500 font-noto-bengali text-sm">
          <span className="font-semibold">{studentData.name}</span> • {studentData.class}
        </p>
      </div>

      <FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
    </div>
  );
};

