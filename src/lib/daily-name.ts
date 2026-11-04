import { differenceInCalendarDays } from "date-fns";
import {
  getAnchorDate,
  getTashkentDateString,
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
    const parsed = parseCalendarDate(date);
    if (!parsed) {
      throw new Error(`Invalid date: ${date}`);
    }
    return date;
  }
  return getTashkentDateString(date ?? new Date());
}

/** 0-based index into the 99 names for a Tashkent calendar day. */
export function getDailyNameIndex(date?: Date | string): number {
  const dateStr = resolveDateString(date);
  const anchor = getAnchorDate();
  const day = tashkentDayStartUtc(dateStr);
  const anchorDay = tashkentDayStartUtc(anchor);
  if (!day || !anchorDay) {
    throw new Error("Unable to resolve calendar dates");
  }
  const diff = differenceInCalendarDays(day, anchorDay);
  return ((diff % TOTAL_NAMES) + TOTAL_NAMES) % TOTAL_NAMES;
}

export function getDailyName(date?: Date | string): DivineName {
  return getNameByIndex(getDailyNameIndex(date));
}

export function getDailyProgress(date?: Date | string): DailyProgress {
  const index = getDailyNameIndex(date);
  const current = index + 1;
  const percent = Math.round((current / TOTAL_NAMES) * 100);
  return { current, total: TOTAL_NAMES, percent };
}

export function getDailyPayload(date?: Date | string): DailyPayload {
  const dateStr = resolveDateString(date);
  const name = getDailyName(dateStr);
  const progress = getDailyProgress(dateStr);
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
