import { FONTS, textPath } from "@/lib/wallpaper/fonts";
import {
  LAYOUT,
  WALLPAPER_WIDTH,
  type ThemeColors,
} from "@/lib/wallpaper/theme";

export function WallpaperFooter(opts: {
  colors: ThemeColors;
  caption?: string;
  hijriLabel?: string;
  holidayLabel?: string;
}): string {
  const { colors, caption, hijriLabel, holidayLabel } = opts;
  const cx = WALLPAPER_WIDTH / 2;
  const sans = FONTS.sans();

  return `
  <g id="wallpaper-header-footer">
    ${textPath({
      font: sans,
      text: "99 имён Аллаха",
      x: cx,
      baseline: LAYOUT.headerY,
      size: 28,
      fill: colors.gold,
      opacity: 0.78,
      letterSpacing: 3.5,
      maxWidth: LAYOUT.maxTextWidth,
    })}
    ${
      hijriLabel
        ? textPath({
            font: sans,
            text: hijriLabel.replace(/\s*г\.\s*AH\s*$/i, "").trim(),
            x: cx,
            baseline: LAYOUT.hijriY,
            size: 24,
            fill: colors.goldSoft,
            opacity: 0.88,
            maxWidth: LAYOUT.maxTextWidth,
          })
        : ""
    }
    ${
      holidayLabel
        ? textPath({
            font: sans,
            text: holidayLabel,
            x: cx,
            baseline: LAYOUT.holidayY,
            size: 22,
            fill: colors.text2,
            opacity: 0.9,
            maxWidth: LAYOUT.maxTextWidth,
          })
        : ""
    }
    ${
      caption
        ? textPath({
            font: sans,
            text: caption,
            x: cx,
            baseline: LAYOUT.captionBaseline,
            size: 26,
            fill: colors.text2,
            opacity: 0.72,
            maxWidth: LAYOUT.maxTextWidth,
          })
        : ""
    }
    ${textPath({
      font: sans,
      text: "ASMA DAILY",
      x: cx,
      baseline: LAYOUT.brandBaseline,
      size: 18,
      fill: colors.goldMuted,
      opacity: 0.55,
      letterSpacing: 10,
    })}
  </g>`;
}
