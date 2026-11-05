import { formatInTimeZone } from "date-fns-tz";
import { DEFAULT_TIMEZONE } from "@/lib/timezone";

export type SkyPeriod = "night" | "dawn" | "day" | "dusk";
export type AppearanceTheme = "light" | "dark";

/** Asia/Tashkent hour (0–23) → sky period for atmosphere. */
export function getSkyPeriod(date: Date = new Date()): SkyPeriod {
  const hour = Number(
    formatInTimeZone(date, DEFAULT_TIMEZONE, "H"),
  );

  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

/**
 * Prefer iPhone / system appearance when available.
 * Light → oq kunduzgi fon; Dark → yulduzli kecha.
 * Falls back to local time of day when media query is unavailable.
 */
export function getAppearancePeriod(
  appearance?: AppearanceTheme | null,
  date: Date = new Date(),
): SkyPeriod {
  if (appearance === "light") return "day";
  if (appearance === "dark") return "night";
  return getSkyPeriod(date);
}

export function isDaylike(period: SkyPeriod): boolean {
  return period === "day" || period === "dawn";
}
