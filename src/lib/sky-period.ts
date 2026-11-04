import { formatInTimeZone } from "date-fns-tz";
import { DEFAULT_TIMEZONE } from "@/lib/timezone";

export type SkyPeriod = "night" | "dawn" | "day" | "dusk";

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

export function isDaylike(period: SkyPeriod): boolean {
  return period === "day" || period === "dawn";
}
