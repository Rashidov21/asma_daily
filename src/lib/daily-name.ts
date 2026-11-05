import { differenceInCalendarDays } from "date-fns";
import {
  getAnchorDate,
  getTashkentDateString,
  normalizeCalendarDateString,
  parseCalendarDate,
  tashkentDayStartUtc,
} from "@/lib/timezone";
import {
  getNameByIndex,
  TOTAL_NAMES,
  type DivineName,
} from "@/data/names";
import { formatGregorianRu, formatHijriRu } from "@/lib/hijri";
import {
  formatDaysUntilRu,
  getNextIslamicHoliday,
  type UpcomingHoliday,
} from "@/lib/islamic-holidays";

export type DailyProgress = {
  current: number;
  total: number;
  percent: number;
};

export type DailyPayload = {
  date: string;
  timezone: string;
  index: number;
  progress: DailyProgress;
  name: DivineName;
  phrase: string;
  caption: string;
  gregorianLabel: string;
  hijriLabel: string;
  nextHoliday: UpcomingHoliday;
  nextHolidayLabel: string;
};

const DAILY_PHRASE = "СПОКОЙСТВИЕ СЕРДЦА";
const DAILY_CAPTION = "Повторяй вместе с нами — в сердце";

function resolveDateString(date?: Date | string): string {
  if (typeof date === "string") {
    const normalized = normalizeCalendarDateString(date);
    if (!normalized) {
      throw new Error(`Invalid date: ${date}`);
    }
    return normalized;
  }
  return getTashkentDateString(date ?? new Date());
}

export type DailyResolveOptions = {
  /**
   * Personal journey start (YYYY-MM-DD). Day 0 = name 1, then +1 each day.
   * When omitted, uses the shared `DAILY_ANCHOR_DATE` calendar cycle.
   */
  start?: string;
};

/** Resolve the cycle anchor: personal `start` or global env anchor. */
export function resolveCycleAnchor(start?: string): string {
  if (!start) return getAnchorDate();
  const normalized = normalizeCalendarDateString(start);
  if (!normalized) {
    throw new Error(`Invalid start date: ${start}`);
  }
  return normalized;
}

/** 0-based index into the 99 names for a Tashkent calendar day. */
export function getDailyNameIndex(
  date?: Date | string,
  options?: DailyResolveOptions,
): number {
  const dateStr = resolveDateString(date);
  const anchor = resolveCycleAnchor(options?.start);
  const day = tashkentDayStartUtc(dateStr);
  const anchorDay = tashkentDayStartUtc(anchor);
  if (!day || !anchorDay) {
    throw new Error("Unable to resolve calendar dates");
  }
  const diff = differenceInCalendarDays(day, anchorDay);
  return ((diff % TOTAL_NAMES) + TOTAL_NAMES) % TOTAL_NAMES;
}

export function getDailyName(
  date?: Date | string,
  options?: DailyResolveOptions,
): DivineName {
  return getNameByIndex(getDailyNameIndex(date, options));
}

export function getDailyProgress(
  date?: Date | string,
  options?: DailyResolveOptions,
): DailyProgress {
  const index = getDailyNameIndex(date, options);
  const current = index + 1;
  const percent = Math.round((current / TOTAL_NAMES) * 100);
  return { current, total: TOTAL_NAMES, percent };
}

export function getDailyPayload(
  date?: Date | string,
  options?: DailyResolveOptions,
): DailyPayload {
  const dateStr = resolveDateString(date);
  const name = getDailyName(dateStr, options);
  const progress = getDailyProgress(dateStr, options);
  const nextHoliday = getNextIslamicHoliday(dateStr);
  const when = formatDaysUntilRu(nextHoliday.daysUntil);
  const nextHolidayLabel = nextHoliday.isToday
    ? `Сегодня: ${nextHoliday.holiday.nameRu}`
    : `Скоро: ${nextHoliday.holiday.nameRu} (${when})`;

  return {
    date: dateStr,
    timezone: "Asia/Tashkent",
    index: progress.current - 1,
    progress,
    name,
    phrase: DAILY_PHRASE,
    caption: DAILY_CAPTION,
    gregorianLabel: formatGregorianRu(dateStr),
    hijriLabel: formatHijriRu(dateStr),
    nextHoliday,
    nextHolidayLabel,
  };
}

export function isValidDateParam(value: string | null): value is string {
  if (!value) return false;
  return parseCalendarDate(value) !== null;
}
