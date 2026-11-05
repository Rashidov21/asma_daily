import { describe, expect, it } from "vitest";
import { getSunriseSunset, isSunUp } from "@/lib/sun";
import { parseWallpaperTheme } from "@/lib/wallpaper/theme";

describe("sun + wallpaper theme auto", () => {
  it("computes sunrise before sunset for Tashkent", () => {
    const { sunrise, sunset } = getSunriseSunset(
      new Date("2026-06-15T12:00:00+05:00"),
    );
    expect(sunrise.getTime()).toBeLessThan(sunset.getTime());
    // June: sunrise roughly 04:xx–05:xx, sunset 19:xx–20:xx local
    const riseH = Number(
      sunrise.toLocaleString("en-GB", {
        timeZone: "Asia/Tashkent",
        hour: "numeric",
        hour12: false,
      }),
    );
    const setH = Number(
      sunset.toLocaleString("en-GB", {
        timeZone: "Asia/Tashkent",
        hour: "numeric",
        hour12: false,
      }),
    );
    expect(riseH).toBeGreaterThanOrEqual(4);
    expect(riseH).toBeLessThanOrEqual(6);
    expect(setH).toBeGreaterThanOrEqual(18);
    expect(setH).toBeLessThanOrEqual(21);
  });

  it("isSunUp is true at noon and false at midnight Tashkent", () => {
    expect(isSunUp(new Date("2026-11-05T12:00:00+05:00"))).toBe(true);
    expect(isSunUp(new Date("2026-11-05T01:00:00+05:00"))).toBe(false);
  });

  it("parseWallpaperTheme auto follows the sun", () => {
    expect(parseWallpaperTheme("auto", new Date("2026-11-05T12:00:00+05:00"))).toBe(
      "light",
    );
    expect(parseWallpaperTheme("auto", new Date("2026-11-05T22:00:00+05:00"))).toBe(
      "dark",
    );
    expect(parseWallpaperTheme(null, new Date("2026-11-05T12:00:00+05:00"))).toBe(
      "light",
    );
    expect(parseWallpaperTheme("light")).toBe("light");
    expect(parseWallpaperTheme("dark")).toBe("dark");
  });
});
