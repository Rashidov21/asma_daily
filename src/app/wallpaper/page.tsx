import Link from "next/link";
import type { Metadata } from "next";
import { getDailyPayload } from "@/lib/daily-name";

export const metadata: Metadata = {
  title: "Обои",
  description: "Предпросмотр обоев для экрана блокировки iPhone — светлая и тёмная тема",
};

export const dynamic = "force-dynamic";

export default function WallpaperPage() {
  const daily = getDailyPayload();
  const lightSrc = `/api/wallpaper?date=${daily.date}&theme=light`;
  const darkSrc = `/api/wallpaper?date=${daily.date}&theme=dark`;

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">Обои</h1>
      <p className="mt-2 text-sm text-[var(--text-2)]">
        {daily.gregorianLabel} · {daily.name.russianName}
      </p>
      <p className="mt-1 text-xs text-[var(--gold-soft)]">{daily.hijriLabel}</p>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">
        iPhone Light Mode → oq fon. Dark Mode → yulduzli kecha.
      </p>

      <section className="mt-8 space-y-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-soft)]">
            Light · oq
          </p>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--gold)]/20 bg-white shadow-[0_0_60px_rgba(245,204,101,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightSrc}
              alt={`Светлые обои ASMA DAILY — ${daily.name.russianName}`}
              className="aspect-[9/19.5] w-full object-cover"
              loading="eager"
            />
          </div>
          <a
            href={lightSrc}
            download={`asma-daily-${daily.date}-light.png`}
            className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full border border-[var(--gold)]/40 text-sm font-medium text-[var(--gold)]"
          >
            Скачать светлые
          </a>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gold-soft)]">
            Dark · yulduzli
          </p>
          <div className="relative overflow-hidden rounded-[2rem] border border-[var(--gold)]/20 bg-[var(--bg-2)] shadow-[0_0_60px_rgba(245,204,101,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={darkSrc}
              alt={`Тёмные обои ASMA DAILY — ${daily.name.russianName}`}
              className="aspect-[9/19.5] w-full object-cover"
              loading="lazy"
            />
          </div>
          <a
            href={darkSrc}
            download={`asma-daily-${daily.date}-dark.png`}
            className="mt-4 inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--gold)] text-base font-medium text-[#1a1230]"
          >
            Скачать тёмные
          </a>
        </div>
      </section>
    </main>
  );
}
