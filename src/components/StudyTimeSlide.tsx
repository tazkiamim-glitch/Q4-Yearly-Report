import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { PieChart, Pie, Cell } from 'recharts';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import { formatDelta } from '../utils/compare';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { EngagementLevel } from '../utils/studentTexts';
import type { StudentData } from '../utils/mockStudents';
import type { ReportMode } from '../context/StudentDataContext';

interface StudyTimeSlideProps {
  studentData: StudentData;
  onPrev: () => void;
  onNext?: () => void;
}

export const StudyTimeSlide = ({ studentData, onPrev, onNext }: StudyTimeSlideProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({});
  const studyTime = studentData.studyTime;
  // Pie chart animation state
  const [displayMinutes, setDisplayMinutes] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Parse study times (hh:mm) to minutes
  function parseTime(str: string) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  }
  const oct = parseTime(studyTime.october);
  const nov = parseTime(studyTime.november);
  const dec = parseTime(studyTime.december);
  const total = oct + nov + dec;
  const size = 180;
  const stroke = 22;
  
  // Calculate delta between current and previous quarter
  const previousTotal = studentData.lastQuarter?.studyTime?.total 
    ? parseTime(studentData.lastQuarter.studyTime.total) 
    : 0;
  const deltaMin = total - previousTotal;
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const duration = 1200;
    function animate(ts: number) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setDisplayMinutes(Math.floor(prog * total));
      if (prog < 1) {
        frame = requestAnimationFrame(animate);
      }
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [total]);

  // Animated values for the chart, in sync with displayMinutes
  const animatedOct = Math.min(oct, displayMinutes);
  const animatedNov = Math.min(nov, Math.max(0, displayMinutes - oct));
  const animatedDec = Math.max(0, displayMinutes - oct - nov);

  // Helper donut chart component
  function StudyTimeDonut({ oct, nov, dec, size, stroke, displayMinutes }: { oct: number, nov: number, dec: number, size: number, stroke: number, displayMinutes: number }) {
    const COLORS = ['#CF278D', '#EFAD1E', '#354894'];
    const data = [
      { name: 'October', value: oct },
      { name: 'November', value: nov },
      { name: 'December', value: dec },
    ];
    // Center text calculation
    const h = Math.floor(displayMinutes / 60);
    const m = displayMinutes % 60;
    return (
      <div style={{ position: 'relative', width: size, height: size }}>
        <PieChart width={size} height={size}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={size / 2 - stroke}
            outerRadius={size / 2}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            isAnimationActive={false}
          >
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
            ))}
          </Pie>
        </PieChart>
        {/* Centered Bengali time text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none',
        }}>
          <span className="text-4xl font-bold text-shikho-pink studytime-pie-number" style={{ lineHeight: 1 }}>
            {`${toBengaliNumber(h)}:${m.toString().padStart(2, '0').replace(/\d/g, d => toBengaliNumber(d))}`}
          </span>
          <span className="text-shikho-blue font-noto-bengali text-base" style={{ marginTop: 0 }}>ঘণ্টা</span>
        </div>
      </div>
    );
  }

  const { reportMode: contextReportMode } = useStudentDataContext();
  const { mode } = useParams<{ mode?: string }>();
  
  // Compute reportMode directly from URL parameter for immediate use
  const reportMode: ReportMode = mode?.toLowerCase() === 'yearly' ? 'YEARLY' : contextReportMode;
  const texts = getStudentTexts('studyTime', studentData.engagementLevel as EngagementLevel, reportMode);
  const gradientClass = getGradientClass('studyTime', studentData.engagementLevel as EngagementLevel);

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
                className={`w-2 h-2 rounded-full ${i === 5 ? 'bg-shikho-pink' : 'bg-gray-300'} inline-block`}
              />
            ))}
          </div>
        )}
        {/* Card */}
        <div ref={cardRef} className={`card-oval w-[80vw] max-w-[80vw] flex flex-col items-center py-4 mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}>
          {/* Header */}
          <div className="text-center mb-1 mt-1">
            <h1 className="text-shikho-blue text-lg font-noto-bengali mb-2 font-bold">{texts.header}</h1>
          </div>
          {/* Pie Chart */}
          <div className="flex flex-col items-center my-4 relative" style={{ height: size, width: size }}>
            <StudyTimeDonut oct={animatedOct} nov={animatedNov} dec={animatedDec} size={size} stroke={stroke} displayMinutes={displayMinutes} />
          </div>
          {/* Stats Row */}
          <div className="w-full flex justify-around bg-gray-50 rounded-xl py-2 mt-1 mb-1">
            <div className="flex flex-col items-center studytime-stats-col">
              <span className="text-shikho-pink font-bold text-lg">{toBengaliNumber(studyTime.october)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">{texts.oct}</span>
            </div>
            <div className="flex flex-col items-center studytime-stats-col">
              <span className="text-shikho-yellow font-bold text-lg">{toBengaliNumber(studyTime.november)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">{texts.nov}</span>
            </div>
            <div className="flex flex-col items-center studytime-stats-col">
              <span className="text-shikho-blue font-bold text-lg">{toBengaliNumber(studyTime.december)}</span>
              <span className="text-gray-600 font-noto-bengali text-xs">{texts.dec}</span>
            </div>
          </div>
          {/* Engagement-based footer */}
          <div className="text-gray-600 font-noto-bengali text-sm mt-4 text-center">
            {studentData.engagementLevel === 'high' ? (
              // High engagement - Increase case
              <>
                 <p className="mb-1">
    গত কোয়ার্টার থেকে <span className="desc-number text-shikho-pink font-bold"><strong>{formatDelta(Math.abs(deltaMin))} ঘণ্টা</strong></span> বেশি সময় দিয়েছো! 🔥
  </p>
  <p>
    এই ধারাই তোমার জেতা!
  </p>
              </>
            ) : studentData.engagementLevel === 'moderate' ? (
              // Moderate engagement - Same case
              <>
                <p className="mb-1">
      গত কোয়ার্টারের মতো এক-ই সময় দিয়েছো!
    </p>
    <p>
      একটু বাড়ালেই বড় জাম্প! 🙂
    </p>
              </>
            ) : (
              // Low engagement - Drop case
              <>
                <p className="mb-1">
      গত কোয়ার্টার থেকে পড়াশোনা <span className="desc-number text-shikho-pink font-bold"><strong>{formatDelta(Math.abs(deltaMin))} ঘণ্টা</strong></span> কম 😔
    </p>
    <p>
      আজ থেকেই ঘুরে দাঁড়াও! 💪
    </p>
              </>
            )}
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
        <FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
      </div>
    </>
  );
};
