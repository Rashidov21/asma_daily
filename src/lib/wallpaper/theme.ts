export const WALLPAPER_WIDTH = 1179;
export const WALLPAPER_HEIGHT = 2556;

/** iPhone appearance: light = ivory, dark = midnight. */
export type WallpaperTheme = "light" | "dark";

export function parseWallpaperTheme(value: string | null | undefined): WallpaperTheme {
  if (value === "light" || value === "day" || value === "white") return "light";
  return "dark";
}

export type ThemeColors = {
  bg: string;
  bg2: string;
  bg3: string;
  gold: string;
  goldSoft: string;
  goldMuted: string;
  text: string;
  text2: string;
  muted: string;
  star: string;
  starBright: string;
  pattern: string;
  frame: string;
  frameOpacity: number;
  glowOpacity: number;
  haloOpacity: number;
};

export const THEME_COLORS: Record<WallpaperTheme, ThemeColors> = {
  light: {
    bg: "#F8F4EC",
    bg2: "#F2EADF",
    bg3: "#EDE4D4",
    gold: "#C89B36",
    goldSoft: "#D4AF5A",
    goldMuted: "#B8923A",
    text: "#28213F",
    text2: "#5C5478",
    muted: "#D8CFBE",
    star: "#C89B36",
    starBright: "#F5E6C8",
    pattern: "#C89B36",
    frame: "#C89B36",
    frameOpacity: 0.28,
    glowOpacity: 0.16,
    haloOpacity: 0.2,
  },
  dark: {
    bg: "#080619",
    bg2: "#17102E",
    bg3: "#100B24",
    gold: "#F3CC67",
    goldSoft: "#D7B65D",
    goldMuted: "#A98A43",
    text: "#F5F1FF",
    text2: "#AAA5BE",
    muted: "#30234E",
    star: "#F3CC67",
    starBright: "#FFF6E0",
    pattern: "#A98A43",
    frame: "#F3CC67",
    frameOpacity: 0.42,
    glowOpacity: 0.28,
    haloOpacity: 0.32,
  },
};

/**
 * Layout (iPhone Lock Screen, 1179×2556):
 *  0–520     clear: clock / Dynamic Island
 *  ~580      soft header
 *  700–1420  celestial orbit
 *  1480+     calligraphy + meaning block
 */
export const LAYOUT = {
  safeTop: 520,
  headerY: 575,
  hijriY: 622,
  holidayY: 665,
  dialCy: 1060,
  dotsR: 328,
  outerR: 382,
  midR: 288,
  innerR: 218,
  arabicBaseline: 1660,
  dividerY: 1745,
  russianBaseline: 1845,
  meaningBaseline: 1915,
  reflectionBaseline: 1990,
  captionBaseline: 2065,
  brandBaseline: 2415,
  maxTextWidth: 860,
  frameInset: 42,
  frameCorner: 36,
} as const;

/** Deterministic daily visual variation from date + name id. */
export type DailyVariation = {
  patternRotation: number;
  patternOpacity: number;
  glowBoost: number;
  gradientShift: number;
  ornamentStyle: 0 | 1 | 2;
  starSeed: number;
};

export function getDailyVariation(date: string | undefined, nameId: number): DailyVariation {
  const dayKey = (date ?? "0000-00-00").replace(/\D/g, "");
  const seed = Number(dayKey || "0") * 31 + nameId * 17;
  return {
    patternRotation: (seed % 12) * 7.5,
    patternOpacity: 0.045 + ((seed % 5) * 0.008),
    glowBoost: 0.85 + ((seed % 7) * 0.04),
    gradientShift: ((seed % 9) - 4) * 2.5,
    ornamentStyle: (seed % 3) as 0 | 1 | 2,
    starSeed: seed,
  };
}
