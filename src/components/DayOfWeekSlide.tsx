import { useRef, useEffect, useState } from 'react';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts, BENGALI_DAYS } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import type { EngagementLevel } from '../utils/studentTexts';
import type { StudentData } from '../utils/mockStudents';
import { FaCalendarCheck } from 'react-icons/fa';

interface DayOfWeekSlideProps {
  studentData: StudentData;
  onPrev: () => void;
  onNext?: () => void;
}

const BAR_MAX_HEIGHT = 120; // px
const BAR_MIN_HEIGHT = 32; // px
const BAR_ANIMATION_DURATION = 250; // ms

export const DayOfWeekSlide = ({ studentData, onPrev, onNext }: DayOfWeekSlideProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({});
  const [barHeights, setBarHeights] = useState(Array(7).fill(BAR_MIN_HEIGHT));
  const [isVisible, setIsVisible] = useState(false);
  const dayPercents = studentData.dayOfWeek;
  const maxIdx = dayPercents.indexOf(Math.max(...dayPercents));
  const texts = getStudentTexts('dayOfWeek', studentData.engagementLevel as EngagementLevel);
  const gradientClass = getGradientClass('dayOfWeek', studentData.engagementLevel as EngagementLevel);

  // Calculate proportional bar heights
  const maxPercent = Math.max(...dayPercents);
  const heights = dayPercents.map(p => {
    if (maxPercent === 0) return BAR_MIN_HEIGHT;
    return Math.round(BAR_MIN_HEIGHT + (BAR_MAX_HEIGHT - BAR_MIN_HEIGHT) * (p / maxPercent));
  });

  // Animate bar heights sequentially
  useEffect(() => {
    setIsVisible(true);
    let cancelled = false;
    const initial = Array(7).fill(BAR_MIN_HEIGHT);
    setBarHeights(initial);

    async function animateBars() {
      for (let i = 0; i < 7; i++) {
        if (cancelled) return;
        await new Promise<void>(resolve => {
          let start: number | null = null;
          function animate(ts: number) {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / BAR_ANIMATION_DURATION, 1);
            setBarHeights(prev => {
              const next = [...prev];
              next[i] = Math.round(BAR_MIN_HEIGHT + (heights[i] - BAR_MIN_HEIGHT) * progress);
              return next;
            });
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              resolve();
            }
          }
          requestAnimationFrame(animate);
        });
      }
    }
    animateBars();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [dayPercents.join(",")]);

  // Helper for Bengali number
  function toBn(num: number) {
    return toBengaliNumber(num);
  }

  return (
    <>
      <div className={`slide-container flex flex-col items-center justify-center px-2 relative${hideUI ? ' sharing-mode' : ''}`}>        
        {/* Shikho logo */}
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
                className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
              />
            ))}
          </div>
        )}
        {/* Card */}
        <div
          ref={cardRef}
          className={`card-oval w-[80vw] max-w-[80vw] flex flex-col items-center py-6 mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}
        >
          {/* Header */}
          <h2 className="text-shikho-blue text-lg font-noto-bengali mb-2 font-bold text-center">{texts.header}</h2>

          {/* Bar Chart (Flexbox) */}
          <div className="mb-8 w-full flex items-center justify-center" style={{ minHeight: 180 }}>
            <div className="flex items-end justify-between h-40 px-2 w-full max-w-xs mx-auto">
              {[...Array(7)].map((_, idx) => (
                <div className="flex flex-col items-center" key={idx} style={{ width: 24 }}>
                  <div
                    className={`mb-2 weekly-bar ${idx === maxIdx ? 'bg-shikho-pink' : 'bg-shikho-blue'} rounded-t-lg`}
                    style={{
                      height: barHeights[idx],
                      width: 22,
                      transition: `height ${BAR_ANIMATION_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Only show label on highest bar */}
                    {idx === maxIdx && (
                      <span
                        className="block text-center text-shikho-pink text-xs font-bold dayofweek-bar-label"
                        style={{
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          right: 0,
                          width: '100%',
                          lineHeight: 1,
                        }}
                      >
                        {toBn(Math.round(dayPercents[maxIdx]))}%
                      </span>
                    )}
                  </div>
                  <span className={`text-xs font-medium ${idx === maxIdx ? 'text-shikho-pink font-bold' : 'text-gray-600'} font-noto-bengali`}>{'SMTWTFS'[idx]}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Lower Card */}
          <div className="bg-gray-50 rounded-xl p-3 text-center w-full max-w-xs mx-auto">
            <div className="w-10 h-10 rounded-full bg-shikho-pink/20 flex items-center justify-center mx-auto mb-2">
              <FaCalendarCheck className="text-sm text-shikho-pink" />
            </div>
            <p className="text-xl font-bold mb-2 text-shikho-pink font-noto-bengali dayofweek-day-label">{BENGALI_DAYS[maxIdx]}</p>
            <p className="text-gray-600 text-xs font-noto-bengali">{texts.footer}</p>
          </div>
        </div>
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
        {/* Fallback modal */}
        <FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
      </div>
    </>
  );
}; 