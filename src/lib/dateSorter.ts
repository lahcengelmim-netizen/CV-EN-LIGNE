/**
 * Utility functions for parsing heterogeneous resume dates
 * and sorting work experiences in strict reverse chronological order (most recent first).
 */

export interface ExperienceLike {
  id?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  period?: string;
  position?: string;
  jobTitle?: string;
  title?: string;
  company?: string;
  description?: string;
  tasks?: string[];
  [key: string]: any;
}

// Multi-language dictionary for French & English month names & abbreviations
const MONTH_MAP: Record<string, number> = {
  // French
  janvier: 0,
  janv: 0,
  jan: 0,
  février: 1,
  fevrier: 1,
  févr: 1,
  fevr: 1,
  fév: 1,
  fev: 1,
  feb: 1,
  mars: 2,
  mar: 2,
  avril: 3,
  avr: 3,
  apr: 3,
  mai: 4,
  may: 4,
  juin: 5,
  jun: 5,
  juillet: 6,
  juil: 6,
  jul: 6,
  août: 7,
  aout: 7,
  aug: 7,
  septembre: 8,
  sept: 8,
  sep: 8,
  octobre: 9,
  oct: 9,
  novembre: 10,
  nov: 10,
  décembre: 11,
  decembre: 11,
  déc: 11,
  dec: 11,
  // English
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

// Patterns representing active / ongoing / current positions
const CURRENT_KEYWORDS_REGEX =
  /\b(présent|present|actuel|actuelle|en cours|current|aujourd'hui|today|now|ongoing)\b/i;

/**
 * Checks whether a given string represents a current / ongoing experience.
 */
export function isCurrentDate(dateStr?: string | null): boolean {
  if (!dateStr || typeof dateStr !== 'string') return false;
  return CURRENT_KEYWORDS_REGEX.test(dateStr.trim());
}

/**
 * Normalizes and parses a date string into a numerical timestamp (epoch milliseconds).
 * Handles:
 * - Current / Present / En cours -> Infinity
 * - "2023" -> Date.UTC(2023, 11, 31) for end date or Date.UTC(2023, 0, 1) for start date
 * - "05/2023", "05-2023", "2023-05" -> Month + Year
 * - "Jan 2023", "Janvier 2023", "Octobre 2022" -> Textual month + Year
 * - "2021 - 2023", "2020 – Présent" -> Extracts corresponding segment
 * - Empty / invalid -> -Infinity (sorted to bottom)
 */
export function parseDateToTimestamp(
  dateStr?: string | null,
  isEndDate: boolean = false
): number {
  if (!dateStr || typeof dateStr !== 'string') {
    return isEndDate ? -Infinity : -Infinity;
  }

  const raw = dateStr.trim();
  if (!raw) return -Infinity;

  // Check if string contains or represents "current / present / en cours"
  if (isCurrentDate(raw)) {
    return Infinity;
  }

  // If the date string is a range like "2021 - 2023" or "01/2020 à 06/2022"
  const rangeSeparators = /\s*(?:-|–|—|to|à|au)\s*/i;
  if (rangeSeparators.test(raw)) {
    const parts = raw.split(rangeSeparators).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const targetSegment = isEndDate ? parts[parts.length - 1] : parts[0];
      return parseDateToTimestamp(targetSegment, isEndDate);
    }
  }

  const cleaned = raw.toLowerCase().replace(/[.,]/g, '').trim();

  // 1. Check for Month Name + Year: e.g. "Janvier 2023", "Jan 2023", "March 2021"
  const textMonthYearMatch = cleaned.match(/([a-zàâéèêëîïôöùûüç]+)\s+(\d{4})/i);
  if (textMonthYearMatch) {
    const monthWord = textMonthYearMatch[1];
    const yearNum = parseInt(textMonthYearMatch[2], 10);
    const monthNum = MONTH_MAP[monthWord];
    if (monthNum !== undefined && !isNaN(yearNum)) {
      return Date.UTC(yearNum, monthNum, isEndDate ? 28 : 1);
    }
  }

  // 1b. Inverse: Year + Month Name: e.g. "2023 Janvier", "2021 Mars"
  const yearTextMonthMatch = cleaned.match(/(\d{4})\s+([a-zàâéèêëîïôöùûüç]+)/i);
  if (yearTextMonthMatch) {
    const yearNum = parseInt(yearTextMonthMatch[1], 10);
    const monthWord = yearTextMonthMatch[2];
    const monthNum = MONTH_MAP[monthWord];
    if (monthNum !== undefined && !isNaN(yearNum)) {
      return Date.UTC(yearNum, monthNum, isEndDate ? 28 : 1);
    }
  }

  // 2. Numeric Month / Year: "05/2023", "5-2023", "05.2023"
  const mmYyyyMatch = cleaned.match(/^(\d{1,2})[\/\-.](\d{4})$/);
  if (mmYyyyMatch) {
    const monthNum = parseInt(mmYyyyMatch[1], 10) - 1;
    const yearNum = parseInt(mmYyyyMatch[2], 10);
    if (monthNum >= 0 && monthNum <= 11 && !isNaN(yearNum)) {
      return Date.UTC(yearNum, monthNum, isEndDate ? 28 : 1);
    }
  }

  // 3. Numeric Year / Month: "2023-05", "2023/05"
  const yyyyMmMatch = cleaned.match(/^(\d{4})[\/\-.](\d{1,2})$/);
  if (yyyyMmMatch) {
    const yearNum = parseInt(yyyyMmMatch[1], 10);
    const monthNum = parseInt(yyyyMmMatch[2], 10) - 1;
    if (monthNum >= 0 && monthNum <= 11 && !isNaN(yearNum)) {
      return Date.UTC(yearNum, monthNum, isEndDate ? 28 : 1);
    }
  }

  // 4. Full date: "15/05/2023" or "2023-05-15"
  const fullDateDmy = cleaned.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (fullDateDmy) {
    const dayNum = parseInt(fullDateDmy[1], 10);
    const monthNum = parseInt(fullDateDmy[2], 10) - 1;
    const yearNum = parseInt(fullDateDmy[3], 10);
    if (!isNaN(yearNum) && monthNum >= 0 && monthNum <= 11) {
      return Date.UTC(yearNum, monthNum, dayNum || 1);
    }
  }

  // 5. Standalone 4-digit Year: e.g. "2023", "2019"
  const yearOnlyMatch = cleaned.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearOnlyMatch) {
    const yearNum = parseInt(yearOnlyMatch[1], 10);
    if (!isNaN(yearNum)) {
      // For end date, position at end of year (Dec 31) so 2023 comes after 01/2023
      return Date.UTC(yearNum, isEndDate ? 11 : 0, isEndDate ? 31 : 1);
    }
  }

  // 6. Standard JS Date parser fallback
  const parsed = Date.parse(raw);
  if (!isNaN(parsed)) {
    return parsed;
  }

  return -Infinity;
}

/**
 * Extracts timestamps for an experience item to evaluate its chronological rank.
 */
function getExperienceDates(exp: ExperienceLike): {
  endTimestamp: number;
  startTimestamp: number;
} {
  // Check explicit current boolean or keywords in endDate / startDate / period
  const isCurrent =
    exp.current === true ||
    isCurrentDate(exp.endDate) ||
    isCurrentDate(exp.period);

  let endTimestamp: number;
  if (isCurrent) {
    endTimestamp = Infinity;
  } else if (exp.endDate && exp.endDate.trim()) {
    endTimestamp = parseDateToTimestamp(exp.endDate, true);
  } else if (exp.period && exp.period.trim()) {
    endTimestamp = parseDateToTimestamp(exp.period, true);
  } else if (exp.startDate && exp.startDate.trim()) {
    // If only start date is provided and no end date, evaluate if it's a range
    endTimestamp = parseDateToTimestamp(exp.startDate, true);
  } else {
    endTimestamp = -Infinity;
  }

  // Evaluate start timestamp for tie-breaking
  let startTimestamp: number;
  if (exp.startDate && exp.startDate.trim()) {
    startTimestamp = parseDateToTimestamp(exp.startDate, false);
  } else if (exp.period && exp.period.trim()) {
    startTimestamp = parseDateToTimestamp(exp.period, false);
  } else {
    startTimestamp = -Infinity;
  }

  return { endTimestamp, startTimestamp };
}

/**
 * Sorts an array of work experiences in reverse chronological order:
 * 1. Most recent jobs first (top of the list)
 * 2. Active / current positions ("Present", "Current", "En cours", current: true) always at the very top
 * 3. Ties in end dates are broken by start date descending (most recently started job first)
 * 4. Oldest jobs at the bottom
 *
 * @param experiences - Array of work experience objects
 * @returns New sorted array (does not mutate original array)
 */
export function sortExperiencesByDate<T extends ExperienceLike>(
  experiences?: T[] | null
): T[] {
  if (!Array.isArray(experiences) || experiences.length <= 1) {
    return Array.isArray(experiences) ? [...experiences] : [];
  }

  return [...experiences].sort((a, b) => {
    const dateA = getExperienceDates(a);
    const dateB = getExperienceDates(b);

    // 1. Compare End Dates (Descending: Infinity / larger timestamp first)
    if (dateA.endTimestamp !== dateB.endTimestamp) {
      return dateB.endTimestamp - dateA.endTimestamp;
    }

    // 2. Tie-break: Compare Start Dates (Descending: started more recently first)
    if (dateA.startTimestamp !== dateB.startTimestamp) {
      return dateB.startTimestamp - dateA.startTimestamp;
    }

    // 3. Fallback: preserve original order
    return 0;
  });
}

export default sortExperiencesByDate;
