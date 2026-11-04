import Link from "next/link";
import type { Metadata } from "next";
import { getDailyPayload } from "@/lib/daily-name";

export const metadata: Metadata = {
  title: "Wallpaper",
  description: "Bugungi iPhone Lock Screen wallpaper preview",
};

export const dynamic = "force-dynamic";

export default function WallpaperPage() {
  const daily = getDailyPayload();
  const src = `/api/wallpaper?date=${daily.date}`;

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">Wallpaper</h1>
      <p className="mt-2 text-sm text-[var(--text-2)]">
        {daily.date} · {daily.name.uzbekName}
      </p>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-[var(--gold)]/20 bg-[var(--bg-2)] shadow-[0_0_60px_rgba(245,204,101,0.08)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`ASMA DAILY wallpaper — ${daily.name.uzbekName}`}
          className="aspect-[9/19.5] w-full object-cover"
          loading="lazy"
        />
      </div>

      <a
        href={src}
        download={`asma-daily-${daily.date}.png`}
        className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--gold)] text-base font-medium text-[#1a1230]"
      >
        PNG yuklab olish
      </a>
    </main>
  );
}
