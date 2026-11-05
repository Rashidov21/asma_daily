import { getTashkentDateString } from "@/lib/timezone";

export type WallpaperUrlOptions = {
  /**
   * Personal journey start.
   * - `true` → today's Tashkent date (install day → name 1)
   * - `YYYY-MM-DD` → explicit start
   */
  start?: string | true;
  theme?: "dark" | "light";
};

/** Public wallpaper PNG URL used by the iPhone Shortcut. */
export function getWallpaperApiUrl(options?: WallpaperUrlOptions): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://asma-daily-wallpaper.netlify.app";
  const path = `${base}/api/wallpaper`;
  const params = new URLSearchParams();

  const start =
    options?.start === true
      ? getTashkentDateString()
      : options?.start?.trim() || undefined;
  if (start) params.set("start", start);
  if (options?.theme) params.set("theme", options.theme);

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Shortcut install URL: personal `start=today` so day 0 is name 1,
 * then a new name each following day.
 */
export function getPersonalWallpaperApiUrl(
  theme?: "dark" | "light",
): string {
  return getWallpaperApiUrl({ start: true, theme });
}

/** iCloud Shortcuts share link (one-tap Add Shortcut). Empty until published. */
export function getShortcutInstallUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SHORTCUT_INSTALL_URL?.trim();
  return url || undefined;
}

export const SHORTCUT_ACTIONS = [
  {
    title: "Get Contents of URL",
    detail:
      "GET → …/api/wallpaper?start=YYYY-MM-DD (o‘rnatgan kuningiz). Shu kundan 1-ism, har kuni keyingisi. Theme: &theme=dark|light. Test: ?start=2026-11-05&date=2026-11-07",
  },
  {
    title: "Set Wallpaper Photo",
    detail:
      "Lock Screen. Show Preview: выкл. Crop to Subject: выкл. В поле Wallpaper выберите свой Photos-локскрин.",
  },
] as const;

export const WALLPAPER_FIX_STEPS = [
  "URL da start= o‘rnatish sanasi bo‘lsin (masalan ?start=2026-11-05) — aks holda global tsikl, 1-ismdan emas.",
  "Host: https://asma-daily-wallpaper.netlify.app/api/wallpaper (asma-daily.netlify.app emas — HTML → Quick Look oq ekran).",
  "Lock Screen-ni bosib turing → + → Photos → istalgan rasm → Add → Set as Wallpaper Pair (Photo Shuffle/Emoji/Color emas).",
  "Shortcuts → shortcutni Edit → Set Wallpaper Photo qo‘shing (faqat Get Contents of URL bo‘lsa — fon o‘zgarmaydi).",
  "Set Wallpaper Photo ichida ko‘k Wallpaper so‘zini bosing → yangi Photos lokskrinni tanlang.",
  "Show Preview va Crop to Subject o‘chirilsin → ▶ bilan ishga tushiring.",
] as const;
