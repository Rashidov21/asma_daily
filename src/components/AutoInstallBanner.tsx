"use client";

import { useEffect, useState } from "react";

export function AutoInstallBanner({ wallpaperUrl }: { wallpaperUrl: string }) {
  const [status, setStatus] = useState<"pending" | "copied" | "error">(
    "pending",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await navigator.clipboard.writeText(wallpaperUrl);
        if (!cancelled) setStatus("copied");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [wallpaperUrl]);

  return (
    <div className="mt-6 rounded-2xl border border-[var(--gold)]/35 bg-[var(--gold)]/10 px-4 py-3 text-sm text-[var(--text)]">
      {status === "copied" && (
        <p>
          URL API обоев скопирован. Shortcuts → новый Shortcut → вставьте в{" "}
          <em>Get Contents of URL</em>, затем добавьте{" "}
          <em>Set Wallpaper</em> (Lock Screen).
        </p>
      )}
      {status === "pending" && <p>Копируем API URL…</p>}
      {status === "error" && (
        <p>
          Не удалось скопировать автоматически — нажмите «Скопировать URL»
          ниже.
        </p>
      )}
    </div>
  );
}
