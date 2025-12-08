import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { BuntingOverlay } from './BuntingOverlay';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { EngagementLevel } from '../utils/studentTexts';
import type { StudentData } from '../utils/mockStudents';
import type { ReportMode } from '../context/StudentDataContext';

interface StreakTrackerSlideProps {
  studentData: StudentData;
  onPrev: () => void;
  onNext?: () => void;
}

export const StreakTrackerSlide = ({ studentData, onPrev, onNext }: StreakTrackerSlideProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({});
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
  const streak = reportMode === 'QUARTERLY' ? 15 : studentData.streak.longest;
  // Calculate streak boxes
  let boxes: number[] = [];
  if (streak === 0) {
    boxes = [0];
  } else {
    // Always try to show 7 boxes if possible
    const end = streak + 1; // The next day after the current streak
    const start = Math.max(1, end - 6); // 7 boxes: end, end-1, ..., start
    for (let i = start; i <= end; i++) {
      boxes.push(i);
    }
    // If streak is too small, boxes will be less than 7
  }

  // Animation state for streak boxes
  const [activeBoxes, setActiveBoxes] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  useEffect(() => {
    setActiveBoxes(0);
    if (streak === 0) return;

    let timeout: number;
    function animate(idx: number) {
      setActiveBoxes(idx);
      if (idx < boxes.length - 1) { // Animate up to the last filled box
        timeout = setTimeout(() => animate(idx + 1), 120);
      }
    }
    animate(0);
    return () => clearTimeout(timeout);
  }, [streak, boxes.length]);

  const texts = getStudentTexts('streakTracker', studentData.engagementLevel as EngagementLevel, reportMode);
  const gradientClass = getGradientClass('streakTracker', studentData.engagementLevel as EngagementLevel);

  return (
    <>
      <div className={`slide-container flex flex-col items-center justify-center px-2 py-2 relative${reportMode === 'YEARLY' ? ' final-yearly' : ''}${hideUI ? ' sharing-mode' : ''}`}>
        {/* Shikho logo - positioned inside slide container to be captured in screenshot */}
        <img
          src="/shikho_logo.png"
          alt="Shikho Logo"
          className="absolute z-50 left-1/2 -translate-x-1/2 w-10 h-10 h-sm:w-14 h-sm:h-14 h-md:w-16 h-md:h-16"
          style={{ top: 40 }}
        />

        {reportMode === 'YEARLY' ? (
          <>
            <div className="gradient-bg-final-yearly" />
            <div className="pointer-events-none fixed inset-0 bg-white/35" />
            <BuntingOverlay />
          </>
        ) : (
          <div className={gradientClass} />
        )}
        {/* Dot indicators */}
        {!hideUI && (
          <div className="fixed-dot-indicator">
            {(() => {
              const dotCount = reportMode === 'YEARLY' ? 8 : 7;
              const activeIndex = reportMode === 'YEARLY' ? 5 : 4;
              return [...Array(dotCount)].map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
                />
              ));
            })()}
          </div>
        )}
        {/* Card */}
        <div ref={cardRef} className={`card-oval card-responsive flex flex-col items-center py-4 mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}>
          {/* Header */}
          <div className="text-center mb-1 mt-1">
            <h1 className={`text-[#354894] font-bold text-center font-noto-bengali ${reportMode === 'YEARLY' ? 'text-xl' : 'text-lg'}`}>{texts.header}</h1>
          </div>
          {/* Streak Boxes */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 my-4 w-full">
            {boxes.map((num, idx) => {
              // For streak 0, only one box, styled as grey
              if (streak === 0) {
                return (
                  <span
                    key={num}
                    className="w-full min-w-0 h-8 flex items-center justify-center px-1.5 sm:px-2 rounded-md font-bold text-base sm:text-lg font-noto-bengali bg-gray-200 text-gray-400 border border-gray-300 streak-box-text"
                  >
                    <span className="streak-box-number">{toBengaliNumber(num)}</span>
                  </span>
                );
              }
              // For streak > 0
              const isLast = idx === boxes.length - 1;
              return (
                <span
                  key={num}
                  className={`w-full min-w-0 h-8 flex items-center justify-center px-1.5 sm:px-2 rounded-md font-bold text-base sm:text-lg font-noto-bengali transition-colors duration-300 streak-box-text
                    ${isLast
                      ? 'bg-gray-200 text-gray-400 border border-gray-300'
                      : idx < activeBoxes
                        ? 'bg-shikho-pink text-white'
                        : 'bg-gray-200 text-gray-200 border border-gray-200'}`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  {isLast
                    ? <span style={{
                        opacity: activeBoxes >= boxes.length - 1 ? 1 : 0,
                        transition: 'opacity 0.3s',
                        transitionDelay: `${(idx + 1) * 100}ms`
                      }}><span className="streak-box-number">{toBengaliNumber(num)}</span></span>
                    : <span className="streak-box-number">{toBengaliNumber(num)}</span>
                  }
                </span>
              );
            })}
          </div>
          {/* Streak Stat */}
          <div className={`w-full flex flex-col items-center ${reportMode === 'YEARLY' ? 'bg-gray-50' : 'bg-white'} rounded-xl py-6 mt-1 mb-1`}>
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-500 font-noto-bengali font-medium mb-1">সর্বোচ্চ স্ট্রিক</span>
              <span className="text-5xl fire-emoji" role="img" aria-label="fire">🔥</span>
              <span className="text-shikho-pink font-bold text-3xl mt-2 streak-stats-text">{toBengaliNumber(streak)} দিন</span>
            </div>
          </div>
          {/* Footer with delta-based message */}
          {reportMode === 'QUARTERLY' && studentData.lastQuarter ? (() => {
            const currentDays = studentData.streak.longest;
            const lastDays = studentData.lastQuarter.streak.longest;
            const deltaDays = currentDays - lastDays;
            
            return (
              <div className="mt-3 md:mt-4 flex justify-center">
                <p className="text-[14px] md:text-[15px] text-gray-600 font-noto-bengali text-center">
                  {deltaDays > 0 ? (
                    <>
                    গত কোয়ার্টারে ছিল <span className="text-[#CF278D] font-semibold">{toBengaliNumber(lastDays)} দিন</span> - এভাবেই এগিয়ে যাও! 🔥
                  </>
                  ) : deltaDays === 0 ? (
                  <>
                    গত কোয়ার্টারেও ছিল <span className="text-[#CF278D] font-semibold">{toBengaliNumber(lastDays)} দিন</span><br />
                    ছোট্ট একটু ধাক্কায় নতুন রেকর্ড হবে! 🙂
                  </>
                  ) : (
                  <>
                    গত কোয়ার্টারে ছিল <span className="text-[#CF278D] font-semibold">{toBengaliNumber(lastDays)} দিন</span> - ওহো, পিছিয়ে গেলে নাকি?<br />
                    এবার ঘুরে দাঁড়াই! 💪
                  </>
                  )}
                </p>
              </div>
            );
          })() : (
            <div className="mt-3 md:mt-4 flex justify-center">
              <p className={`text-gray-600 text-center font-medium font-noto-bengali ${reportMode === 'YEARLY' ? 'text-sm' : 'text-[14px] md:text-[15px]'}`}>
                {texts.footer}
              </p>
            </div>
          )}
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