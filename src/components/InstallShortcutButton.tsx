"use client";

import { useMemo, useState } from "react";
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

function toImportDeepLink(icloudUrl: string): string {
  return `shortcuts://import-shortcut?url=${encodeURIComponent(icloudUrl)}&name=${encodeURIComponent("ASMA Daily")}`;
}

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
    () => installUrl?.trim() || process.env.NEXT_PUBLIC_SHORTCUT_INSTALL_URL?.trim() || "",
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

  async function onInstall() {
    setBusy(true);
    setHint(null);

    try {
      if (resolvedInstall) {
        // Prefer Shortcuts app deep-link on iOS; iCloud page as fallback.
        const isIOS =
          typeof navigator !== "undefined" &&
          /iPhone|iPad|iPod/i.test(navigator.userAgent);
        window.location.href = isIOS
          ? toImportDeepLink(resolvedInstall)
          : resolvedInstall;
        return;
      }

      // No published iCloud link yet: copy API URL + open Shortcuts + guide.
      try {
        await navigator.clipboard.writeText(apiUrl);
      } catch {
        /* clipboard may be blocked */
      }

      setHint(
        "API URL скопирован. Открываем Shortcuts — вставьте в Get Contents of URL.",
      );

      // Give the toast a tick to paint, then jump into Shortcuts.
      window.setTimeout(() => {
        window.location.href = "shortcuts://";
      }, 350);

      // If Shortcuts scheme is ignored (desktop), send user to setup.
      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.location.href = `/setup?install=1&url=${encodeURIComponent(apiUrl)}`;
        }
      }, 1200);
    } finally {
      setBusy(false);
    }
  }

  if (resolvedInstall) {
    return (
      <a
        href={resolvedInstall}
        className={cls}
        aria-label="Установить на iPhone — добавить Shortcut"
        onClick={(e) => {
          e.preventDefault();
          void onInstall();
        }}
      >
        Установить на iPhone
      </a>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <button
        type="button"
        className={cls}
        aria-label="Установить на iPhone — установка Shortcut"
        disabled={busy}
        onClick={() => void onInstall()}
      >
        {busy ? "Подготовка…" : "Установить на iPhone"}
      </button>
      {hint ? (
        <p className="text-center text-xs text-[var(--gold-soft)]">{hint}</p>
      ) : showHint ? (
        <p className="text-center text-[11px] text-[var(--text-2)]">
          Одним нажатием копируется API URL и открывается Shortcuts.{" "}
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
