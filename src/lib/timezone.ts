import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { parseISO, isValid } from "date-fns";

export const DEFAULT_TIMEZONE = "Asia/Tashkent";

export function getAnchorDate(): string {
  return process.env.DAILY_ANCHOR_DATE?.trim() || "2025-01-01";
}

/** Calendar date YYYY-MM-DD in Asia/Tashkent for a given instant. */
export function getTashkentDateString(date: Date = new Date()): string {
  return formatInTimeZone(date, DEFAULT_TIMEZONE, "yyyy-MM-dd");
}

/** Parse YYYY-MM-DD as a calendar date (no TZ shift for day math). */
export function parseCalendarDate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = parseISO(`${dateStr}T12:00:00.000Z`);
  return isValid(d) ? d : null;
}

/** Start-of-day instant in Tashkent for a calendar date string. */
export function tashkentDayStartUtc(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  // Noon UTC of that calendar label avoids DST edge issues for day-diff counting.
  const d = parseISO(`${dateStr}T12:00:00.000Z`);
  return isValid(d) ? d : null;
}

export function formatTashkentDisplay(date: Date = new Date()): string {
  return formatInTimeZone(date, DEFAULT_TIMEZONE, "d MMMM yyyy");
}

export function getTashkentZonedNow(date: Date = new Date()): Date {
  return toZonedTime(date, DEFAULT_TIMEZONE);
}
