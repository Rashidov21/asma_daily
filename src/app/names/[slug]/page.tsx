import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNameBySlug, NAMES } from "@/data/names";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NAMES.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = getNameBySlug(slug);
  if (!name) return { title: "Not found" };
  return {
    title: `${name.uzbekName} — ${name.uzbekMeaning}`,
    description: name.shortReflection,
  };
}

export default async function NameDetailPage({ params }: Props) {
  const { slug } = await params;
  const name = getNameBySlug(slug);
  if (!name) notFound();

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-8">
      <Link href="/names" className="text-sm text-[var(--gold)]">
        ← Barcha ismlar
      </Link>
      <p className="mt-8 text-sm text-[var(--text-2)]">{name.id} / 99</p>
      <h1
        className="mt-4 font-arabic text-5xl text-[var(--gold)]"
        dir="rtl"
        lang="ar"
      >
        {name.arabic}
      </h1>
      <p className="mt-4 text-2xl font-semibold text-[var(--text)]">{name.uzbekName}</p>
      <p className="mt-2 font-display text-xl text-[var(--gold)]">{name.uzbekMeaning}</p>
      <p className="mt-1 text-sm text-[var(--text-2)]">{name.transliteration}</p>
      <p className="mt-8 text-[var(--text-2)]">{name.shortReflection}</p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center justify-center rounded-full border border-[var(--gold)]/40 text-[var(--gold)]"
      >
        Bugungi ismga qaytish
      </Link>
    </main>
  );
}
