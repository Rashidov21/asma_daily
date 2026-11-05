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

/** Manual Shortcut build steps (Russian UI on iPhone). */
export const SHORTCUT_BUILD_STEPS = [
  {
    title: "0. Сначала создайте Lock Screen «Фото»",
    detail:
      "Удерживайте Lock Screen → + → Фото → любое фото → Добавить → Установить пару обоев. Не Emoji/Color/Shuffle. Иначе ошибка «Изображение → Обои».",
  },
  {
    title: "1. Новая команда",
    detail: "Команды → + → имя: ASMA Daily.",
  },
  {
    title: "2. Получить содержимое URL",
    detail:
      "Действие → Получить содержимое URL. Метод: GET. URL: личная ссылка (start=…&theme=auto).",
  },
  {
    title: "3. Установить фото как обои",
    detail:
      "Действие → Установить фото как обои. Экран блокировки. Просмотр: ВЫКЛ. Обрезка: ВЫКЛ. Нажмите синее «Обои» → выберите Photos-локскрин. Ввод = Содержимое URL.",
  },
  {
    title: "4. (опционально) Уведомление",
    detail: "ASMA Daily — обои обновлены.",
  },
  {
    title: "5. Проверка и share",
    detail:
      "▶ Запуск. Затем Поделиться → Поделиться быстрой командой → Скопировать ссылку iCloud.",
  },
] as const;

export const SHORTCUT_ACTIONS = [
  {
    title: "Получить содержимое URL",
    detail: "GET → …/api/wallpaper?start=YYYY-MM-DD&theme=auto",
  },
  {
    title: "Установить фото как обои",
    detail:
      "Lock Screen + слот Photos. Preview/Crop ВЫКЛ. Иначе: «не удалось преобразование из Изображение в Обои».",
  },
] as const;

export const WALLPAPER_AUTOMATION_STEPS = [
  "Команды → Автоматизация → Новая → Время суток → Рассвет.",
  "Сразу (без подтверждения) → Выполнить команду → ASMA Daily.",
  "Так же вторая автоматизация: Закат → ASMA Daily.",
  "В URL должен быть theme=auto — днём светлый фон, ночью тёмный.",
] as const;

export const WALLPAPER_FIX_STEPS = [
  "Ошибка «Изображение → Обои»: создайте Lock Screen «Фото», в действии нажмите синее «Обои» и выберите этот слот.",
  "Светлый PNG в списке есть, экран тёмный: Shortcut обновляет другой локскрин. Удерживайте Lock Screen → выберите Photos-слот, который обновляет Shortcut.",
  "Фокус (Не беспокоить / Работа) может держать другой фон — отключите и проверьте.",
  "Просмотр и обрезка — ВЫКЛ.",
  "В URL: &theme=auto и start=дата установки.",
  "Автоматизации Рассвет + Закат.",
  "Хост: https://asma-daily-wallpaper.netlify.app/api/wallpaper",
] as const;
