import {
  WALLPAPER_WIDTH,
  type DailyVariation,
  type ThemeColors,
} from "@/lib/wallpaper/theme";

/** Subtle geometric lattice — low opacity, clock-safe. */
export function IslamicPattern(opts: {
  colors: ThemeColors;
  variation: DailyVariation;
}): string {
  const { colors, variation } = opts;
  const op = variation.patternOpacity;
  const rot = variation.patternRotation;
  const cx = WALLPAPER_WIDTH / 2;
  const cy = 1180;

  const star = (s: number, strokeOp: number) => {
    const a = s / Math.SQRT2;
    return `
      <g opacity="${strokeOp}">
        <rect x="${-a}" y="${-a}" width="${a * 2}" height="${a * 2}" fill="none" stroke="${colors.pattern}" stroke-width="0.8"/>
        <rect x="${-a}" y="${-a}" width="${a * 2}" height="${a * 2}" transform="rotate(45)" fill="none" stroke="${colors.pattern}" stroke-width="0.8"/>
      </g>`;
  };

  const rings = [160, 240, 340, 460]
    .map(
      (r, i) =>
        `<circle r="${r}" fill="none" stroke="${colors.pattern}" stroke-width="0.7" opacity="${(op * (1.2 - i * 0.15)).toFixed(3)}"/>`,
    )
    .join("");

  return `
  <g id="islamic-pattern" transform="translate(${cx} ${cy}) rotate(${rot.toFixed(1)})">
    ${rings}
    ${star(90, op * 1.8)}
    ${star(55, op * 2.2)}
  </g>`;
}
