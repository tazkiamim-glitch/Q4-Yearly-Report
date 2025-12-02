import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Confetti } from './Confetti';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import { toBengaliOrdinal, getRankFromEngagementLevel } from '../utils/rank';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { StudentData } from '../utils/mockStudents';
import type { EngagementLevel } from '../utils/studentTexts';
import type { ReportMode } from '../context/StudentDataContext';

interface FinalCongratsSlideProps {
  studentData: StudentData;
  onPrev?: () => void;
  onNext?: () => void;
}

export const FinalCongratsSlide = ({ studentData, onPrev, onNext }: FinalCongratsSlideProps) => {
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
  // Use studentData for score and stars
  const score = studentData?.finalScore ?? 0;
  const total = 100;
  // Calculate stars: 1 per 20 points, max 5
  const stars = Math.min(5, Math.floor((score / total) * 5));

  // Animated score state
  const [animatedScore, setAnimatedScore] = useState(0);
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 800;
    function animate(ts: number) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setAnimatedScore(Math.floor(prog * score));
      if (prog < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const { reportMode: contextReportMode } = useStudentDataContext();
  const { mode } = useParams<{ mode?: string }>();
  
  // Compute reportMode directly from URL parameter for immediate use
  const reportMode: ReportMode = mode?.toLowerCase() === 'yearly' ? 'YEARLY' : contextReportMode;
  const texts = getStudentTexts('finalCongrats', studentData.engagementLevel as EngagementLevel, reportMode);
  const gradientClass = getGradientClass('finalCongrats', studentData.engagementLevel as EngagementLevel);

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
                className={`w-2 h-2 rounded-full ${i === 6 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
              />
            ))}
          </div>
        )}
        {/* Card */}
        <div ref={cardRef} className={`card-oval w-[80vw] max-w-[80vw] flex flex-col items-center py-2 mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}>
          {/* Trophy Icon */}
          <div className="w-16 h-16 trophy-gradient-bg rounded-full flex items-center justify-center mb-2">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 10a8 8 0 0 0 16 0V8a2 2 0 0 0-2-2H14a2 2 0 0 0-2 2v2Z" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 10v2a12 12 0 0 0 24 0v-2" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 26v6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 36h8" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 10h4m20 0h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          {/* Header */}
          <div className="text-center mb-1 mt-1">
            <h1 className={`text-[#354894] font-bold text-center font-noto-bengali ${reportMode === 'YEARLY' ? 'text-xl' : 'text-xl'} mb-2`}>{texts.header}</h1>
            <p className="text-gray-600 font-noto-bengali text-base">
            
            </p>
          </div>
          {/* Rank Line */}
          <div className="text-center mb-2 animate-pop">
            <div className="text-[#CF278D] font-extrabold font-noto-bengali" style={{ fontSize: 'clamp(14px, 3.5vw, 18px)' }}>
              তোমার পজিশন: {toBengaliOrdinal(getRankFromEngagementLevel(studentData.engagementLevel))}
            </div>
          </div>
          {/* Score Card */}
          <div className="w-full flex flex-col items-center score-gradient-bg rounded-xl py-4 mt-2 mb-4 relative shadow-sm">
            {/* Left arrow */}
            {onPrev && !hideUI && (
              <ArrowButton
                direction="left"
                onClick={onPrev}
                className="fixed top-1/2 -translate-y-1/2 z-30"
                style={{ left: -5 }}
              />
            )}
            {/* Score */}
            <div className="text-center">
              <div className="text-gray-700 font-noto-bengali text-sm mb-1">{texts.scoreLabel}</div>
              <div className="text-shikho-blue font-extrabold text-4xl mb-1">
                <span className="finalcongrats-score-number">{toBengaliNumber(animatedScore)}<span className="text-2xl font-normal"> / </span>{toBengaliNumber(total)}</span>
              </div>
              {/* Stars */}
              <div className="flex justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill={i < stars ? '#FFD600' : '#E5E7EB'}
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-0.5"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          
          </div>
          {/* Next Term Button */}
          {!hideUI && (
            <button
              className="w-full btn-gradient-cta font-noto-bengali font-bold rounded-full text-base px-4 py-3 mt-2 mb-2 shadow-lg transition"
              onClick={onNext}
            >
              {texts.nextTerm}
            </button>
          )}
        </div>
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
        {/* Student name and class - visible in both normal and sharing modes */}
        <div className="fixed left-1/2 bottom-16 mb-2 z-30 text-center student-name-display">
          <p className="text-gray-500 font-noto-bengali text-sm">
            <span className='font-semibold'>{studentData.name}</span> • {studentData.class}
          </p>
        </div>
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