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

  it("has Uzbek reflections for all 99 names", () => {
    expect(NAMES).toHaveLength(99);
    for (const name of NAMES) {
      expect(name.shortReflection.trim().length).toBeGreaterThan(5);
    }
  });

  it(
    "builds SVG for all 99 names and PNGs for longest Arabic names",
    async () => {
      const { buildWallpaperSvg } = await import("@/lib/wallpaper/render");
      // Arabic is emitted as HarfBuzz glyph paths — assert structure + reflection text.
      const longIds = new Set([84, 85]);
      for (const name of NAMES) {
        const progress = {
          current: name.id,
          total: 99,
          percent: Math.round((name.id / 99) * 100),
        };
        const opts = { theme: "dark" as const, date: "2026-01-01", caption: "test" };
        const svg = buildWallpaperSvg(name, progress, opts);
        expect(svg).toContain('id="arabic-calligraphy"');
        expect(svg).toContain('id="daily-orbit"');
        expect(svg).toContain('id="islamic-pattern"');
        expect(svg).not.toContain('id="decorative-frame"');
        expect(svg).not.toContain('id="daily-reflection"');
        expect(svg.length).toBeGreaterThan(5_000);
        if (longIds.has(name.id)) {
          const png = await renderWallpaperPng(name, progress, {
            ...opts,
            theme: "light",
          });
          expect(png.subarray(1, 4).toString()).toBe("PNG");
        }
      }
    },
    60_000,
  );
});
