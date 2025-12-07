import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { EngagementLevel } from '../utils/studentTexts';
import type { StudentData } from '../utils/mockStudents';
import type { ReportMode } from '../context/StudentDataContext';


interface LiveTestSlideProps {
  studentData: StudentData;
  onPrev: () => void;
  onNext?: () => void;
}

export const LiveTestSlide = ({ studentData, onPrev, onNext }: LiveTestSlideProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({});
  const liveTests = studentData.liveTests;
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const completedTarget = Math.round((liveTests.completed/liveTests.total)*100);
  const avgTimeTarget = 70; // static as before
  const avgScoreTarget = liveTests.avgScore;
  const { reportMode: contextReportMode } = useStudentDataContext();
  const { mode } = useParams<{ mode?: string }>();

  // Compute reportMode from URL parameter if present; otherwise fall back to context
  const normalizedMode = mode?.toLowerCase();
  const reportMode: ReportMode =
    normalizedMode === 'yearly'
      ? 'YEARLY'
      : normalizedMode === 'quarterly'
        ? 'QUARTERLY'
        : contextReportMode;

  const texts = getStudentTexts('liveTest', studentData.engagementLevel as EngagementLevel, reportMode);
  const gradientClass = getGradientClass('liveTest', studentData.engagementLevel as EngagementLevel);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1000;
    function animate(ts: number) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setProgress(prog);
      if (prog < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [liveTests]);

  const completedPercent = Math.round(progress * completedTarget);
  const avgTimePercent = Math.round(progress * avgTimeTarget);
  const avgScorePercent = Math.round(progress * avgScoreTarget);

  // Ensure bars are always rendered, even at 0%, to avoid delayed appearance
  // (No conditional rendering for the bar divs)

  // Convert avgTime to Bengali numbers and replace 'mins' with 'মিনিট'
  const avgTimeBn = toBengaliNumber(liveTests.avgTime.replace(/mins?/g, 'মিনিট'));

  return (
    <>
      <div className={`slide-container flex flex-col items-center justify-center px-2 relative${reportMode === 'YEARLY' ? ' final-yearly' : ''}${hideUI ? ' sharing-mode' : ''}`}>
        {/* Shikho logo - positioned inside slide container to be captured in screenshot */}
        <img
          src="/shikho_logo.png"
          alt="Shikho Logo"
          className="absolute z-50 left-1/2 -translate-x-1/2 w-10 h-10 h-sm:w-14 h-sm:h-14 h-md:w-16 h-md:h-16"
          style={{ top: 30 }}
        />

        {/* Background */}
        {reportMode === 'YEARLY' ? (
          <>
            <div className="gradient-bg-final-yearly" />
            <div className="pointer-events-none fixed inset-0 bg-white/45" />
          </>
        ) : (
          <div className={gradientClass} />
        )}
        {/* Dot indicators */}
        {!hideUI && (
          <div className="fixed-dot-indicator">
            {[...Array(7)].map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
              />
            ))}
          </div>
        )}
        {/* Card */}
        <div ref={cardRef} className={`card-oval card-responsive flex flex-col items-center py-4 mb-4 fade-in-slide${isVisible ? ' visible' : ''} ${reportMode === 'YEARLY' ? 'bg-gradient-to-b from-white to-[#EAF2FF]' : ''}`}>
          {/* Header */}
          <div className="text-center mb-1 mt-1">
            <h1 className="text-shikho-blue text-lg font-noto-bengali mb-2 font-bold">{texts.header}</h1>
          </div>
          {/* Progress Bars */}
          <div className="w-full space-y-4 mb-2">
            <div className={`${reportMode === 'YEARLY' ? 'bg-gray-50' : 'bg-white'} p-3 rounded-xl flex flex-col mb-0`}>
              <div className="flex justify-between mb-1">
                <span className="text-shikho-blue font-noto-bengali text-sm livetest-bar-value">{texts.completed}</span>
                <span className="text-shikho-blue font-noto-bengali text-sm font-bold livetest-bar-value">{toBengaliNumber(completedPercent)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-shikho-blue rounded-full transition-all duration-500" style={{ width: `${completedPercent}%` }} />
              </div>
            </div>
            <div className={`${reportMode === 'YEARLY' ? 'bg-gray-50' : 'bg-white'} p-3 rounded-xl flex flex-col mb-0`}>
              <div className="flex justify-between mb-1">
                <span className="text-shikho-pink font-noto-bengali text-sm livetest-bar-value">{texts.avgTime}</span>
                <span className="text-shikho-pink font-noto-bengali text-sm font-bold livetest-bar-value">{avgTimeBn}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-shikho-pink rounded-full transition-all duration-500" style={{ width: `${avgTimePercent}%` }} />
              </div>
            </div>
            <div className={`${reportMode === 'YEARLY' ? 'bg-gray-50' : 'bg-white'} p-3 rounded-xl flex flex-col mb-0`}>
              <div className="flex justify-between mb-1">
                <span className="text-shikho-yellow font-noto-bengali text-sm livetest-bar-value">{texts.avgScore}</span>
                <span className="text-shikho-yellow font-noto-bengali text-sm font-bold livetest-bengali-text livetest-bar-value">{toBengaliNumber(avgScorePercent)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-3 bg-shikho-yellow rounded-full transition-all duration-500" style={{ width: `${avgScorePercent}%` }} />
              </div>
            </div>
          </div>
          {/* Stats Row */}
          <div className={`w-full flex justify-around ${reportMode === 'YEARLY' ? 'bg-gray-50' : 'bg-white'} rounded-xl py-2 mt-1 mb-1`}>
            <div className="flex flex-col items-center livetest-stats-col">
              <span className="text-shikho-blue font-bold text-lg">{toBengaliNumber(liveTests.total)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">{texts.total}</span>
            </div>
            <div className="flex flex-col items-center livetest-stats-col">
              <span className="text-shikho-pink font-bold text-lg">{toBengaliNumber(liveTests.completed)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">{texts.done}</span>
            </div>
            <div className="flex flex-col items-center livetest-stats-col">
              <span className="text-shikho-yellow font-bold text-lg">{toBengaliNumber(liveTests.total - liveTests.completed)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">{texts.left}</span>
            </div>
          </div>
          <p className={`text-gray-600 font-noto-bengali text-center ${reportMode === 'YEARLY' ? 'text-sm font-medium' : 'text-sm'} mt-4`}>
          {texts.footer}
          </p>
          {/* Navigation */}
          {!hideUI && (
            <>
              <ArrowButton
                direction="left"
                onClick={onPrev}
                className="fixed top-1/2 -translate-y-1/2 z-30"
                style={{ left: -5 }}
              />
              <ArrowButton
                direction="right"
                onClick={onNext}
                className="fixed top-1/2 -translate-y-1/2 z-30"
                style={{ right: -5 }}
              />
            </>
          )}
        </div>
        {/* Share button at the bottom */}
        {!hideUI && (
          <div className="w-full flex justify-center z-30 mt-4">
            <button
              className={`fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 font-noto-bengali font-bold rounded-full text-base px-4 py-2 sm:text-lg sm:px-8 sm:py-3 shadow-lg ${reportMode === 'YEARLY' ? 'bg-white text-[#16325B]' : 'bg-shikho-yellow text-shikho-blue'}`}
              onClick={handleShare}
              style={{ maxWidth: '90vw', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
            >
              শেয়ার করো!
            </button>
          </div>
        )}
        {/* Student name and class - visible in both normal and sharing modes */}
        <div className="fixed left-1/2 bottom-16 mb-2 z-30 text-center student-name-display" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)' }}>
          <p className={`font-noto-bengali text-sm ${reportMode === 'YEARLY' ? 'text-gray-600' : 'text-gray-500'}`}>
            <span className='font-semibold'>{studentData.name}</span> • {studentData.class}
          </p>
        </div>
        {/* Fallback modal */}
        <FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
      </div>
    </>
  );
}; 