import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О проекте",
  description: "О проекте ASMA DAILY",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">О проекте</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <p>
          <strong className="text-[var(--text)]">ASMA DAILY</strong> каждый день
          показывает одно из 99 прекрасных имён Аллаха и создаёт PNG-обои для
          экрана блокировки iPhone.
        </p>
        <p>
          Смена имени идёт по календарю{" "}
          <strong className="text-[var(--text)]">Asia/Tashkent</strong> — в один
          день все пользователи видят одно и то же имя.
        </p>
        <p>
          Также отображаются григорианская и хиджрийская даты и ближайший
          исламский праздник (расчётные даты по гражданской хиджре; фактические
          дни могут отличаться на ±1 в зависимости от лунного наблюдения).
        </p>
        <p>
          Краткие русские значения имён — по материалам{" "}
          <strong className="text-[var(--text)]">Islam.Global</strong>. Приложение
          не заменяет поклонение; это ежедневное напоминание.
        </p>
        <p>
          Авторизация не нужна. Открытый endpoint обоев:{" "}
          <code className="text-[var(--gold)]">/api/wallpaper</code>
        </p>
      </div>
    </main>
  );
}
