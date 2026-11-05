import { fromZonedTime } from "date-fns-tz";
import { DEFAULT_TIMEZONE } from "@/lib/timezone";

/** Tashkent — used for sunrise/sunset wallpaper theme. */
export const TASHKENT_LAT = 41.2995;
export const TASHKENT_LON = 69.2401;

/**
 * Approximate sunrise & sunset for a calendar day (Asia/Tashkent by default).
 * Based on the NOAA solar calculator equations.
 */
export function getSunriseSunset(
  date: Date = new Date(),
  lat: number = TASHKENT_LAT,
  lon: number = TASHKENT_LON,
  timeZone: string = DEFAULT_TIMEZONE,
): { sunrise: Date; sunset: Date } {
  const { year, month, day } = civilDateParts(date, timeZone);
  const jday = julianDay(year, month, day);

  const rise = solarEvent(jday, lat, lon, true);
  const set = solarEvent(jday, lat, lon, false);

  return {
    sunrise: minutesToZonedInstant(year, month, day, rise, timeZone),
    sunset: minutesToZonedInstant(year, month, day, set, timeZone),
  };
}

function civilDateParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  return {
    year: Number(parts.find((p) => p.type === "year")!.value),
    month: Number(parts.find((p) => p.type === "month")!.value),
    day: Number(parts.find((p) => p.type === "day")!.value),
  };
}

function julianDay(year: number, month: number, day: number): number {
  // Julian day at 0h UT for the civil date
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Local solar minutes from midnight (approx) for sunrise or sunset. */
function solarEvent(
  jday: number,
  lat: number,
  lon: number,
  rising: boolean,
): number {
  const rad = Math.PI / 180;
  const n = Math.ceil(jday - 2451545.0 + 0.0008);
  const jStar = n - lon / 360;
  const m = (357.5291 + 0.98560028 * jStar) % 360;
  const c =
    1.9148 * Math.sin(m * rad) +
    0.02 * Math.sin(2 * m * rad) +
    0.0003 * Math.sin(3 * m * rad);
  const lambda = (m + c + 180 + 102.9372) % 360;
  const jTransit = 2451545.0 + jStar + 0.0053 * Math.sin(m * rad) - 0.0069 * Math.sin(2 * lambda * rad);
  const sinDec = Math.sin(lambda * rad) * Math.sin(23.4397 * rad);
  const dec = Math.asin(sinDec);
  const cosH =
    (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) /
    (Math.cos(lat * rad) * Math.cos(dec));
  const h = Math.acos(Math.min(1, Math.max(-1, cosH)));
  const jEvent = rising
    ? jTransit - h / (2 * Math.PI)
    : jTransit + h / (2 * Math.PI);

  // Convert Julian to minutes from local midnight via longitude / timezone offset later.
  // First get UT hours of event:
  const utDays = jEvent - Math.floor(jEvent - 0.5) - 0.5; // fraction of day UTC
  let utMinutes = utDays * 1440;
  if (utMinutes < 0) utMinutes += 1440;
  if (utMinutes >= 1440) utMinutes -= 1440;

  // Asia/Tashkent = UTC+5 fixed
  const local = utMinutes + 5 * 60;
  return ((local % 1440) + 1440) % 1440;
}

function minutesToZonedInstant(
  year: number,
  month: number,
  day: number,
  minutes: number,
  timeZone: string,
): Date {
  const hh = Math.floor(minutes / 60);
  const mm = Math.floor(minutes % 60);
  const ss = Math.floor((minutes * 60) % 60);
  return fromZonedTime(new Date(year, month - 1, day, hh, mm, ss), timeZone);
}

/** True when the sun is above the horizon (Tashkent by default). */
export function isSunUp(date: Date = new Date()): boolean {
  const { sunrise, sunset } = getSunriseSunset(date);
  const t = date.getTime();
  return t >= sunrise.getTime() && t < sunset.getTime();
}
