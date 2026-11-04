import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getDailyName,
  getDailyNameIndex,
  getDailyProgress,
} from "@/lib/daily-name";

describe("daily-name rotation", () => {
  const prev = process.env.DAILY_ANCHOR_DATE;

  beforeEach(() => {
    process.env.DAILY_ANCHOR_DATE = "2025-01-01";
  });

  afterEach(() => {
    process.env.DAILY_ANCHOR_DATE = prev;
  });

  it("first day is index 0 (name 1)", () => {
    expect(getDailyNameIndex("2025-01-01")).toBe(0);
    expect(getDailyName("2025-01-01").id).toBe(1);
    expect(getDailyProgress("2025-01-01")).toEqual({
      current: 1,
      total: 99,
      percent: 1,
    });
  });

  it("second day is index 1 (name 2)", () => {
    expect(getDailyNameIndex("2025-01-02")).toBe(1);
    expect(getDailyName("2025-01-02").id).toBe(2);
  });

  it("99th day is index 98 (name 99)", () => {
    // 2025-01-01 + 98 days = 2025-04-09
    expect(getDailyNameIndex("2025-04-09")).toBe(98);
    expect(getDailyName("2025-04-09").id).toBe(99);
    expect(getDailyProgress("2025-04-09").current).toBe(99);
  });

  it("100th day wraps to first name", () => {
    // 2025-01-01 + 99 days = 2025-04-10
    expect(getDailyNameIndex("2025-04-10")).toBe(0);
    expect(getDailyName("2025-04-10").id).toBe(1);
  });

  it("handles leap year dates", () => {
    process.env.DAILY_ANCHOR_DATE = "2024-02-28";
    expect(getDailyNameIndex("2024-02-28")).toBe(0);
    expect(getDailyNameIndex("2024-02-29")).toBe(1);
    expect(getDailyNameIndex("2024-03-01")).toBe(2);
  });

  it("same Tashkent calendar day is stable across UTC hours", () => {
    // 2025-06-15 00:30 in Tashkent = 2025-06-14 19:30 UTC
    const beforeMidnightUtc = new Date("2025-06-14T19:30:00.000Z");
    // 2025-06-15 23:30 in Tashkent = 2025-06-15 18:30 UTC
    const lateDayUtc = new Date("2025-06-15T18:30:00.000Z");
    expect(getDailyNameIndex(beforeMidnightUtc)).toBe(
      getDailyNameIndex("2025-06-15"),
    );
    expect(getDailyNameIndex(lateDayUtc)).toBe(getDailyNameIndex("2025-06-15"));
  });

  it("timezone boundary: just before Tashkent midnight differs from after", () => {
    // Tashkent UTC+5: 2025-03-10 00:00 Tashkent = 2025-03-09 19:00 UTC
    const justBefore = new Date("2025-03-09T18:59:00.000Z"); // still Mar 9 in Tashkent
    const justAfter = new Date("2025-03-09T19:00:00.000Z"); // Mar 10 in Tashkent
    expect(getDailyNameIndex(justBefore)).toBe(getDailyNameIndex("2025-03-09"));
    expect(getDailyNameIndex(justAfter)).toBe(getDailyNameIndex("2025-03-10"));
    expect(getDailyNameIndex(justBefore)).not.toBe(getDailyNameIndex(justAfter));
  });
});
