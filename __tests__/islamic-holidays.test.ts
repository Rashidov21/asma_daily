import { describe, it, expect } from "vitest";
import {
  formatDaysUntilRu,
  getNextIslamicHoliday,
} from "@/lib/islamic-holidays";
import { getDailyPayload } from "@/lib/daily-name";

describe("islamic holidays", () => {
  it("finds next holiday on or after a known date", () => {
    // 2026-02-18 ≈ 1 Ramadan 1447 per hijri-converter sample earlier
    const next = getNextIslamicHoliday("2026-02-01");
    expect(next.daysUntil).toBeGreaterThanOrEqual(0);
    expect(next.holiday.nameRu.length).toBeGreaterThan(0);
  });

  it("marks today when holiday falls on that day", () => {
    const probe = getNextIslamicHoliday("2025-06-06");
    const onDay = getNextIslamicHoliday(probe.gregorianDate);
    expect(onDay.isToday).toBe(true);
    expect(onDay.daysUntil).toBe(0);
  });

  it("formats Russian day counts", () => {
    expect(formatDaysUntilRu(0)).toBe("сегодня");
    expect(formatDaysUntilRu(1)).toBe("завтра");
    expect(formatDaysUntilRu(2)).toContain("дня");
    expect(formatDaysUntilRu(5)).toContain("дней");
  });
});

describe("daily payload dates", () => {
  it("includes gregorian, hijri and next holiday labels in Russian", () => {
    const p = getDailyPayload("2026-11-04");
    expect(p.gregorianLabel).toMatch(/2026/);
    expect(p.hijriLabel.length).toBeGreaterThan(5);
    expect(p.nextHolidayLabel).toMatch(/Сегодня:|Скоро:/);
    expect(p.name.russianName).toBeTruthy();
    expect(p.caption).toMatch(/Повторяй/);
  });
});
