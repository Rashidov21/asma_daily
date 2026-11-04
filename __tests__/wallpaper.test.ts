import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDailyPayload } from "@/lib/daily-name";
import { renderWallpaperPng } from "@/lib/wallpaper/render";

describe("wallpaper render", () => {
  it("renders a 1179x2556 PNG", async () => {
    const daily = getDailyPayload("2026-11-04");
    const png = await renderWallpaperPng(daily.name, daily.progress, {
      caption: daily.caption,
    });
    if (process.env.WALLPAPER_OUT) writeFileSync(process.env.WALLPAPER_OUT, png);
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    expect(png.length).toBeGreaterThan(20_000);
  }, 30_000);
});
