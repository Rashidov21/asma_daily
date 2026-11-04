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

/** Deep-link that opens Shortcuts' import UI for an iCloud share URL. */
export function toShortcutsImportDeepLink(icloudUrl: string): string {
  return `shortcuts://import-shortcut?url=${encodeURIComponent(icloudUrl)}&name=${encodeURIComponent("ASMA Daily")}`;
}

export const SHORTCUT_ACTIONS = [
  {
    title: "Get Contents of URL",
    detail: "Метод: GET → URL API обоев",
  },
  {
    title: "Set Wallpaper",
    detail: "Экран: Lock Screen (Show Preview: выкл.)",
  },
  {
    title: "Show Notification",
    detail: "Заголовок: ASMA Daily — обои установлены",
  },
] as const;
