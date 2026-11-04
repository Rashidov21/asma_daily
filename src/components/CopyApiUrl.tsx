"use client";

import { useState } from "react";

export function CopyApiUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      <code className="break-all rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-xs text-[var(--gold)]">
        {url}
      </code>
      <button
        type="button"
        onClick={onCopy}
        className="h-11 rounded-full border border-[var(--gold)]/40 text-sm text-[var(--gold)]"
        aria-label="Скопировать API URL"
      >
        {copied ? "Скопировано" : "Скопировать URL"}
      </button>
    </div>
  );
}
