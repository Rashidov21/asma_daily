import { toHijri } from "hijri-converter";
import { parseCalendarDate, getTashkentDateString } from "@/lib/timezone";

export type HijriParts = {
  year: number;
  month: number;
  day: number;
};

/** Convert Gregorian YYYY-MM-DD (or today Tashkent) to Hijri parts. */
export function getHijriParts(date?: Date | string): HijriParts {
  let y: number;
  let m: number;
  let d: number;
  if (typeof date === "string") {
    const parsed = parseCalendarDate(date);
    if (!parsed) throw new Error(`Invalid date: ${date}`);
    const [yy, mm, dd] = date.split("-").map(Number);
    y = yy!;
    m = mm!;
    d = dd!;
  } else {
    const s = getTashkentDateString(date ?? new Date());
    const [yy, mm, dd] = s.split("-").map(Number);
    y = yy!;
    m = mm!;
    d = dd!;
  }
  const h = toHijri(y, m, d);
  return { year: h.hy, month: h.hm, day: h.hd };
}

/** Russian Hijri date via Intl (Umm al-Qura), e.g. «24 джумад-уль-авваль 1448 г.». */
export function formatHijriRu(date?: Date | string): string {
  let g: Date;
  if (typeof date === "string") {
    const parsed = parseCalendarDate(date);
    if (!parsed) throw new Error(`Invalid date: ${date}`);
    g = parsed;
  } else {
    g = date ?? new Date();
  }
  return new Intl.DateTimeFormat("ru-RU-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(g);
}

export function formatGregorianRu(date?: Date | string): string {
  let g: Date;
  if (typeof date === "string") {
    const parsed = parseCalendarDate(date);
    if (!parsed) throw new Error(`Invalid date: ${date}`);
    g = parsed;
  } else {
    g = date ?? new Date();
  }
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(g);
}
