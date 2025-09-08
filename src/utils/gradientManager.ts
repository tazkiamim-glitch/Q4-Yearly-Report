export type EngagementLevel = 'high' | 'moderate' | 'low';

export type SlideType = 
  | 'welcome'
  | 'liveClass'
  | 'liveTest'
  | 'quizPerformance'
  | 'streakTracker'
  | 'studyTime'
  | 'comparison'
  | 'finalCongrats'
  | 'dayOfWeek';

// Define all available gradients
const GRADIENTS = {
  default: 'gradient-bg',
  liveClass: 'gradient-bg-live-class',
  quizPerformance: 'gradient-bg-quiz-performance',
  streakTracker: 'gradient-bg-streak-tracker',
  studyTime: 'gradient-bg-study-time',
  comparison: 'gradient-bg-comparison',
  finalCongrats: 'gradient-bg-final-congrats',
  dayOfWeek: 'gradient-bg-day-of-week',
};

// High engagement students get the original gradient order
const HIGH_GRADIENT_ORDER: Record<SlideType, string> = {
  welcome: GRADIENTS.default,
  liveClass: GRADIENTS.liveClass,
  liveTest: GRADIENTS.default,
  quizPerformance: GRADIENTS.quizPerformance,
  streakTracker: GRADIENTS.streakTracker,
  studyTime: GRADIENTS.studyTime,
  comparison: GRADIENTS.comparison,
  finalCongrats: GRADIENTS.finalCongrats,
  dayOfWeek: GRADIENTS.dayOfWeek,
};

// Moderate engagement students get a different gradient order
const MODERATE_GRADIENT_ORDER: Record<SlideType, string> = {
  welcome: GRADIENTS.liveClass,
  liveClass: GRADIENTS.quizPerformance,
  liveTest: GRADIENTS.streakTracker,
  quizPerformance: GRADIENTS.studyTime,
  streakTracker: GRADIENTS.finalCongrats,
  studyTime: GRADIENTS.default,
  comparison: GRADIENTS.comparison,
  finalCongrats: GRADIENTS.liveClass,
  dayOfWeek: GRADIENTS.dayOfWeek,
};

// Low engagement students get another different gradient order
const LOW_GRADIENT_ORDER: Record<SlideType, string> = {
  welcome: GRADIENTS.studyTime,
  liveClass: GRADIENTS.finalCongrats,
  liveTest: GRADIENTS.quizPerformance,
  quizPerformance: GRADIENTS.default,
  streakTracker: GRADIENTS.liveClass,
  studyTime: GRADIENTS.streakTracker,
  comparison: GRADIENTS.comparison,
  finalCongrats: GRADIENTS.studyTime,
  dayOfWeek: GRADIENTS.dayOfWeek,
};

const GRADIENT_ORDERS: Record<EngagementLevel, Record<SlideType, string>> = {
  high: HIGH_GRADIENT_ORDER,
  moderate: MODERATE_GRADIENT_ORDER,
  low: LOW_GRADIENT_ORDER,
};

export function getGradientClass(slideType: SlideType, engagementLevel: EngagementLevel): string {
  return GRADIENT_ORDERS[engagementLevel][slideType];
} 