/** Public wallpaper PNG URL used by the iPhone Shortcut. */
export function getWallpaperApiUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://asma-daily-wallpaper.netlify.app";
  return `${base}/api/wallpaper`;
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
      "GET → https://asma-daily-wallpaper.netlify.app/api/wallpaper (har kuni — datesiz). Test: ?date=2026-11-06",
  },
  {
    title: "Set Wallpaper Photo",
    detail:
      "Lock Screen. Show Preview: выкл. Crop to Subject: выкл. В поле Wallpaper выберите свой Photos-локскрин.",
  },
] as const;

export const WALLPAPER_FIX_STEPS = [
  "URL aynan https://asma-daily-wallpaper.netlify.app/api/wallpaper bo‘lsin (asma-daily.netlify.app emas — u boshqa sayt, HTML qaytaradi → Quick Look oq ekran).",
  "Lock Screen-ni bosib turing → + → Photos → istalgan rasm → Add → Set as Wallpaper Pair (Photo Shuffle/Emoji/Color emas).",
  "Shortcuts → shortcutni Edit → Set Wallpaper Photo qo‘shing (faqat Get Contents of URL bo‘lsa — fon o‘zgarmaydi).",
  "Set Wallpaper Photo ichida ko‘k Wallpaper so‘zini bosing → yangi Photos lokskrinni tanlang.",
  "Show Preview va Crop to Subject o‘chirilsin → ▶ bilan ishga tushiring.",
] as const;
