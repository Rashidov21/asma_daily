import {
  LAYOUT,
  WALLPAPER_HEIGHT,
  WALLPAPER_WIDTH,
  type ThemeColors,
} from "@/lib/wallpaper/theme";

/** Thin gold frame with minimal corner ornaments — clears clock / island. */
export function DecorativeFrame(opts: { colors: ThemeColors }): string {
  const { colors } = opts;
  const inset = LAYOUT.frameInset;
  const top = LAYOUT.safeTop - 8;
  const bottom = WALLPAPER_HEIGHT - inset;
  const left = inset;
  const right = WALLPAPER_WIDTH - inset;
  const c = LAYOUT.frameCorner;
  const op = colors.frameOpacity;
  const stroke = colors.frame;

  const corner = (x: number, y: number, sx: number, sy: number) => `
    <g transform="translate(${x} ${y}) scale(${sx} ${sy})" opacity="${op}">
      <path d="M0 ${c} L0 0 L${c} 0" fill="none" stroke="${stroke}" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M8 ${c * 0.55} L8 8 L${c * 0.55} 8" fill="none" stroke="${stroke}" stroke-width="0.8" stroke-linecap="round" opacity="0.7"/>
      <circle cx="14" cy="14" r="1.6" fill="${stroke}" opacity="0.85"/>
    </g>`;

  return `
  <g id="decorative-frame">
    <rect x="${left}" y="${top}" width="${right - left}" height="${bottom - top}"
      fill="none" stroke="${stroke}" stroke-width="0.9" opacity="${(op * 0.55).toFixed(2)}" rx="8"/>
    ${corner(left, top, 1, 1)}
    ${corner(right, top, -1, 1)}
    ${corner(left, bottom, 1, -1)}
    ${corner(right, bottom, -1, -1)}
  </g>`;
}
