import type { DivineName } from "@/data/names";
import { FONTS, textPath } from "@/lib/wallpaper/fonts";
import {
  LAYOUT,
  WALLPAPER_WIDTH,
  type ThemeColors,
  type WallpaperTheme,
} from "@/lib/wallpaper/theme";

/** Arabic name as the primary visual focus — Amiri + HarfBuzz shaping. */
export function ArabicCalligraphy(opts: {
  name: DivineName;
  colors: ThemeColors;
  theme: WallpaperTheme;
}): string {
  const { name, colors, theme } = opts;
  const cx = WALLPAPER_WIDTH / 2;
  const arabic = FONTS.arabic();
  // Longer compound names (e.g. Dhūl-Jalāli) need more shrink headroom
  const baseSize = name.arabic.length > 18 ? 132 : name.arabic.length > 12 ? 150 : 168;
  const filter = theme === "dark" ? "textGlow" : undefined;

  return `
  <g id="arabic-calligraphy">
    <ellipse cx="${cx}" cy="${LAYOUT.arabicBaseline - 48}" rx="320" ry="108" fill="url(#calligraphyHalo)" opacity="0.85"/>
    ${textPath({
      font: arabic,
      text: name.arabic,
      x: cx,
      baseline: LAYOUT.arabicBaseline,
      size: baseSize,
      fill: colors.gold,
      maxWidth: LAYOUT.maxTextWidth,
      filter,
    })}
  </g>`;
}
