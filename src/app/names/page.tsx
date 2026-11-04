import Link from "next/link";
import type { Metadata } from "next";
import { NAMES } from "@/data/names";

export const metadata: Metadata = {
  title: "99 Names",
  description: "Allohning 99 go‘zal ismlari ro‘yxati",
};

export default function NamesPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">99 имён Аллаха</h1>
      <p className="mt-2 text-sm text-[var(--text-2)]">
        Barcha ismlar — tartib bilan
      </p>
      <ul className="mt-8 space-y-3">
        {NAMES.map((name) => (
          <li key={name.id}>
            <Link
              href={`/names/${name.slug}`}
              className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[var(--bg-2)]/50 px-4 py-3 transition-colors hover:border-[var(--gold)]/30"
            >
              <span className="w-8 text-sm text-[var(--gold)]">{name.id}</span>
              <div className="min-w-0 flex-1">
                <p className="font-arabic text-xl text-[var(--gold)]" dir="rtl">
                  {name.arabic}
                </p>
                <p className="truncate text-sm text-[var(--text)]">{name.uzbekName}</p>
                <p className="truncate text-xs text-[var(--text-2)]">{name.uzbekMeaning}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
