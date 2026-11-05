import sharp from "sharp";
import type { DivineName } from "@/data/names";
import type { DailyProgress } from "@/lib/daily-name";
import {
  ArabicCalligraphy,
  DailyMeaning,
  DailyOrbit,
  IslamicPattern,
  WallpaperBackground,
  WallpaperFooter,
  orbitPointerCoords,
  wallpaperDefs,
} from "@/lib/wallpaper/components";
import {
  WALLPAPER_HEIGHT,
  WALLPAPER_WIDTH,
  THEME_COLORS,
  getDailyVariation,
  parseWallpaperTheme,
  type WallpaperTheme,
} from "@/lib/wallpaper/theme";

export {
  WALLPAPER_WIDTH,
  WALLPAPER_HEIGHT,
  parseWallpaperTheme,
  type WallpaperTheme,
};

export type WallpaperRenderOptions = {
  phrase?: string;
  caption?: string;
  hijriLabel?: string;
  nextHolidayLabel?: string;
  theme?: WallpaperTheme;
  /** YYYY-MM-DD — drives deterministic daily visual variation */
  date?: string;
};

export function buildWallpaperSvg(
  name: DivineName,
  progress: DailyProgress,
  options?: WallpaperRenderOptions,
): string {
  const theme = options?.theme ?? "dark";
  const colors = THEME_COLORS[theme];
  const variation = getDailyVariation(options?.date, name.id);
  const index = name.id - 1;
  const pointer = orbitPointerCoords(index);
  const caption = options?.caption ?? "Повторяй вместе с нами — в сердце";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WALLPAPER_WIDTH}" height="${WALLPAPER_HEIGHT}" viewBox="0 0 ${WALLPAPER_WIDTH} ${WALLPAPER_HEIGHT}">
  ${wallpaperDefs({ colors, theme, variation, pointer })}
  ${WallpaperBackground({ theme, colors, variation })}
  ${IslamicPattern({ colors, variation })}
  ${WallpaperFooter({
    colors,
    caption,
    hijriLabel: options?.hijriLabel,
    holidayLabel: options?.nextHolidayLabel,
  })}
  ${DailyOrbit({
    currentIndex: index,
    currentNumber: progress.current,
    colors,
    variation,
  })}
  ${ArabicCalligraphy({ name, colors, theme })}
  ${DailyMeaning({ name, colors })}
</svg>`;
}

export async function renderWallpaperPng(
  name: DivineName,
  progress: DailyProgress,
  options?: WallpaperRenderOptions,
): Promise<Buffer> {
  const svg = buildWallpaperSvg(name, progress, options);
  return sharp(Buffer.from(svg))
    .resize(WALLPAPER_WIDTH, WALLPAPER_HEIGHT, { fit: "fill" })
    .png({ compressionLevel: 8 })
    .toBuffer();
}
