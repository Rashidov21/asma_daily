import { NAMES } from "@/data/names";
import { FONTS, textPath } from "@/lib/wallpaper/fonts";
import {
  LAYOUT,
  WALLPAPER_WIDTH,
  type DailyVariation,
  type ThemeColors,
} from "@/lib/wallpaper/theme";

function rubElHizb(
  cx: number,
  cy: number,
  s: number,
  colors: ThemeColors,
  style: DailyVariation["ornamentStyle"],
): string {
  const sq = (rot: number, w: number, op: number) =>
    `<rect x="${-s / Math.SQRT2}" y="${-s / Math.SQRT2}" width="${(s * 2) / Math.SQRT2}" height="${(s * 2) / Math.SQRT2}" transform="rotate(${rot})" fill="none" stroke="${colors.gold}" stroke-width="${w}" stroke-linejoin="round" opacity="${op}"/>`;

  const extras =
    style === 1
      ? `<circle r="${s * 0.82}" fill="none" stroke="${colors.goldMuted}" stroke-width="0.8" opacity="0.45" stroke-dasharray="3 5"/>`
      : style === 2
        ? `<circle r="${s * 0.38}" fill="none" stroke="${colors.goldSoft}" stroke-width="1" opacity="0.5"/>`
        : "";

  return `
    <g transform="translate(${cx} ${cy})" filter="url(#softGlow)">
      ${sq(0, 2.2, 0.92)}
      ${sq(45, 2.2, 0.92)}
      ${extras}
      <circle r="${s * 0.58}" fill="${colors.bg}" fill-opacity="0.72" stroke="${colors.goldSoft}" stroke-width="1.2" opacity="0.75"/>
    </g>`;
}

export function DailyOrbit(opts: {
  currentIndex: number;
  currentNumber: number;
  colors: ThemeColors;
  variation: DailyVariation;
}): string {
  const { currentIndex, currentNumber, colors, variation } = opts;
  const cx = WALLPAPER_WIDTH / 2;
  const cy = LAYOUT.dialCy;
  const { dotsR, outerR, midR, innerR } = LAYOUT;
  const n = NAMES.length;

  const angle = (currentIndex / n) * Math.PI * 2 - Math.PI / 2;
  const px = cx + Math.cos(angle) * dotsR;
  const py = cy + Math.sin(angle) * dotsR;
  const pStartX = cx + Math.cos(angle) * 128;
  const pStartY = cy + Math.sin(angle) * 128;
  const pEndX = cx + Math.cos(angle) * (dotsR - 16);
  const pEndY = cy + Math.sin(angle) * (dotsR - 16);

  const dots: string[] = [];
  for (let i = 0; i < n; i++) {
    if (i === currentIndex) continue;
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(a) * dotsR;
    const y = cy + Math.sin(a) * dotsR;
    const passed = i < currentIndex;
    const quarter = i % 9 === 0;
    const r = quarter ? 3.6 : 2.5;
    const fill = passed ? colors.gold : colors.text2;
    const opacity = passed ? (quarter ? 0.78 : 0.52) : quarter ? 0.32 : 0.16;
    dots.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" opacity="${opacity}"/>`,
    );
  }

  const numberText = String(currentNumber);
  const numberSize = numberText.length > 2 ? 50 : 62;
  const sansBold = FONTS.sansBold();

  return `
  <g id="daily-orbit">
    <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="${colors.goldSoft}" stroke-width="1.1" opacity="0.32"/>
    <circle cx="${cx}" cy="${cy}" r="${midR}" fill="none" stroke="${colors.muted}" stroke-width="1" opacity="0.55"/>
    <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="${colors.muted}" stroke-width="0.9" opacity="0.4"/>
    <circle cx="${cx}" cy="${cy}" r="${dotsR}" fill="none" stroke="${colors.goldMuted}" stroke-width="0.7" opacity="0.22"/>

    ${dots.join("\n")}

    <line x1="${pStartX.toFixed(1)}" y1="${pStartY.toFixed(1)}" x2="${pEndX.toFixed(1)}" y2="${pEndY.toFixed(1)}" stroke="url(#pointer)" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(28 * variation.glowBoost).toFixed(1)}" fill="url(#glow)"/>
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="7.5" fill="${colors.gold}" filter="url(#softGlow)"/>
    <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="2.2" fill="${colors.starBright}" opacity="0.9"/>

    ${rubElHizb(cx, cy, 118, colors, variation.ornamentStyle)}
    ${textPath({
      font: sansBold,
      text: numberText,
      x: cx,
      baseline: cy + numberSize * 0.36,
      size: numberSize,
      fill: colors.text,
    })}
  </g>`;
}

export function orbitPointerCoords(currentIndex: number) {
  const cx = WALLPAPER_WIDTH / 2;
  const cy = LAYOUT.dialCy;
  const angle = (currentIndex / NAMES.length) * Math.PI * 2 - Math.PI / 2;
  return {
    x1: cx + Math.cos(angle) * 128,
    y1: cy + Math.sin(angle) * 128,
    x2: cx + Math.cos(angle) * (LAYOUT.dotsR - 16),
    y2: cy + Math.sin(angle) * (LAYOUT.dotsR - 16),
  };
}
