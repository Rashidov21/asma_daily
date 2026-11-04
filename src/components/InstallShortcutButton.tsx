"use client";

import Link from "next/link";

type Props = {
  className?: string;
};

const baseClass =
  "btn-gold-glow font-ui inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--gold)] px-8 text-base font-semibold tracking-wide text-[#1a1230] hover:bg-[#f8d77f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]";

export function InstallShortcutButton({ className }: Props) {
  const installUrl = process.env.NEXT_PUBLIC_SHORTCUT_INSTALL_URL?.trim();
  const cls = `${baseClass} ${className ?? ""}`;

  if (installUrl) {
    return (
      <a
        href={installUrl}
        className={cls}
        aria-label="iPhone'ga o'rnatish — Shortcut qo'shish"
      >
        iPhone&apos;ga o&apos;rnatish
      </a>
    );
  }

  return (
    <Link
      href="/setup"
      className={cls}
      aria-label="iPhone'ga o'rnatish — sozlash yo'riqnomasi"
    >
      iPhone&apos;ga o&apos;rnatish
    </Link>
  );
}
