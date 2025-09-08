// Bengali numeral conversion utility
const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumeral(num: number): string {
  return num.toString().replace(/\d/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

export function formatBengaliPercentage(num: number): string {
  return `${toBengaliNumeral(num)}%`;
}

export function formatBengaliScore(current: number, total: number = 100): string {
  return `${toBengaliNumeral(current)} / ${toBengaliNumeral(total)}`;
}

export function formatBengaliDays(num: number): string {
  return `${toBengaliNumeral(num)} দিন`;
}

export function formatBengaliTime(timeStr: string): string {
  // Convert "HH:MM" format to Bengali numerals
  return timeStr.replace(/\d/g, (digit) => bengaliNumerals[parseInt(digit)]);
}

export function formatBengaliHours(timeStr: string): string {
  // Convert "HH:MM" to "X ঘন্টা" format
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalHours = hours + (minutes / 60);
  const roundedHours = Math.round(totalHours);
  return `${toBengaliNumeral(roundedHours)} ঘন্টা`;
}

export function calculateChange(current: number, previous: number): {
  value: number;
  direction: 'up' | 'down' | 'same';
  formatted: string;
} {
  const change = current - previous;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
  
  return {
    value: Math.abs(change),
    direction,
    formatted: `${direction === 'up' ? '⬆︎' : direction === 'down' ? '⬇︎' : '—'} ${toBengaliNumeral(Math.abs(change))}%`
  };
}

// Helper function to format delta values for verdict text
export function formatDeltaValue(value: number, unit: string): string {
  return `${toBengaliNumeral(value)}${unit}`;
}

export function calculateTimeChange(currentTime: string, previousTime: string): {
  value: number;
  direction: 'up' | 'down' | 'same';
  formatted: string;
} {
  const [currentHours, currentMinutes] = currentTime.split(':').map(Number);
  const [previousHours, previousMinutes] = previousTime.split(':').map(Number);
  
  const currentTotalMinutes = currentHours * 60 + currentMinutes;
  const previousTotalMinutes = previousHours * 60 + previousMinutes;
  
  const changeMinutes = currentTotalMinutes - previousTotalMinutes;
  const changeHours = Math.round(changeMinutes / 60);
  
  const direction = changeHours > 0 ? 'up' : changeHours < 0 ? 'down' : 'same';
  
  return {
    value: Math.abs(changeHours),
    direction,
    formatted: `${direction === 'up' ? '⬆︎' : direction === 'down' ? '⬇︎' : '—'} ${toBengaliNumeral(Math.abs(changeHours))} ঘন্টা`
  };
}

export function calculateScoreChange(current: number, previous: number): {
  value: number;
  direction: 'up' | 'down' | 'same';
  formatted: string;
} {
  const change = current - previous;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
  
  return {
    value: Math.abs(change),
    direction,
    formatted: `${direction === 'up' ? '⬆︎' : direction === 'down' ? '⬇︎' : '—'} ${toBengaliNumeral(Math.abs(change))}%`
  };
}

export function calculateStreakChange(current: number, previous: number): {
  value: number;
  direction: 'up' | 'down' | 'same';
  formatted: string;
} {
  const change = current - previous;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
  
  return {
    value: Math.abs(change),
    direction,
    formatted: `${direction === 'up' ? '⬆︎' : direction === 'down' ? '⬇︎' : '—'} ${toBengaliNumeral(Math.abs(change))} দিন`
  };
}

// Helper function to format time in HH:MM format to Bengali numerals
export function formatHM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const bengaliHours = toBengaliNumeral(hours);
  const bengaliMinutes = minutes.toString().padStart(2, '0').replace(/\d/g, d => toBengaliNumeral(parseInt(d)));
  return `${bengaliHours}:${bengaliMinutes}`;
}

// Helper function to format delta time values
export function formatDelta(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  const bengaliHours = toBengaliNumeral(hours);
  const bengaliMinutes = minutes.toString().padStart(2, '0').replace(/\d/g, d => toBengaliNumeral(parseInt(d)));
  
  return `${bengaliHours}:${bengaliMinutes}`;
}