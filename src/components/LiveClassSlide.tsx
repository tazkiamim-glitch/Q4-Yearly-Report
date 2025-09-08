import { useRef, useEffect, useState } from 'react';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import type { EngagementLevel } from '../utils/studentTexts';
import type { StudentData } from '../utils/mockStudents';

interface LiveClassSlideProps {
  studentData: StudentData;
  onPrev: () => void;
  onNext?: () => void;
}

export const LiveClassSlide = ({ studentData, onPrev, onNext }: LiveClassSlideProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({});
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const percent = studentData.attendance.percent;
  const texts = getStudentTexts('liveClass', studentData.engagementLevel as EngagementLevel);
  const gradientClass = getGradientClass('liveClass', studentData.engagementLevel as EngagementLevel);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1000;
    function animate(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setAnimatedPercent(Math.round(progress * percent * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [percent]);

  // Pie chart dimensions
  const size = 160;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - animatedPercent / 100);

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
                className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
              />
            ))}
          </div>
        )}
        {/* Card */}
        <div
          ref={cardRef}
          className={`card-oval w-[80vw] max-w-[80vw] flex flex-col items-center py-4 mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}
        >
          {/* Header */}
          <div className="text-center mb-1 mt-1">
            <h1 className="text-shikho-blue text-lg font-noto-bengali mb-2 font-bold">{texts.header}</h1>
          </div>
          {/* Pie Chart */}
          <div className="flex flex-col items-center my-2 relative" style={{ height: size, width: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={stroke}
                fill="none"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#CF278D"
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s' }}
              />
            </svg>
            <div
              className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center"
              style={{ transform: 'translate(-50%, -50%)', width: '100%', pointerEvents: 'none' }}
            >
              <span className="text-4xl font-bold text-shikho-pink liveclass-pie-number" style={{ lineHeight: 1 }}>{toBengaliNumber(animatedPercent)}%</span>
              <span className="text-shikho-blue font-noto-bengali text-base" style={{ marginTop: 0 }}>{'উপস্থিতি'}</span>
            </div>
          </div>
          {/* Stats */}
          <div className="w-full flex justify-around bg-gray-50 rounded-xl py-2 mt-1 mb-1">
            <div className="flex flex-col items-center liveclass-stats-col">
              <span className="text-shikho-blue font-bold text-lg">{toBengaliNumber(studentData.attendance.total)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">মোট ক্লাস</span>
            </div>
            <div className="flex flex-col items-center liveclass-stats-col">
              <span className="text-shikho-pink font-bold text-lg">{toBengaliNumber(studentData.attendance.attended)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">উপস্থিত</span>
            </div>
            <div className="flex flex-col items-center liveclass-stats-col">
              <span className="text-shikho-red font-bold text-lg">{toBengaliNumber(studentData.attendance.missed)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">অনুপস্থিত</span>
            </div>
            
          </div>
          {/* Footer with delta-based message */}
          {studentData.lastQuarter && (() => {
            const currentPct = studentData.attendance.percent;
            const lastPct = studentData.lastQuarter.attendance.percent;
            const deltaPct = Math.round(currentPct - lastPct);
            const bnDelta = toBengaliNumber(Math.abs(deltaPct)) + '%';
            
            let footerText = '';
            if (deltaPct > 0) {
              footerText = `দারুণ! গত কোয়ার্টারের চেয়ে ${bnDelta} বেশি ক্লাসে উপস্থিত ছিলে—চালিয়ে যাও! 🔥`;
            } else if (deltaPct === 0) {
              footerText = `গত কোয়ার্টারের মতোই চলছে—এবার এক ধাপ এগোই! 🙂`;
            } else {
              footerText = `গত কোয়ার্টার থেকে ${bnDelta} কম ক্লাসে উপস্থিত ছিলে— ছোট্ট একটা ধাক্কার প্রয়োজন! 💪`;
            }
            
            return (
              <p className="text-[14px] md:text-[15px] text-gray-600 font-noto-bengali text-center mt-4">
                {deltaPct > 0 ? (
                  <>
                    দারুণ! গত কোয়ার্টারের চেয়ে <span className="text-[#CF278D] font-semibold">{toBengaliNumber(Math.abs(deltaPct))}%</span> বেশি ক্লাসে উপস্থিত ছিলে!<br />চালিয়ে যাও! 🔥
                  </>
                  ) : deltaPct === 0 ? (
                    <>
                      গত কোয়ার্টারের মতোই চলছে! 🤔<br />আগামী কোয়ার্টারে এক ধাপ এগোই! 🙂
                    </>
                  ) : (
                  <>
                    গত কোয়ার্টার থেকে <span className="text-[#CF278D] font-semibold">{toBengaliNumber(Math.abs(deltaPct))}%</span> কম ক্লাসে উপস্থিত ছিলে 😔<br />আগামী কোয়ার্টারে করো বাজিমাত! 💪
                  </>
                )}
              </p>
            );
          })()}
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
        <div className="pointer-events-none fixed inset-0 w-full h-full z-30">
          {/* Confetti can be added here if needed */}
        </div>
        {/* Fallback modal */}
        <FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
        {/* Reuse WelcomeSlide's FallbackModal if needed */}
      </div>
    </>
  );
}; 