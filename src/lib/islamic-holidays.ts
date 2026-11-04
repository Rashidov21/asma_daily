import { toGregorian, toHijri } from "hijri-converter";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { getTashkentDateString } from "@/lib/timezone";

export type IslamicHoliday = {
  id: string;
  nameRu: string;
  hijriMonth: number;
  hijriDay: number;
};

/** Fixed Hijri-date observances (расчётные даты по гражданской хиджре). */
export const ISLAMIC_HOLIDAYS: IslamicHoliday[] = [
  { id: "new-year", nameRu: "Новый год Хиджры", hijriMonth: 1, hijriDay: 1 },
  { id: "ashura", nameRu: "День Ашура", hijriMonth: 1, hijriDay: 10 },
  { id: "mawlid", nameRu: "Мавлид ан-Наби", hijriMonth: 3, hijriDay: 12 },
  { id: "isra", nameRu: "Исра и Мирадж", hijriMonth: 7, hijriDay: 27 },
  { id: "ramadan", nameRu: "Начало Рамадана", hijriMonth: 9, hijriDay: 1 },
  {
    id: "laylat-al-qadr",
    nameRu: "Ночь Предопределения",
    hijriMonth: 9,
    hijriDay: 27,
  },
  { id: "eid-fitr", nameRu: "Ид аль-Фитр", hijriMonth: 10, hijriDay: 1 },
  { id: "arafah", nameRu: "День Арафа", hijriMonth: 12, hijriDay: 9 },
  { id: "eid-adha", nameRu: "Ид аль-Адха", hijriMonth: 12, hijriDay: 10 },
];

export type UpcomingHoliday = {
  holiday: IslamicHoliday;
  gregorianDate: string;
  hijriYear: number;
  daysUntil: number;
  isToday: boolean;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function hijriToIso(hy: number, hm: number, hd: number): string {
  const g = toGregorian(hy, hm, hd);
  return `${g.gy}-${pad(g.gm)}-${pad(g.gd)}`;
}

/** Next upcoming Islamic holiday from Tashkent «today» (inclusive if today). */
export function getNextIslamicHoliday(date?: Date | string): UpcomingHoliday {
  const todayStr =
    typeof date === "string" ? date : getTashkentDateString(date ?? new Date());
  const [gy, gm, gd] = todayStr.split("-").map(Number) as [number, number, number];
  const { hy } = toHijri(gy, gm, gd);
  const today = parseISO(`${todayStr}T12:00:00.000Z`);

  const candidates: UpcomingHoliday[] = [];
  for (const year of [hy - 1, hy, hy + 1]) {
    for (const holiday of ISLAMIC_HOLIDAYS) {
      const gregorianDate = hijriToIso(year, holiday.hijriMonth, holiday.hijriDay);
      const day = parseISO(`${gregorianDate}T12:00:00.000Z`);
      const daysUntil = differenceInCalendarDays(day, today);
      if (daysUntil < 0) continue;
      candidates.push({
        holiday,
        gregorianDate,
        hijriYear: year,
        daysUntil,
        isToday: daysUntil === 0,
      });
    }
  }

  candidates.sort((a, b) => a.daysUntil - b.daysUntil);
  const next = candidates[0];
  if (!next) {
    // Fallback — should not happen
    const holiday = ISLAMIC_HOLIDAYS[0]!;
    return {
      holiday,
      gregorianDate: hijriToIso(hy + 1, holiday.hijriMonth, holiday.hijriDay),
      hijriYear: hy + 1,
      daysUntil: 365,
      isToday: false,
    };
  }
  return next;
}

export function formatDaysUntilRu(days: number): string {
  if (days === 0) return "сегодня";
  if (days === 1) return "завтра";
  const mod10 = days % 10;
  const mod100 = days % 100;
  let unit = "дней";
  if (mod10 === 1 && mod100 !== 11) unit = "день";
  else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) unit = "дня";
  return `через ${days} ${unit}`;
}
