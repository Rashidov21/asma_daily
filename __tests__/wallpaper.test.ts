import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { NAMES } from "@/data/names";
import { getDailyPayload } from "@/lib/daily-name";
import {
  renderWallpaperPng,
  type WallpaperTheme,
} from "@/lib/wallpaper/render";

describe("wallpaper render", () => {
  it.each(["dark", "light"] as WallpaperTheme[])(
    "renders a premium 1179x2556 %s PNG",
    async (theme) => {
      const daily = getDailyPayload("2026-11-04");
      const png = await renderWallpaperPng(daily.name, daily.progress, {
        caption: daily.caption,
        hijriLabel: daily.hijriLabel,
        nextHolidayLabel: daily.nextHolidayLabel,
        theme,
        date: daily.date,
      });
      if (process.env.WALLPAPER_OUT) {
        const outDir = path.dirname(process.env.WALLPAPER_OUT);
        mkdirSync(outDir, { recursive: true });
        const out =
          theme === "dark"
            ? process.env.WALLPAPER_OUT
            : process.env.WALLPAPER_OUT.replace(/(\.\w+)$/, `-${theme}$1`);
        writeFileSync(out, png);
      }
      expect(png.subarray(1, 4).toString()).toBe("PNG");
      expect(png.length).toBeGreaterThan(20_000);
    },
    30_000,
  );

  it(
    "renders all 99 names without throwing (dark)",
    async () => {
      for (const name of NAMES) {
        const progress = { current: name.id, total: 99, percent: Math.round((name.id / 99) * 100) };
        const png = await renderWallpaperPng(name, progress, {
          theme: "dark",
          date: "2026-01-01",
          caption: "test",
        });
        expect(png.subarray(1, 4).toString()).toBe("PNG");
        expect(name.shortReflection.length).toBeGreaterThan(5);
      }
    },
    180_000,
  );
});
