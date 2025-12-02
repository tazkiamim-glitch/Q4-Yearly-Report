import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Confetti } from './Confetti';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { EngagementLevel } from '../utils/studentTexts';
import type { ReportMode } from '../context/StudentDataContext';

interface WelcomeSlideProps {
  studentData: {
    name: string;
    class: string;
    section: string;
    attendance: {
      percent: number;
    };
    quiz: {
      correctAnswers: number;
      totalQuestions: number;
    };
    streak: {
      longest: number;
    };
    engagementLevel: string;
  };
  onNext?: () => void;
}

export const WelcomeSlide = ({ studentData, onNext }: WelcomeSlideProps) => {
  const quizPercentage = Math.round((studentData.quiz.correctAnswers / studentData.quiz.totalQuestions) * 100);
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    handleShare,
    modalOpen,
    setModalOpen,
    imgUrl,
    handleDownload,
    hideUI,
  } = useShare({});
  const [isVisible, setIsVisible] = useState(false);
  const { reportMode: contextReportMode } = useStudentDataContext();
  const { mode } = useParams<{ mode?: string }>();

  // Compute reportMode directly from URL parameter for immediate use
  const reportMode: ReportMode = mode?.toLowerCase() === 'yearly' ? 'YEARLY' : contextReportMode;

  const texts = getStudentTexts('welcome', studentData.engagementLevel as EngagementLevel, reportMode);
  const gradientClass = getGradientClass('welcome', studentData.engagementLevel as EngagementLevel);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <div className={`slide-container flex flex-col items-center justify-center px-2 relative${hideUI ? ' sharing-mode' : ''}`}>
        {/* Shikho logo - positioned inside slide container to be captured in screenshot */}
        <img
          src="/shikho_logo.png"
          alt="Shikho Logo"
          className="absolute z-50 left-1/2 -translate-x-1/2 w-10 h-10 h-sm:w-14 h-sm:h-14 h-md:w-16 h-md:h-16"
          style={{ top: 30 }}
        />

        {/* Gradient background */}
        <div className={gradientClass} />

        {/* Dot indicators */}
        {!hideUI && (
          <div className="fixed-dot-indicator">
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
              />
            ))}
          </div>
        )}

        {/* Oval card */}
        <div ref={cardRef} className={`card-oval w-[80vw] max-w-[80vw] flex flex-col items-center py-4 mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}>
          {/* Header */}
          {texts.header && (
            <div className="text-center mb-1 mt-1 px-2">
              <h1 className={`text-[#354894] font-bold text-center font-noto-bengali ${reportMode === 'YEARLY' ? 'text-xl' : 'text-lg'} mb-2`}>
                {texts.header}
              </h1>
            </div>
          )}

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-2">
            <div className="w-16 h-16 bg-shikho-pink bg-opacity-20 rounded-full flex items-center justify-center mb-1">
              <div className="w-8 h-8 text-shikho-pink text-3xl flex items-center justify-center welcome-student-emoji">
                👩‍🎓
              </div>
            </div>
            <h2 className="text-xl font-noto-bengali font-semibold mb-1 mt-2 text-shikho-blue">
              {studentData.name}
            </h2>
          </div>

          {/* Horizontal Stats Row */}
          <div className="w-full flex justify-between items-stretch gap-4 mb-1 mt-1">
            <div className="flex-1 min-w-0 bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center border border-[#F9D7EC] bg-[#FFF7FB]">
              <div className="flex flex-row items-baseline justify-center gap-1 whitespace-nowrap mb-1">
                <span className="text-2xl font-bold text-shikho-pink">{toBengaliNumber(studentData.attendance.percent)}</span>
                <span className="text-2xl font-bold text-shikho-pink">%</span>
              </div>
              <p className="text-gray-600 font-noto-bengali text-sm">ক্লাস উপস্থিতি</p>
            </div>
            <div className="flex-1 min-w-0 bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center border border-[#D6DBF7] bg-[#F7F8FF]">
              <div className="flex flex-row items-baseline justify-center gap-1 whitespace-nowrap mb-1">
                <span className="text-2xl font-bold text-shikho-blue">{toBengaliNumber(quizPercentage)}</span>
                <span className="text-2xl font-bold text-shikho-blue">%</span>
              </div>
              <p className="text-gray-600 font-noto-bengali text-sm">কুইজ স্কোর</p>
            </div>
            <div className="flex-1 min-w-0 bg-white rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center border border-[#FFE6A7] bg-[#FFFCF5]">
              <div className="flex flex-row items-baseline justify-center gap-1 whitespace-nowrap mb-0">
                <span className="text-2xl font-bold text-shikho-yellow">{toBengaliNumber(studentData.streak.longest)}</span>
                <span className="text-2xl font-bold text-shikho-yellow">দিন</span>
              </div>
              <p className="text-gray-600 font-noto-bengali text-sm mt-1">সর্বোচ্চ স্ট্রিক</p>
            </div>
          </div>
          <p className={`text-gray-600 text-center font-medium font-noto-bengali ${reportMode === 'YEARLY' ? 'text-sm' : 'text-sm'} mt-2`}>
          {texts.footer}
          </p>
        </div>

        {/* Right arrow button */}
        {!hideUI && (
          <ArrowButton
            direction="right"
            onClick={onNext}
            className="fixed top-1/2 -translate-y-1/2 z-30"
            style={{ right: -5 }}
          />
        )}

        {/* Class and section info above share button */}
        {!hideUI && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-20 z-30 text-center">
            <p className="text-gray-600 font-noto-bengali text-sm font-bold">
              {studentData.class}, {studentData.section}
            </p>
          </div>
        )}

        {/* Share button at the bottom */}
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

        {/* Confetti above everything */}
        <div className="pointer-events-none fixed inset-0 w-full h-full z-30">
          <Confetti />
        </div>

        {/* Fallback modal */}
        <FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
      </div>
    </>
  );
}; 