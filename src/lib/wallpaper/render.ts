import { readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import * as hb from "harfbuzzjs";
import { NAMES, type DivineName } from "@/data/names";
import type { DailyProgress } from "@/lib/daily-name";

export const WALLPAPER_WIDTH = 1179;
export const WALLPAPER_HEIGHT = 2556;

const COLORS = {
  bg: "#080619",
  bg2: "#120D30",
  gold: "#F5CC65",
  goldSoft: "#D7B65D",
  text: "#F5F2FF",
  text2: "#AAA5BE",
  muted: "#30234E",
};

/**
 * Layout (iPhone Lock Screen, 1179x2556):
 *  0-520     empty: clock / Dynamic Island / widgets
 *  ~600      soft header
 *  680-1440  dial
 *  1450+     name block
 */
const LAYOUT = {
  headerY: 590,
  hijriY: 640,
  holidayY: 685,
  dialCy: 1080,
  dotsR: 320,
  outerR: 375,
  innerR: 250,
  arabicBaseline: 1690,
  dividerY: 1770,
  russianBaseline: 1885,
  meaningBaseline: 1965,
  captionBaseline: 2045,
  brandBaseline: 2400,
  maxTextWidth: 880,
};

/* ------------------------------------------------------------------ */
/* Fonts → SVG paths                                                   */
/*                                                                     */
/* librsvg (used by sharp) ignores @font-face and depends on system    */
/* fonts, so Cyrillic/Arabic turn into tofu on servers. Instead we     */
/* shape text with HarfBuzz (WASM; Arabic joining + mark positioning)  */
/* and emit glyph outlines as <path>. No font is needed at raster time */
/* and the result is identical on every machine.                       */
/* ------------------------------------------------------------------ */

const FONT_DIR = path.join(process.cwd(), "src", "lib", "wallpaper", "fonts");

type LoadedFont = { font: hb.Font; upem: number; glyphs: Map<number, string> };
const fontCache = new Map<string, LoadedFont>();

function loadFont(file: string): LoadedFont {
  let loaded = fontCache.get(file);
  if (!loaded) {
    const data = readFileSync(path.join(FONT_DIR, file));
    const blob = new hb.Blob(
      data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer,
    );
    const face = new hb.Face(blob);
    loaded = { font: new hb.Font(face), upem: face.upem, glyphs: new Map() };
    fontCache.set(file, loaded);
  }
  return loaded;
}

const FONTS = {
  sans: () => loadFont("NotoSans-Regular.ttf"),
  sansBold: () => loadFont("NotoSans-Bold.ttf"),
  arabic: () => loadFont("Amiri-Regular.ttf"),
};

type TextOptions = {
  font: LoadedFont;
  text: string;
  x: number;
  baseline: number;
  size: number;
  fill: string;
  opacity?: number;
  letterSpacing?: number;
  /** Shrink font size so the line never exceeds this width. */
  maxWidth?: number;
  filter?: string;
};

function textPath(opts: TextOptions): string {
  const { font: loaded, text, fill } = opts;
  if (!text) return "";

  const buffer = new hb.Buffer();
  buffer.addText(text);
  buffer.guessSegmentProperties(); // detects script + RTL for Arabic
  hb.shape(loaded.font, buffer);
  const infos = buffer.getGlyphInfos();
  const positions = buffer.getGlyphPositions();

  const spacing = opts.letterSpacing ?? 0;
  const advanceSum = positions.reduce((sum, p) => sum + p.xAdvance, 0);
  const widthAt = (size: number) =>
    (advanceSum * size) / loaded.upem + spacing * Math.max(0, infos.length - 1);

  let size = opts.size;
  if (opts.maxWidth && widthAt(size) > opts.maxWidth) {
    size = size * (opts.maxWidth / widthAt(size));
  }
  const scale = size / loaded.upem;
  let penX = opts.x - widthAt(size) / 2;

  const parts: string[] = [];
  infos.forEach((info, i) => {
    const pos = positions[i]!;
    const gid = info.codepoint; // glyph id after shaping
    let d = loaded.glyphs.get(gid);
    if (d === undefined) {
      d = loaded.font.glyphToPath(gid);
      loaded.glyphs.set(gid, d);
    }
    if (d) {
      const gx = penX + pos.xOffset * scale;
      const gy = opts.baseline - pos.yOffset * scale;
      parts.push(
        `<path transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})" d="${d}"/>`,
      );
    }
    penX += pos.xAdvance * scale + spacing;
  });

  const attrs = [
    `fill="${fill}"`,
    opts.opacity !== undefined ? `opacity="${opts.opacity}"` : "",
    opts.filter ? `filter="url(#${opts.filter})"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<g ${attrs}>${parts.join("")}</g>`;
}

/* ------------------------------------------------------------------ */
/* Decorative pieces                                                   */
/* ------------------------------------------------------------------ */

function buildStars(count: number): string {
  const stars: string[] = [];
  const minY = 560; // keep the clock area clean
  for (let i = 0; i < count; i++) {
    const x = ((i * 97 + 31) % 1000) / 1000;
    const y = ((i * 53 + 17) % 1000) / 1000;
    const py = minY + y * (WALLPAPER_HEIGHT - minY);
    const bright = i % 9 === 0;
    const r = bright ? 2.2 + (i % 3) * 0.5 : 1.1 + (i % 4) * 0.4;
    const opacity = bright ? 0.55 + (i % 3) * 0.12 : 0.28 + (i % 5) * 0.08;
    const glow = bright
      ? `<circle cx="${(x * WALLPAPER_WIDTH).toFixed(1)}" cy="${py.toFixed(1)}" r="${(r * 3).toFixed(1)}" fill="${COLORS.gold}" opacity="0.12"/>`
      : "";
    stars.push(
      `${glow}<circle cx="${(x * WALLPAPER_WIDTH).toFixed(1)}" cy="${py.toFixed(1)}" r="${r}" fill="${bright ? "#FFF6E0" : COLORS.gold}" opacity="${opacity.toFixed(2)}"/>`,
    );
  }
  return stars.join("\n");
}

/** 99 dots around the ring: passed = gold, upcoming = dim, current = glowing. */
function buildDots(currentIndex: number, cx: number, cy: number, radius: number): string {
  const n = NAMES.length;
  const parts: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === currentIndex) continue;
    const passed = i < currentIndex;
    const quarter = i % 9 === 0;
    const r = quarter ? 4.2 : 3;
    const fill = passed ? COLORS.gold : COLORS.text2;
    const opacity = passed ? (quarter ? 0.9 : 0.65) : quarter ? 0.4 : 0.22;
    parts.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${fill}" opacity="${opacity}"/>`,
    );
  }
  return parts.join("\n");
}

/** Rub el Hizb: two overlapping squares (one rotated 45°) + inner circle. */
function rubElHizb(cx: number, cy: number, s: number): string {
  const sq = (rot: number, stroke: string, w: number, op: number) =>
    `<rect x="${-s / Math.SQRT2}" y="${-s / Math.SQRT2}" width="${(s * 2) / Math.SQRT2}" height="${(s * 2) / Math.SQRT2}" transform="rotate(${rot})" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" opacity="${op}"/>`;
  return `
    <g transform="translate(${cx} ${cy})" filter="url(#softGlow)">
      ${sq(0, COLORS.gold, 2.6, 0.95)}
      ${sq(45, COLORS.gold, 2.6, 0.95)}
      <circle r="${s * 0.62}" fill="${COLORS.bg}" fill-opacity="0.6" stroke="${COLORS.goldSoft}" stroke-width="1.4" opacity="0.7"/>
    </g>`;
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export function buildWallpaperSvg(
  name: DivineName,
  progress: DailyProgress,
  options?: {
    phrase?: string;
    caption?: string;
    hijriLabel?: string;
    nextHolidayLabel?: string;
  },
): string {
  const caption = options?.caption ?? "Повторяй вместе с нами — в сердце";
  const hijriLabel = options?.hijriLabel?.trim() ?? "";
  const holidayLabel = options?.nextHolidayLabel?.trim() ?? "";
  const index = name.id - 1;
  const cx = WALLPAPER_WIDTH / 2;
  const { dialCy: cy, dotsR, outerR, innerR } = LAYOUT;

  const sans = FONTS.sans();
  const sansBold = FONTS.sansBold();
  const arabic = FONTS.arabic();

  const pointerAngle = (index / NAMES.length) * Math.PI * 2 - Math.PI / 2;
  const px = cx + Math.cos(pointerAngle) * dotsR;
  const py = cy + Math.sin(pointerAngle) * dotsR;
  const pStartX = cx + Math.cos(pointerAngle) * 135;
  const pStartY = cy + Math.sin(pointerAngle) * 135;
  const pEndX = cx + Math.cos(pointerAngle) * (dotsR - 18);
  const pEndY = cy + Math.sin(pointerAngle) * (dotsR - 18);

  const numberText = String(progress.current);
  const numberSize = numberText.length > 2 ? 54 : 66;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WALLPAPER_WIDTH}" height="${WALLPAPER_HEIGHT}" viewBox="0 0 ${WALLPAPER_WIDTH} ${WALLPAPER_HEIGHT}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="42%" r="70%">
      <stop offset="0%" stop-color="${COLORS.bg2}"/>
      <stop offset="100%" stop-color="${COLORS.bg}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLORS.gold}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${COLORS.gold}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pointer" gradientUnits="userSpaceOnUse" x1="${pStartX.toFixed(1)}" y1="${pStartY.toFixed(1)}" x2="${pEndX.toFixed(1)}" y2="${pEndY.toFixed(1)}">
      <stop offset="0%" stop-color="${COLORS.gold}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${COLORS.gold}" stop-opacity="0.7"/>
    </linearGradient>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="textGlow" x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="9" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${buildStars(140)}

  <!-- Soft header (below clock safe zone) -->
  ${textPath({ font: sans, text: "99 имён Аллаха", x: cx, baseline: LAYOUT.headerY, size: 32, fill: COLORS.gold, opacity: 0.75, letterSpacing: 3, maxWidth: LAYOUT.maxTextWidth })}
  ${
    hijriLabel
      ? textPath({
          font: sans,
          text: hijriLabel.replace(/\s*г\.\s*AH\s*$/i, "").trim(),
          x: cx,
          baseline: LAYOUT.hijriY,
          size: 26,
          fill: COLORS.goldSoft,
          opacity: 0.9,
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
          size: 24,
          fill: COLORS.text2,
          opacity: 0.95,
          maxWidth: LAYOUT.maxTextWidth,
        })
      : ""
  }

  <!-- Dial -->
  <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="${COLORS.goldSoft}" stroke-width="1.2" opacity="0.35"/>
  <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="${COLORS.muted}" stroke-width="1.2" opacity="0.7"/>
  <circle cx="${cx}" cy="${cy}" r="${dotsR - 38}" fill="none" stroke="${COLORS.muted}" stroke-width="1" opacity="0.45"/>

  ${buildDots(index, cx, cy, dotsR)}

  <!-- Pointer -->
  <line x1="${pStartX.toFixed(1)}" y1="${pStartY.toFixed(1)}" x2="${pEndX.toFixed(1)}" y2="${pEndY.toFixed(1)}" stroke="url(#pointer)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="34" fill="url(#glow)"/>
  <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9" fill="${COLORS.gold}" filter="url(#softGlow)"/>

  <!-- Center -->
  ${rubElHizb(cx, cy, 128)}
  ${textPath({ font: sansBold, text: numberText, x: cx, baseline: cy + numberSize * 0.36, size: numberSize, fill: COLORS.text })}

  <!-- Name block -->
  <ellipse cx="${cx}" cy="${LAYOUT.arabicBaseline - 50}" rx="300" ry="100" fill="url(#glow)" opacity="0.7"/>
  ${textPath({ font: arabic, text: name.arabic, x: cx, baseline: LAYOUT.arabicBaseline, size: 170, fill: COLORS.gold, maxWidth: LAYOUT.maxTextWidth, filter: "textGlow" })}

  <line x1="${cx - 190}" y1="${LAYOUT.dividerY}" x2="${cx - 22}" y2="${LAYOUT.dividerY}" stroke="${COLORS.goldSoft}" stroke-width="1.5" opacity="0.7"/>
  <polygon points="${cx},${LAYOUT.dividerY - 8} ${cx + 8},${LAYOUT.dividerY} ${cx},${LAYOUT.dividerY + 8} ${cx - 8},${LAYOUT.dividerY}" fill="${COLORS.gold}"/>
  <line x1="${cx + 22}" y1="${LAYOUT.dividerY}" x2="${cx + 190}" y2="${LAYOUT.dividerY}" stroke="${COLORS.goldSoft}" stroke-width="1.5" opacity="0.7"/>

  ${textPath({ font: sansBold, text: name.russianName, x: cx, baseline: LAYOUT.russianBaseline, size: 76, fill: COLORS.text, maxWidth: LAYOUT.maxTextWidth })}
  ${textPath({ font: sans, text: name.russianMeaning, x: cx, baseline: LAYOUT.meaningBaseline, size: 46, fill: COLORS.gold, maxWidth: LAYOUT.maxTextWidth })}
  ${textPath({ font: sans, text: caption, x: cx, baseline: LAYOUT.captionBaseline, size: 28, fill: COLORS.text2, opacity: 0.85, maxWidth: LAYOUT.maxTextWidth })}

  ${textPath({ font: sans, text: "ASMA DAILY", x: cx, baseline: LAYOUT.brandBaseline, size: 20, fill: COLORS.goldSoft, opacity: 0.55, letterSpacing: 9 })}
</svg>`;
}

export async function renderWallpaperPng(
  name: DivineName,
  progress: DailyProgress,
  options?: {
    phrase?: string;
    caption?: string;
    hijriLabel?: string;
    nextHolidayLabel?: string;
  },
): Promise<Buffer> {
  const svg = buildWallpaperSvg(name, progress, options);
  return sharp(Buffer.from(svg))
    .resize(WALLPAPER_WIDTH, WALLPAPER_HEIGHT, { fit: "fill" })
    .png({ compressionLevel: 8 })
    .toBuffer();
}
