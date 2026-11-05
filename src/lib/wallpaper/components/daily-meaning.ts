import type { DivineName } from "@/data/names";
import { FONTS, textPath } from "@/lib/wallpaper/fonts";
import {
  LAYOUT,
  WALLPAPER_WIDTH,
  type ThemeColors,
} from "@/lib/wallpaper/theme";

/** Ornamental divider + Russian name + meaning. */
export function DailyMeaning(opts: {
  name: DivineName;
  colors: ThemeColors;
}): string {
  const { name, colors } = opts;
  const cx = WALLPAPER_WIDTH / 2;
  const y = LAYOUT.dividerY;
  const sans = FONTS.sans();
  const sansBold = FONTS.sansBold();

  return `
  <g id="daily-meaning">
    <line x1="${cx - 200}" y1="${y}" x2="${cx - 24}" y2="${y}" stroke="${colors.goldSoft}" stroke-width="1.3" opacity="0.65"/>
    <polygon points="${cx},${y - 7} ${cx + 7},${y} ${cx},${y + 7} ${cx - 7},${y}" fill="${colors.gold}" opacity="0.95"/>
    <line x1="${cx + 24}" y1="${y}" x2="${cx + 200}" y2="${y}" stroke="${colors.goldSoft}" stroke-width="1.3" opacity="0.65"/>

    ${textPath({
      font: sansBold,
      text: name.russianName,
      x: cx,
      baseline: LAYOUT.russianBaseline,
      size: 70,
      fill: colors.text,
      maxWidth: LAYOUT.maxTextWidth,
    })}
    ${textPath({
      font: sans,
      text: name.russianMeaning,
      x: cx,
      baseline: LAYOUT.meaningBaseline,
      size: 42,
      fill: colors.gold,
      maxWidth: LAYOUT.maxTextWidth,
    })}
  </g>`;
}
