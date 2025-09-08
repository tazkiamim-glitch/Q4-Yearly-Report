import type { StudentData } from './mockStudents';

export function getFinalScoreDeltaPercent(student: StudentData): {
  current: number;     // student.finalScore
  last: number;        // student.lastQuarter.finalScore
  deltaPct: number;    // signed integer percent, rounded
} {
  const current = Math.max(0, Math.min(100, student.finalScore));
  const last = Math.max(0, Math.min(100, student.lastQuarter?.finalScore ?? 0));
  
  const deltaPct = Math.round(((current - last) / Math.max(last, 1)) * 100);
  
  return {
    current,
    last,
    deltaPct
  };
}
