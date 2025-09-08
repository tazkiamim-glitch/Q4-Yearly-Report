import { toBengaliNumber } from './bengaliNumbers';

// Bengali ordinal words for 1-10
const BENGALI_ORDINALS: Record<number, string> = {
  1: 'প্রথম',
  2: 'দ্বিতীয়',
  3: 'তৃতীয়',
  4: 'চতুর্থ',
  5: 'পঞ্চম',
  6: 'ষষ্ঠ',
  7: 'সপ্তম',
  8: 'অষ্টম',
  9: 'নবম',
  10: 'দশম',
};

/**
 * Converts a number to Bengali ordinal format
 * For 1-10: returns the Bengali ordinal word (প্রথম, দ্বিতীয়, etc.)
 * For 11+: returns Bengali numeral + "তম" (e.g., ১০০তম, ৫০০তম)
 */
export function toBengaliOrdinal(rank: number): string {
  if (rank >= 1 && rank <= 10) {
    return BENGALI_ORDINALS[rank];
  }
  
  // For numbers > 10, convert to Bengali numerals and add "-তম"
  return toBengaliNumber(rank) + '-তম';
}

/**
 * Gets the rank based on engagement level for mock data
 * High -> 1st (প্রথম)
 * Moderate -> 100th (১০০তম) 
 * Low -> 500th (৫০০তম)
 */
export function getRankFromEngagementLevel(engagementLevel: string): number {
  switch (engagementLevel.toLowerCase()) {
    case 'high':
      return 1;
    case 'moderate':
      return 100;
    case 'low':
      return 500;
    default:
      return 1;
  }
}
