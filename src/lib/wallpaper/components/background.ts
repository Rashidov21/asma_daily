import {
  WALLPAPER_HEIGHT,
  WALLPAPER_WIDTH,
  type DailyVariation,
  type ThemeColors,
  type WallpaperTheme,
} from "@/lib/wallpaper/theme";

function hash(n: number): number {
  let x = (n ^ 0x9e3779b9) >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return (x ^ (x >>> 16)) >>> 0;
}

/** Soft celestial star field — restrained count, clock-safe top. */
function starField(colors: ThemeColors, variation: DailyVariation): string {
  const stars: string[] = [];
  const minY = 540;
  const count = 72;
  for (let i = 0; i < count; i++) {
    const h1 = hash(variation.starSeed + i * 97);
    const h2 = hash(variation.starSeed + i * 53 + 11);
    const x = (h1 % 10000) / 10000;
    const y = (h2 % 10000) / 10000;
    const py = minY + y * (WALLPAPER_HEIGHT - minY - 80);
    const bright = i % 11 === 0;
    const r = bright ? 1.8 + (i % 3) * 0.35 : 0.9 + (i % 4) * 0.3;
    const opacity = bright ? 0.42 + (i % 3) * 0.08 : 0.18 + (i % 5) * 0.05;
    const glow = bright
      ? `<circle cx="${(x * WALLPAPER_WIDTH).toFixed(1)}" cy="${py.toFixed(1)}" r="${(r * 2.6).toFixed(1)}" fill="${colors.gold}" opacity="0.08"/>`
      : "";
    stars.push(
      `${glow}<circle cx="${(x * WALLPAPER_WIDTH).toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${bright ? colors.starBright : colors.star}" opacity="${opacity.toFixed(2)}"/>`,
    );
  }
  return `<g id="starfield">${stars.join("\n")}</g>`;
}

/** Soft paper atmosphere for ivory light theme — centered composition. */
function paperAtmosphere(colors: ThemeColors, variation: DailyVariation): string {
  const cx = WALLPAPER_WIDTH / 2;
  const shift = variation.gradientShift * 0.35;
  return `
    <ellipse cx="${cx}" cy="820" rx="380" ry="110" fill="${colors.bg2}" opacity="0.65"/>
    <ellipse cx="${cx - 220 + shift}" cy="1000" rx="300" ry="95" fill="#FFFFFF" opacity="0.22"/>
    <ellipse cx="${cx + 220 - shift}" cy="1000" rx="300" ry="95" fill="#FFFFFF" opacity="0.22"/>
    <ellipse cx="${cx}" cy="1300" rx="420" ry="125" fill="${colors.bg2}" opacity="0.4"/>
    <ellipse cx="${cx}" cy="1600" rx="320" ry="90" fill="#FFFFFF" opacity="0.18"/>
    <circle cx="${cx}" cy="740" r="64" fill="${colors.gold}" opacity="0.06"/>
    <circle cx="${cx}" cy="740" r="32" fill="${colors.goldSoft}" opacity="0.09"/>
  `;
}

export function WallpaperBackground(opts: {
  theme: WallpaperTheme;
  colors: ThemeColors;
  variation: DailyVariation;
}): string {
  const { theme, colors, variation } = opts;
  return `
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#bgSoft)"/>
  ${theme === "light" ? paperAtmosphere(colors, variation) : starField(colors, variation)}
  `;
}

export function wallpaperDefs(opts: {
  colors: ThemeColors;
  theme: WallpaperTheme;
  variation: DailyVariation;
  pointer: { x1: number; y1: number; x2: number; y2: number };
}): string {
  const { colors, theme, variation, pointer } = opts;
  const glow = (colors.glowOpacity * variation.glowBoost).toFixed(3);
  const blur = theme === "light" ? 5 : 7;
  const textBlur = theme === "light" ? 4 : 8;
  const softCy = 42 + variation.gradientShift * 0.15;

  return `
  <defs>
    <radialGradient id="bg" cx="50%" cy="${42 + variation.gradientShift * 0.2}%" r="75%">
      <stop offset="0%" stop-color="${colors.bg2}"/>
      <stop offset="100%" stop-color="${colors.bg}"/>
    </radialGradient>
    <radialGradient id="bgSoft" cx="50%" cy="${softCy}%" r="72%">
      <stop offset="0%" stop-color="${colors.bg2}" stop-opacity="0.9"/>
      <stop offset="55%" stop-color="${colors.bg3}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${colors.bg}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.gold}" stop-opacity="${glow}"/>
      <stop offset="100%" stop-color="${colors.gold}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="calligraphyHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${colors.gold}" stop-opacity="${(colors.haloOpacity * variation.glowBoost).toFixed(3)}"/>
      <stop offset="100%" stop-color="${colors.gold}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="pointer" gradientUnits="userSpaceOnUse" x1="${pointer.x1.toFixed(1)}" y1="${pointer.y1.toFixed(1)}" x2="${pointer.x2.toFixed(1)}" y2="${pointer.y2.toFixed(1)}">
      <stop offset="0%" stop-color="${colors.gold}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${colors.gold}" stop-opacity="0.65"/>
    </linearGradient>
    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${blur}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="textGlow" x="-35%" y="-70%" width="170%" height="240%">
      <feGaussianBlur stdDeviation="${textBlur}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
}
