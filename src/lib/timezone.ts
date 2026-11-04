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

/**
 * Normalize calendar dates to YYYY-MM-DD.
 * Accepts unpadded forms like 2026-11-6 → 2026-11-06 (Shortcuts often omit zeros).
 */
export function normalizeCalendarDateString(dateStr: string): string | null {
  const match = dateStr.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const normalized = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const d = parseISO(`${normalized}T12:00:00.000Z`);
  if (!isValid(d)) return null;
  // Reject impossible calendar days (e.g. 2026-02-31) that Date would roll over.
  if (
    d.getUTCFullYear() !== year ||
    d.getUTCMonth() + 1 !== month ||
    d.getUTCDate() !== day
  ) {
    return null;
  }
  return normalized;
}

/** Parse YYYY-MM-DD as a calendar date (no TZ shift for day math). */
export function parseCalendarDate(dateStr: string): Date | null {
  const normalized = normalizeCalendarDateString(dateStr);
  if (!normalized) return null;
  return parseISO(`${normalized}T12:00:00.000Z`);
}

/** Start-of-day instant in Tashkent for a calendar date string. */
export function tashkentDayStartUtc(dateStr: string): Date | null {
  const normalized = normalizeCalendarDateString(dateStr);
  if (!normalized) return null;
  // Noon UTC of that calendar label avoids DST edge issues for day-diff counting.
  return parseISO(`${normalized}T12:00:00.000Z`);
}

export function formatTashkentDisplay(date: Date = new Date()): string {
  return formatInTimeZone(date, DEFAULT_TIMEZONE, "d MMMM yyyy");
}

export function getTashkentZonedNow(date: Date = new Date()): Date {
  return toZonedTime(date, DEFAULT_TIMEZONE);
}
