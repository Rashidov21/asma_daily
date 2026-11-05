import type { DivineName } from "@/data/names";
import { FONTS, textPath } from "@/lib/wallpaper/fonts";
import {
  LAYOUT,
  WALLPAPER_WIDTH,
  type ThemeColors,
} from "@/lib/wallpaper/theme";

/** Short gentle Uzbek reflection from the name data model. */
export function DailyReflection(opts: {
  name: DivineName;
  colors: ThemeColors;
}): string {
  const reflection = opts.name.shortReflection?.trim();
  if (!reflection) return "";

  const cx = WALLPAPER_WIDTH / 2;
  return `
  <g id="daily-reflection">
    ${textPath({
      font: FONTS.sans(),
      text: reflection,
      x: cx,
      baseline: LAYOUT.reflectionBaseline,
      size: 30,
      fill: opts.colors.text2,
      opacity: 0.92,
      maxWidth: LAYOUT.maxTextWidth,
    })}
  </g>`;
}
