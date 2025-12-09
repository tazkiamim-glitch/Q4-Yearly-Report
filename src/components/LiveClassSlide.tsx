import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useShare } from '../hooks/useShare';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { FallbackModal } from './FallbackModal';
import { BuntingOverlay } from './BuntingOverlay';
import { ArrowButton } from './ArrowButton';
import { getStudentTexts } from '../utils/studentTexts';
import { getGradientClass } from '../utils/gradientManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { motion } from 'framer-motion';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { EngagementLevel } from '../utils/studentTexts';
import type { StudentData } from '../utils/mockStudents';
import type { ReportMode } from '../context/StudentDataContext';

// Custom animated bar shape for staggered growth (Q1→Q4)
const CustomAnimatedBar = (props: any) => {
  const { x, y, width, height, fill, index } = props;
  const delay = (index ?? 0) * 0.3;
  const cornerRadius = 10; // rounded corners
  return (
    <motion.rect
      x={x}
      width={width}
      fill={fill}
      rx={cornerRadius}
      ry={cornerRadius}
      initial={{ y: y + height, height: 0 }}
      animate={{ y, height }}
      transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
    />
  );
};

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
  const [chartKey, setChartKey] = useState(0);
  const percent = studentData.attendance.percent;
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
  const isYearlyReport = reportMode === 'YEARLY';
  const texts = getStudentTexts('liveClass', studentData.engagementLevel as EngagementLevel, reportMode);
  const gradientClass = getGradientClass('liveClass', studentData.engagementLevel as EngagementLevel);
  const yearlyTrend = studentData.yearlyAttendance ?? { q1: percent, q2: percent, q3: percent, q4: percent };
  const areaChartData = [
    { quarter: 'কোয়ার্টার ১', percent: yearlyTrend.q1 },
    { quarter: 'কোয়ার্টার ২', percent: yearlyTrend.q2 },
    { quarter: 'কোয়ার্টার ৩', percent: yearlyTrend.q3 },
    { quarter: 'কোয়ার্টার ৪', percent: yearlyTrend.q4 },
  ];
  const summaryStats = [
    { label: 'মোট ক্লাস', value: studentData.attendance.total, color: 'text-shikho-blue' },
    { label: 'উপস্থিত', value: studentData.attendance.attended, color: 'text-shikho-pink' },
    { label: 'অনুপস্থিত', value: studentData.attendance.missed, color: 'text-shikho-red' },
  ];

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

  // Reset chart key to restart animation when component becomes visible or mode changes
  useEffect(() => {
    if (isYearlyReport) {
      setChartKey(prev => prev + 1);
    }
  }, [isYearlyReport, isVisible]);

  // Pie chart dimensions
  const size = 160;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - animatedPercent / 100);

  return (
    <>
      <div className={`slide-container flex flex-col items-center justify-center px-2 relative${isYearlyReport ? ' final-yearly' : ''}${hideUI ? ' sharing-mode' : ''}`}>
        {/* Shikho logo - positioned inside slide container to be captured in screenshot */}
        <img
          src="/shikho_logo.png"
          alt="Shikho Logo"
          className="absolute z-50 left-1/2 -translate-x-1/2 w-10 h-10 h-sm:w-14 h-sm:h-14 h-md:w-16 h-md:h-16"
          style={{ top: 40 }}
        />

        {/* Background */}
        {isYearlyReport ? (
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
          className={`card-oval card-responsive flex flex-col items-center relative ${isYearlyReport ? 'py-2 px-3' : 'py-2 px-2'} mb-4 fade-in-slide${isVisible ? ' visible' : ''}`}
        >
          {/* Header */}
          <div className="text-center mb-1 mt-1 px-2">
            <h1 className="text-[#354894] font-bold text-center font-noto-bengali text-lg mb-0">
              {texts.header}
            </h1>
          </div>
          {isYearlyReport ? (
            <>
              <div className="w-full mt-1 flex justify-center items-center px-1">
                <div className="rounded-3xl w-full">
                  <div className="w-full flex justify-center items-center">
                    <div 
                      key={chartKey}
                      style={{ width: '100%', paddingTop: 8 }}
                    >
                      {/* Wrapper to squeeze the bars together */}
                      <div className="w-full max-w-[320px] mx-auto mt-2">
                        <ResponsiveContainer key={chartKey} width="100%" height={180}>
                          <BarChart data={areaChartData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }} barSize={22} barCategoryGap="0%" barGap={0}>
                            <CartesianGrid vertical={false} stroke="#F1F5F9" strokeDasharray="3 3" />
                          <XAxis
                            dataKey="quarter"
                            interval={0}
                            tick={{ fontSize: 11, fill: '#6B7280' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                            height={50}
                          />
                          <YAxis
                            domain={[0, 100]}
                            hide
                          />
                            <Bar dataKey="percent" isAnimationActive={false} shape={<CustomAnimatedBar />}> 
                              {areaChartData.map((_, index) => {
                                const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899'];
                                return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                              })}
                              <LabelList
                                  dataKey="percent"
                                  position="top"
                                  formatter={(v: number) => `${toBengaliNumber(Math.round(v))}%`}
                                  fill="#CF278D"
                                  fontSize={12}
                                  style={{ fontWeight: 700, fontFamily: 'Noto Sans Bengali' }}
                                />
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Full-width compact banner between chart and stats */}
              <div className="w-full px-2 mt-2 mb-1">
                <div className={`w-full rounded-xl ${isYearlyReport ? 'bg-gray-50' : 'bg-white'} py-1.5 px-3 flex items-center justify-center gap-2 text-center`}>
                  <span className="font-noto-bengali text-sm text-gray-700">সারা বছরের গড় উপস্থিতি</span>
                  <span className="font-noto-bengali text-sm" style={{ color: '#CF278D', fontWeight: 700 }}>
                    {toBengaliNumber(studentData.attendance.percent)}%
                  </span>
                </div>
              </div>
              <div className={`w-full flex justify-around ${isYearlyReport ? 'bg-gray-50' : 'bg-white'} rounded-2xl py-3 px-4 mt-1`}>
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className={`${stat.color} font-bold text-lg`}>
                      {toBengaliNumber(stat.value)}
                    </span>
                    <span className="text-gray-500 font-noto-bengali text-xs">{stat.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-600 text-sm text-center font-noto-bengali mt-3">
                {texts.footer}
              </p>
            </>
          ) : (
            <>
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
          <div className={`w-full flex justify-around ${isYearlyReport ? 'bg-gray-50' : 'bg-white'} rounded-xl py-2 mt-1 mb-1`}>
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
          {studentData.lastQuarter && (() => {
            const currentPct = studentData.attendance.percent;
            const lastPct = studentData.lastQuarter.attendance.percent;
            const deltaPct = Math.round(currentPct - lastPct);
            
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
                    গত কোয়ার্টার থেকে ক্লাস উপস্থিতি <span className="text-[#CF278D] font-semibold">{toBengaliNumber(Math.abs(deltaPct))}%</span> কম😔<br />আজ থেকেই গতি ফেরাও! 💪
                  </>
                )}
              </p>
            );
          })()}
            </>
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
              className={`fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 font-noto-bengali font-bold rounded-full text-base px-4 py-2 sm:text-lg sm:px-8 sm:py-3 shadow-lg ${isYearlyReport ? 'bg-white text-[#16325B]' : 'bg-shikho-yellow text-shikho-blue'}`}
              onClick={handleShare}
              style={{ maxWidth: '90vw', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
            >
              শেয়ার করো!
            </button>
          </div>
        )}
        {/* Student name and class - visible in both normal and sharing modes */}
        <div className="fixed left-1/2 bottom-16 mb-2 z-30 text-center student-name-display" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 64px)' }}>
          <p className={`font-noto-bengali text-sm ${isYearlyReport ? 'text-gray-600' : 'text-gray-500'}`}>
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