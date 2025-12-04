import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShare } from '../hooks/useShare';
import { FallbackModal } from './FallbackModal';
import { ArrowButton } from './ArrowButton';
import { getGradientClass } from '../utils/gradientManager';
import { toBengaliNumber } from '../utils/bengaliNumbers';
import { useStudentDataContext } from '../context/StudentDataContext';
import type { StudentData } from '../utils/mockStudents';
import type { ReportMode } from '../context/StudentDataContext';

interface YearlySubjectPodiumSlideProps {
	studentData: StudentData;
	onPrev: () => void;
	onNext?: () => void;
}

export const YearlySubjectPodiumSlide = ({ studentData, onPrev, onNext }: YearlySubjectPodiumSlideProps) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const { handleShare, modalOpen, setModalOpen, imgUrl, handleDownload, hideUI } = useShare({});
	const [isVisible, setIsVisible] = useState(false);
	const { reportMode: contextReportMode } = useStudentDataContext();
	const { mode } = useParams<{ mode?: string }>();
	// Compute reportMode directly from URL parameter for immediate use
	const reportMode: ReportMode = mode?.toLowerCase() === 'yearly' ? 'YEARLY' : contextReportMode;
	const gradientClass = getGradientClass('liveTest', studentData.engagementLevel as any);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	// Mock data - Top 3 subjects
	const topSubjects = [
		{ rank: 2, name: 'গণিত', score: 80, color: 'bg-purple-200 text-purple-700', accent: 'bg-purple-400' }, // Left
		{ rank: 1, name: 'গণিত', score: 90, color: 'bg-orange-200 text-orange-700', accent: 'bg-orange-400' }, // Center (Tallest)
		{ rank: 3, name: 'জীববিজ্ঞান', score: 78, color: 'bg-yellow-200 text-yellow-700', accent: 'bg-yellow-400' } // Right
	];

	// Desired visual order: Rank 2 (left), Rank 1 (center), Rank 3 (right)
	const ordered = [topSubjects.find(s => s.rank === 2)!, topSubjects.find(s => s.rank === 1)!, topSubjects.find(s => s.rank === 3)!];

	function getFinalHeightPx(rank: number) {
		if (rank === 1) return 192; // h-48
		if (rank === 2) return 144; // h-36
		return 112; // h-28
	}

	function getWidthClass(rank: number) {
		if (rank === 1) return 'w-20 h-sm:w-24'; // widest
		return 'w-16 h-sm:w-20'; // side bars
	}

	function getBnPercent(score: number) {
		return `${toBengaliNumber(score)}%`;
	}

	function getBnRank(rank: number) {
		return toBengaliNumber(rank);
	}

	return (
		<>
			<div className={`slide-container flex flex-col items-center justify-center px-2 relative${reportMode === 'YEARLY' ? ' final-yearly' : ''}${hideUI ? ' sharing-mode' : ''}`}>
				{/* Shikho logo */}
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
						{(() => {
							const dotCount = reportMode === 'YEARLY' ? 8 : 7;
							const activeIndex = 3;
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
				<div
					ref={cardRef}
					className={`card-oval w-[80vw] max-w-[80vw] flex flex-col items-center relative py-2 px-3 mb-4 fade-in-slide${isVisible ? ' visible' : ''} ${reportMode === 'YEARLY' ? 'bg-gradient-to-b from-white to-[#EAF2FF]' : ''}`}
				>
					{/* Header */}
					<div className="text-center mb-1 mt-1 px-2">
						<h1 className={`text-[#354894] font-bold text-center font-noto-bengali ${reportMode === 'YEARLY' ? 'text-xl' : 'text-lg'} mb-0`}>
							তোমার সেরা ৩টি বিষয়
						</h1>
					</div>

					{/* Podium - directly on main card */}
					<div className="w-full mt-1 flex justify-center items-center px-1">
						<div className="relative w-full max-w-md flex flex-col items-center">
							{/* Festive decorations (confetti) */}
							<div className="pointer-events-none absolute inset-0">
								{/* Left cluster */}
								<div className="absolute -top-3 left-3 w-2 h-2 rounded-full bg-pink-400 opacity-80" />
								<div className="absolute top-4 left-10 w-2 h-2 rounded-full bg-yellow-400 opacity-80" />
								<div className="absolute top-1 left-16 w-2 h-2 rounded-full bg-blue-400 opacity-80" />
								<svg className="absolute -top-2 left-8 opacity-70" width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
									<path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596l-6-5.848 8.332-1.73z"/>
								</svg>
								{/* Right cluster */}
								<div className="absolute -top-1 right-5 w-2 h-2 rounded-full bg-pink-400 opacity-80" />
								<div className="absolute top-5 right-12 w-2 h-2 rounded-full bg-blue-400 opacity-80" />
								<div className="absolute top-2 right-16 w-2 h-2 rounded-full bg-yellow-400 opacity-80" />
								<svg className="absolute -top-3 right-8 opacity-70" width="10" height="10" viewBox="0 0 24 24" fill="#EC4899" aria-hidden="true">
									<path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596l-6-5.848 8.332-1.73z"/>
								</svg>
							</div>

							{/* Bars */}
							<div className="flex items-end justify-center gap-4 h-56 z-10">
								{ordered.map((subj, idx) => {
									const finalHeight = getFinalHeightPx(subj.rank);
									const widthClass = getWidthClass(subj.rank);
									const barDelay = 0.1 * idx;

									const barClasses =
										subj.rank === 1
											? 'bg-gradient-to-t from-orange-100 to-orange-300 border-t-4 border-orange-300 shadow-md'
											: subj.rank === 2
											? 'bg-gradient-to-t from-purple-100 to-purple-300 border-t-4 border-purple-300 shadow-md'
											: 'bg-gradient-to-t from-yellow-100 to-yellow-300 border-t-4 border-yellow-300 shadow-md';

									const scoreColor =
										subj.rank === 1
											? 'text-orange-600'
											: subj.rank === 2
											? 'text-purple-600'
											: 'text-yellow-600';

									const badgeShadow =
										subj.rank === 1
											? 'shadow-lg shadow-orange-200 border-orange-300'
											: subj.rank === 2
											? 'shadow-lg shadow-purple-200 border-purple-300'
											: 'shadow-lg shadow-yellow-200 border-yellow-300';

									const badgeEmoji = subj.rank === 1 ? '🥇' : subj.rank === 2 ? '🥈' : '🥉';

									return (
										<div key={subj.rank} className="relative flex flex-col items-center">
											<motion.div
												initial={{ height: 0 }}
												animate={{ height: finalHeight }}
												transition={{ type: 'spring', stiffness: 140, damping: 16, delay: barDelay }}
												className={`${barClasses} ${widthClass} rounded-t-2xl flex flex-col items-center justify-start overflow-hidden`}
												style={{ minHeight: 0 }}
											>
											<div className="flex-1 w-full flex flex-col items-center justify-center px-2 gap-3 pb-2">
													<div className={`text-2xl h-sm:text-3xl font-extrabold font-noto-bengali ${scoreColor}`}>{getBnPercent(subj.score)}</div>
													<div className="text-xs h-sm:text-sm font-bold font-noto-bengali text-gray-700">{subj.name}</div>
												</div>
											</motion.div>
											{/* Rank badge */}
											<motion.div
												initial={{ scale: 0, y: -8, opacity: 0 }}
												animate={{ scale: 1, y: -10, opacity: 1 }}
												transition={{ type: 'spring', stiffness: 260, damping: 16, delay: barDelay + 0.3 }}
												className="absolute -top-6"
											>
												<div className={`w-12 h-12 rounded-full bg-white ${badgeShadow} border flex items-center justify-center text-2xl font-noto-bengali`}>
													<span aria-hidden="true">{badgeEmoji}</span>
												</div>
											</motion.div>
										</div>
									);
								})}
							</div>

							{/* Floor */}
							<div className="mt-4 h-2 w-64 bg-gray-200/80 rounded-full" />
						</div>
					</div>

					{/* Bottom helper/cta section (optional) */}
					<div className="w-full max-w-sm text-center mt-2">
						<p className="text-gray-600 text-sm text-center font-medium font-noto-bengali px-4 mt-2 mb-2">
							বছর জুড়ে অসাধারণ পারফরম্যান্স!
						</p>
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
							className={`fixed left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-2 font-noto-bengali font-bold rounded-full text-base px-4 py-2 sm:text-lg sm:px-8 sm:py-3 shadow-lg ${reportMode === 'YEARLY' ? 'bg-white text-[#16325B]' : 'bg-shikho-yellow text-shikho-blue'}`}
							onClick={handleShare}
							style={{ maxWidth: '90vw' }}
						>
							শেয়ার করো!
						</button>
					</div>
				)}

				{/* Student name and class */}
				<div className="fixed left-1/2 bottom-16 mb-2 z-30 text-center student-name-display">
					<p className={`font-noto-bengali text-sm ${reportMode === 'YEARLY' ? 'text-gray-600' : 'text-gray-500'}`}>
						<span className="font-semibold">{studentData.name}</span> • {studentData.class}
					</p>
				</div>

				{/* Fallback modal */}
				<FallbackModal open={modalOpen} onClose={() => setModalOpen(false)} onDownload={handleDownload} imgUrl={imgUrl} />
			</div>
		</>
	);
};


