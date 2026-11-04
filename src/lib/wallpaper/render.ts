import sharp from "sharp";
import { NAMES, type DivineName } from "@/data/names";
import type { DailyProgress } from "@/lib/daily-name";

export const WALLPAPER_WIDTH = 1179;
export const WALLPAPER_HEIGHT = 2556;

const COLORS = {
  bg: "#080619",
  bg2: "#100B2A",
  gold: "#F5CC65",
  goldSoft: "#D7B65D",
  text: "#F5F2FF",
  text2: "#AAA5BE",
  muted: "#30234E",
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildStars(count: number): string {
  const stars: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = ((i * 97) % 1000) / 1000;
    const y = ((i * 53) % 1000) / 1000;
    const r = 0.6 + (i % 3) * 0.4;
    const opacity = 0.15 + (i % 5) * 0.08;
    stars.push(
      `<circle cx="${(x * WALLPAPER_WIDTH).toFixed(1)}" cy="${(y * WALLPAPER_HEIGHT).toFixed(1)}" r="${r}" fill="${COLORS.gold}" opacity="${opacity.toFixed(2)}"/>`,
    );
  }
  return stars.join("\n");
}

function buildRingLabels(currentIndex: number, cx: number, cy: number, radius: number): string {
  const parts: string[] = [];
  const n = NAMES.length;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    const rot = (angle * 180) / Math.PI + 90;
    const name = NAMES[i]!;
    const isCurrent = i === currentIndex;
    const fill = isCurrent ? COLORS.gold : COLORS.text;
    const opacity = isCurrent ? 1 : 0.55;
    const size = isCurrent ? 13 : 9;
    parts.push(
      `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${fill}" opacity="${opacity}" font-size="${size}" font-family="Helvetica, Arial, sans-serif" text-anchor="middle" dominant-baseline="middle" transform="rotate(${rot.toFixed(2)}, ${x.toFixed(1)}, ${y.toFixed(1)})">${escapeXml(name.uzbekName)}</text>`,
    );
  }
  return parts.join("\n");
}

function buildProgressSegments(
  progress: DailyProgress,
  x: number,
  y: number,
  width: number,
  height: number,
): string {
  const segments = 33;
  const gap = 4;
  const segW = (width - gap * (segments - 1)) / segments;
  const filled = Math.round((progress.current / progress.total) * segments);
  const rects: string[] = [];
  for (let i = 0; i < segments; i++) {
    const sx = x + i * (segW + gap);
    const color = i < filled ? COLORS.gold : COLORS.muted;
    const opacity = i < filled ? 1 : 0.55;
    rects.push(
      `<rect x="${sx.toFixed(1)}" y="${y}" width="${segW.toFixed(1)}" height="${height}" rx="2" fill="${color}" opacity="${opacity}"/>`,
    );
  }
  return rects.join("\n");
}

function rubElHizb(cx: number, cy: number, size: number): string {
  const s = size;
  return `
    <g transform="translate(${cx}, ${cy})">
      <polygon points="0,${-s} ${s * 0.35},${-s * 0.35} ${s},0 ${s * 0.35},${s * 0.35} 0,${s} ${-s * 0.35},${s * 0.35} ${-s},0 ${-s * 0.35},${-s * 0.35}" fill="none" stroke="${COLORS.gold}" stroke-width="2.5" opacity="0.95"/>
      <polygon points="0,${-s * 0.72} ${s * 0.25},${-s * 0.25} ${s * 0.72},0 ${s * 0.25},${s * 0.25} 0,${s * 0.72} ${-s * 0.25},${s * 0.25} ${-s * 0.72},0 ${-s * 0.25},${-s * 0.25}" fill="none" stroke="${COLORS.goldSoft}" stroke-width="1.5" opacity="0.7"/>
      <circle cx="0" cy="0" r="${s * 0.42}" fill="none" stroke="${COLORS.gold}" stroke-width="1.2" opacity="0.5"/>
    </g>
  `;
}

export function buildWallpaperSvg(
  name: DivineName,
  progress: DailyProgress,
  options?: { phrase?: string; caption?: string },
): string {
  const phrase = options?.phrase ?? "СПОКОЙСТВИЕ СЕРДЦА";
  const caption = options?.caption ?? "Qalbingizda takrorlang — biz bilan birga";
  const index = name.id - 1;
  const cx = WALLPAPER_WIDTH / 2;
  // Leave top clearance for Dynamic Island / clock (~420px)
  const ringCy = 980;
  const ringR = 340;
  const labelR = 390;

  const pointerAngle = (index / NAMES.length) * Math.PI * 2 - Math.PI / 2;
  const px = cx + Math.cos(pointerAngle) * (ringR - 20);
  const py = ringCy + Math.sin(pointerAngle) * (ringR - 20);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WALLPAPER_WIDTH}" height="${WALLPAPER_HEIGHT}" viewBox="0 0 ${WALLPAPER_WIDTH} ${WALLPAPER_HEIGHT}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="${COLORS.bg2}"/>
      <stop offset="100%" stop-color="${COLORS.bg}"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLORS.gold}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${COLORS.gold}" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="textGlow" x="-30%" y="-60%" width="160%" height="220%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  ${buildStars(80)}

  <!-- Header: below clock safe zone -->
  <text x="${cx}" y="460" fill="${COLORS.gold}" font-size="52" font-family="Georgia, 'Times New Roman', serif" font-weight="700" letter-spacing="2" text-anchor="middle" filter="url(#textGlow)">99 имён Аллаха</text>

  <text x="90" y="530" fill="${COLORS.text2}" font-size="22" font-family="Helvetica, Arial, sans-serif" letter-spacing="5">${escapeXml(phrase)}</text>
  <text x="${WALLPAPER_WIDTH - 90}" y="530" fill="${COLORS.gold}" font-size="26" font-family="Helvetica, Arial, sans-serif" font-weight="600" text-anchor="end">${progress.percent}%</text>

  ${buildProgressSegments(progress, 90, 555, WALLPAPER_WIDTH - 180, 10)}

  <!-- Ring -->
  <circle cx="${cx}" cy="${ringCy}" r="${ringR + 50}" fill="none" stroke="${COLORS.muted}" stroke-width="1" opacity="0.5"/>
  <circle cx="${cx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="${COLORS.goldSoft}" stroke-width="1.5" opacity="0.45"/>
  <circle cx="${cx}" cy="${ringCy}" r="${ringR - 70}" fill="none" stroke="${COLORS.muted}" stroke-width="1" opacity="0.4"/>

  ${buildRingLabels(index, cx, ringCy, labelR)}

  <!-- Pointer glow -->
  <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="28" fill="url(#glow)" filter="url(#softGlow)"/>
  <line x1="${cx}" y1="${ringCy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="${COLORS.gold}" stroke-width="2" opacity="0.85"/>
  <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="6" fill="${COLORS.gold}"/>

  ${rubElHizb(cx, ringCy, 78)}
  <text x="${cx}" y="${ringCy + 14}" fill="${COLORS.text}" font-size="56" font-family="Georgia, 'Times New Roman', serif" font-weight="700" text-anchor="middle">${progress.current}</text>

  <!-- Name block -->
  <ellipse cx="${cx}" cy="1555" rx="260" ry="90" fill="url(#glow)" opacity="0.8"/>
  <text x="${cx}" y="1580" fill="${COLORS.gold}" font-size="110" font-family="Amiri, 'Noto Naskh Arabic', 'Noto Sans Arabic', 'Arabic Typesetting', 'Geeza Pro', serif" text-anchor="middle" direction="rtl" filter="url(#textGlow)">${escapeXml(name.arabic)}</text>

  <line x1="${cx - 180}" y1="1650" x2="${cx - 20}" y2="1650" stroke="${COLORS.goldSoft}" stroke-width="1.5" opacity="0.7"/>
  <polygon points="${cx},1642 ${cx + 8},1650 ${cx},1658 ${cx - 8},1650" fill="${COLORS.gold}"/>
  <line x1="${cx + 20}" y1="1650" x2="${cx + 180}" y2="1650" stroke="${COLORS.goldSoft}" stroke-width="1.5" opacity="0.7"/>

  <text x="${cx}" y="1740" fill="${COLORS.text}" font-size="64" font-family="Helvetica, Arial, sans-serif" font-weight="700" text-anchor="middle">${escapeXml(name.uzbekName)}</text>
  <text x="${cx}" y="1820" fill="${COLORS.gold}" font-size="40" font-family="Georgia, 'Times New Roman', serif" text-anchor="middle">${escapeXml(name.uzbekMeaning)}</text>
  <text x="${cx}" y="1900" fill="${COLORS.text2}" font-size="26" font-family="Helvetica, Arial, sans-serif" text-anchor="middle">${escapeXml(caption)}</text>

  <text x="${cx}" y="2050" fill="${COLORS.text2}" font-size="22" font-family="Helvetica, Arial, sans-serif" text-anchor="middle" opacity="0.7">${escapeXml(name.shortReflection)}</text>
  <text x="${cx}" y="2440" fill="${COLORS.goldSoft}" font-size="20" font-family="Helvetica, Arial, sans-serif" text-anchor="middle" opacity="0.6" letter-spacing="9">ASMA DAILY</text>
</svg>`;
}

export async function renderWallpaperPng(
  name: DivineName,
  progress: DailyProgress,
  options?: { phrase?: string; caption?: string },
): Promise<Buffer> {
  const svg = buildWallpaperSvg(name, progress, options);
  return sharp(Buffer.from(svg))
    .resize(WALLPAPER_WIDTH, WALLPAPER_HEIGHT, { fit: "fill" })
    .png({ compressionLevel: 8 })
    .toBuffer();
}
