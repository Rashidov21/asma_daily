import { getTashkentDateString } from "@/lib/timezone";

export type WallpaperUrlOptions = {
  /**
   * Personal journey start.
   * - `true` → today's Tashkent date (install day → name 1)
   * - `YYYY-MM-DD` → explicit start
   */
  start?: string | true;
  theme?: "dark" | "light" | "auto";
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
  // Default auto: Tashkent sunrise→sunset = light, else dark
  params.set("theme", options?.theme ?? "auto");

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

/**
 * Shortcut install URL: personal `start=today` so day 0 is name 1,
 * then a new name each following day.
 */
export function getPersonalWallpaperApiUrl(
  theme?: "dark" | "light" | "auto",
): string {
  return getWallpaperApiUrl({ start: true, theme });
}

/** iCloud Shortcuts share link (one-tap Add Shortcut). Empty until published. */
export function getShortcutInstallUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SHORTCUT_INSTALL_URL?.trim();
  return url || undefined;
}

/** Qo‘lda Shortcut yasash — iPhone Shortcuts app (RU UI). */
export const SHORTCUT_BUILD_STEPS = [
  {
    title: "0. Avval Photos Lock Screen yarating (majburiy)",
    detail:
      "Lock Screen’ni bosib turing → + → Фото (Photos) → istalgan rasm → Добавить → Установить пару обоев. Emoji/Color/Photo Shuffle emas — faqat Фото. Shu bo‘lmasa «Изображение → Обои» xatosi chiqadi.",
  },
  {
    title: "1. Yangi Shortcut",
    detail: "Команды → + → nomi: ASMA Daily.",
  },
  {
    title: "2. Получить содержимое URL",
    detail:
      "Действие → Получить содержимое URL. Метод: GET. URL: shaxsiy link (start=…&theme=auto).",
  },
  {
    title: "3. Установить фото как обои",
    detail:
      "Действие → Установить фото как обои. Экран блокировки. Показать просмотр: ВЫКЛ. Обрезка объекта: ВЫКЛ. Ko‘k «Обои» so‘zini bosing → yuqorida yaratgan Photos lokskrinni tanlang. Input = Содержимое URL.",
  },
  {
    title: "4. (ixtiyoriy) Показать уведомление",
    detail: "ASMA Daily — wallpaper yangilandi.",
  },
  {
    title: "5. Tekshirish + share",
    detail:
      "▶ Run. Keyin Поделиться → Поделиться быстрой командой → Скопировать ссылку iCloud — menga tashlang.",
  },
] as const;

export const SHORTCUT_ACTIONS = [
  {
    title: "Получить содержимое URL",
    detail:
      "GET → …/api/wallpaper?start=YYYY-MM-DD&theme=auto",
  },
  {
    title: "Установить фото как обои",
    detail:
      "Lock Screen + Photos wallpaper slot tanlang. Preview/Crop OFF. Aks holda: «не удалось преобразование из Изображение в Обои».",
  },
] as const;

export const WALLPAPER_AUTOMATION_STEPS = [
  "Shortcuts → Automation → Create Personal Automation → Time of Day → Sunrise.",
  "Run Immediately (Ask Before Running o‘chirilsin) → Next → Open App emas, Run Shortcut → ASMA Daily.",
  "Xuddi shunday ikkinchi automation: Sunset → Run Shortcut → ASMA Daily.",
  "URL da theme=auto bo‘lsin — quyosh chiqqanda oq, botganda qora fon keladi.",
] as const;

export const WALLPAPER_FIX_STEPS = [
  "Xato «Изображение → Обои»: avval Lock Screen’da Фото wallpaper yarating, keyin action ichida ko‘k «Обои»ni bosib o‘sha slotni tanlang.",
  "Показать просмотр и Обрезка объекта — ВЫКЛ.",
  "URL oxirida &theme=auto bo‘lsin. start= o‘rnatish sanasi bo‘lsin.",
  "Sunrise + Sunset automation qo‘ying.",
  "Host: https://asma-daily-wallpaper.netlify.app/api/wallpaper (asma-daily.netlify.app emas).",
] as const;
