"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";

type Props = {
  className?: string;
  /** Wallpaper API URL — passed from server so client matches deployment. */
  wallpaperUrl?: string;
  /** iCloud share link when available. */
  installUrl?: string;
  /** Show helper caption under the button (e.g. on /setup). */
  showHint?: boolean;
};

const baseClass =
  "btn-gold-glow font-ui inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--gold)] px-8 text-base font-semibold tracking-wide text-[#1a1230] hover:bg-[#f8d77f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]";

export function InstallShortcutButton({
  className,
  wallpaperUrl,
  installUrl,
  showHint = false,
}: Props) {
  const cls = `${baseClass} ${className ?? ""}`;
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  const resolvedInstall = useMemo(
    () =>
      installUrl?.trim() ||
      process.env.NEXT_PUBLIC_SHORTCUT_INSTALL_URL?.trim() ||
      "",
    [installUrl],
  );

  const apiUrl = useMemo(
    () =>
      wallpaperUrl?.trim() ||
      (typeof window !== "undefined"
        ? `${window.location.origin}/api/wallpaper`
        : "/api/wallpaper"),
    [wallpaperUrl],
  );

  async function copyPersonalUrl() {
    try {
      await navigator.clipboard.writeText(apiUrl);
      return true;
    } catch {
      return false;
    }
  }

  async function onIcloudInstall(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setBusy(true);
    const copied = await copyPersonalUrl();
    setHint(
      copied
        ? "Личный URL (start=…) скопирован. В Shortcut вставьте его в Get Contents of URL — с 1-го имени."
        : "Откроется iCloud. После Add Shortcut вставьте личный URL из /setup (с start=).",
    );
    window.setTimeout(() => {
      window.location.href = resolvedInstall;
    }, 280);
    window.setTimeout(() => setBusy(false), 800);
  }

  async function onFallbackInstall() {
    setBusy(true);
    setHint(null);
    try {
      const copied = await copyPersonalUrl();
      setHint(
        copied
          ? "Личный API URL скопирован (start= → с 1-го имени). Откроется Shortcuts — вставьте в Get Contents of URL."
          : "Откроется Shortcuts — вставьте URL из блока ниже (с параметром start).",
      );
      window.setTimeout(() => {
        window.location.href = "shortcuts://";
      }, 350);
      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.location.href = `/setup?install=1&url=${encodeURIComponent(apiUrl)}`;
        }
      }, 1200);
    } finally {
      setBusy(false);
    }
  }

  // iCloud HTTPS link — Safari opens Apple's "Get Shortcut" page (reliable on iPhone).
  // Also copy personal ?start= URL so the user pastes their journey into the Shortcut.
  if (resolvedInstall) {
    return (
      <div className="flex w-full flex-col gap-2">
        <a
          href={resolvedInstall}
          className={`${cls} ${busy ? "pointer-events-none opacity-80" : ""}`}
          aria-label="Установить на iPhone — добавить Shortcut"
          onClick={(e) => void onIcloudInstall(e)}
        >
          {busy ? "Подготовка…" : "Установить на iPhone"}
        </a>
        {hint ? (
          <p className="text-center text-xs text-[var(--gold-soft)]">{hint}</p>
        ) : showHint ? (
          <p className="text-center text-[11px] text-[var(--text-2)]">
            Сначала копируется ваш URL с{" "}
            <code className="text-[var(--gold)]">start=</code> (1-е имя), затем
            открывается iCloud.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        className={cls}
        aria-label="Установить на iPhone — установка Shortcut"
        disabled={busy}
        onClick={() => void onFallbackInstall()}
      >
        {busy ? "Подготовка…" : "Установить на iPhone"}
      </button>
      {hint ? (
        <p className="text-center text-xs text-[var(--gold-soft)]">{hint}</p>
      ) : showHint ? (
        <p className="text-center text-[11px] text-[var(--text-2)]">
          Одним нажатием копируется личный API URL (с 1-го имени) и открывается
          Shortcuts.{" "}
          <Link
            href="/setup"
            className="text-[var(--gold)] underline-offset-2 hover:underline"
          >
            Инструкция
          </Link>
        </p>
      ) : null}
    </div>
  );
}
