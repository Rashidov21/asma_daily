"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { motion, MotionConfig, type Variants } from "framer-motion";
import type { DailyPayload } from "@/lib/daily-name";
import { NAMES } from "@/data/names";
import { NamesRing } from "@/components/dashboard/NamesRing";
import { SegmentedProgress } from "@/components/dashboard/SegmentedProgress";
import { InstallShortcutButton } from "@/components/InstallShortcutButton";

type Props = {
  daily: DailyPayload;
};

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function DailyDashboard({ daily }: Props) {
  const { name, progress, phrase, caption, date } = daily;

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col overflow-hidden px-5 pb-10 pt-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#100B2A_0%,#080619_70%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-40 starfield" />
        <div className="pointer-events-none absolute inset-0 starfield-twinkle" aria-hidden />
        <div className="pointer-events-none absolute inset-0 starfield-twinkle-b" aria-hidden />

        <motion.div
          className="relative z-10 flex flex-1 flex-col"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.header variants={item}>
            <p className="font-cinzel mb-2 text-center text-[10px] font-normal tracking-[0.5em] text-[var(--gold-soft)]/90 [text-indent:0.5em]">
              ASMA DAILY
            </p>
            <h1 className="font-display glow-title text-center text-[1.9rem] font-semibold leading-tight tracking-[0.04em] text-[var(--gold)]">
              99 имён Аллаха
            </h1>
            <p className="font-ui mt-1 text-center text-xs tracking-[0.12em] text-[var(--text-2)]">
              {date}
            </p>
          </motion.header>

          <motion.section variants={item} className="mt-6">
            <div className="flex items-end justify-between gap-3">
              <p className="font-ui text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--gold-soft)]">
                {phrase}
              </p>
              <p className="font-display glow-soft text-base font-semibold tracking-wider text-[var(--gold)]">
                {progress.percent}%
              </p>
            </div>
            <div className="mt-2">
              <SegmentedProgress current={progress.current} total={progress.total} />
            </div>
          </motion.section>

          <motion.div variants={item} className="mt-6">
            <NamesRing names={NAMES} currentIndex={daily.index} />
          </motion.div>

          <motion.div variants={item} className="relative mt-4">
            {/* soft glow behind Arabic name */}
            <div
              className="halo-gold pointer-events-none absolute left-1/2 top-[14%] h-40 w-72 -translate-x-1/2 rounded-full blur-2xl"
              aria-hidden
            />
            <motion.div
              key={name.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center text-center"
            >
              <p
                className="font-arabic glow-arabic text-[3.75rem] leading-[1.3] text-[var(--gold)]"
                dir="rtl"
                lang="ar"
              >
                {name.arabic}
              </p>

              <div className="my-4 flex w-52 items-center gap-2">
                <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--gold-soft)]/70" />
                <span className="diamond-sparkle block h-2 w-2 rotate-45 bg-[var(--gold)]" />
                <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--gold-soft)]/70" />
              </div>

              <p className="font-ui text-[1.75rem] font-bold tracking-wide text-[var(--text)] drop-shadow-[0_0_14px_rgba(245,242,255,0.18)]">
                {name.uzbekName}
              </p>
              <p className="font-display glow-soft mt-2 text-xl font-semibold tracking-[0.03em] text-[var(--gold)]">
                {name.uzbekMeaning}
              </p>
              <p className="font-ui mt-3 max-w-xs text-sm leading-relaxed tracking-[0.02em] text-[var(--text-2)]">
                {caption}
              </p>
            </motion.div>
          </motion.div>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3">
            <InstallShortcutButton />
            <a
              href={`/api/wallpaper?date=${date}`}
              download={`asma-daily-${date}.png`}
              className="btn-gold-glow font-ui inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[var(--gold)]/40 text-sm font-medium tracking-wide text-[var(--gold)] hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
              aria-label="Wallpaper yuklab olish"
            >
              <Download className="h-4 w-4" aria-hidden />
              Wallpaper yuklab olish
            </a>
            <Link
              href="/names"
              className="font-ui inline-flex h-12 w-full items-center justify-center rounded-full text-sm tracking-wide text-[var(--text-2)] transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              Barcha 99 ismni ko‘rish
            </Link>
          </motion.div>

          <motion.nav
            variants={item}
            className="font-ui mt-6 flex justify-center gap-5 text-xs tracking-[0.1em] text-[var(--text-2)]"
          >
            <Link href="/wallpaper" className="transition-colors hover:text-[var(--gold)]">
              Preview
            </Link>
            <Link href="/setup" className="transition-colors hover:text-[var(--gold)]">
              Setup
            </Link>
            <Link href="/about" className="transition-colors hover:text-[var(--gold)]">
              About
            </Link>
          </motion.nav>
        </motion.div>
      </main>
    </MotionConfig>
  );
}
