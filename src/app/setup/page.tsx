import Link from "next/link";
import type { Metadata } from "next";
import { InstallShortcutButton } from "@/components/InstallShortcutButton";
import { CopyApiUrl } from "@/components/CopyApiUrl";
import { AutoInstallBanner } from "@/components/AutoInstallBanner";
import {
  SHORTCUT_ACTIONS,
  SHORTCUT_BUILD_STEPS,
  WALLPAPER_AUTOMATION_STEPS,
  WALLPAPER_FIX_STEPS,
  getPersonalWallpaperApiUrl,
  getShortcutInstallUrl,
} from "@/lib/shortcut";

export const metadata: Metadata = {
  title: "Настройка iPhone",
  description: "Как установить ASMA DAILY через Shortcuts",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SetupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const apiUrl = getPersonalWallpaperApiUrl();
  const installUrl = getShortcutInstallUrl();
  const hasInstallLink = Boolean(installUrl);
  const autoInstall =
    params.install === "1" ||
    params.install === "true" ||
    (typeof params.url === "string" && params.url.length > 0);
  const overrideUrl =
    typeof params.url === "string" && params.url.startsWith("http")
      ? params.url
      : apiUrl;

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">
        Установка на iPhone
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">
        Сайт сам не меняет обои. Нужен Shortcut: скачать PNG и поставить на
        Lock Screen. Кнопка открывает iCloud — нажмите{" "}
        <strong className="text-[var(--text)]">Add Shortcut</strong>.
      </p>
      <p className="mt-3 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-3 text-sm leading-relaxed text-[var(--text)]">
        Ваш личный URL содержит{" "}
        <code className="text-[var(--gold)]">start=</code> — дата установки.
        В этот день будет <strong>1-е имя</strong>, каждый следующий день —
        следующее. Не удаляйте параметр{" "}
        <code className="text-[var(--gold)]">start</code> из Shortcut.
      </p>

      {autoInstall && <AutoInstallBanner wallpaperUrl={overrideUrl} />}

      <div className="mt-8">
        <InstallShortcutButton
          wallpaperUrl={overrideUrl}
          installUrl={installUrl}
          showHint
        />
        {!hasInstallLink && (
          <p className="mt-3 text-xs text-[var(--text-2)]">
            Ссылка iCloud ещё не задана — кнопка скопирует API URL и откроет
            Shortcuts.
          </p>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-[var(--text)]">API URL</h2>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          «Get Contents of URL» ichiga shu linkni qo‘ying:
        </p>
        <CopyApiUrl url={overrideUrl} />
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Shortcut qanday yoziladi (qo‘lda)
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          {SHORTCUT_BUILD_STEPS.map((step) => (
            <li key={step.title}>
              <strong className="text-[var(--text)]">{step.title}</strong>
              <span className="block text-[var(--text-2)]">{step.detail}</span>
            </li>
          ))}
        </ol>
        <p className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-[var(--text)]">
          Tayyor bo‘lgach: Share → Share Shortcut →{" "}
          <strong>Copy iCloud Link</strong> — shu linkni menga tashlang,
          `.env` ga qo‘yaman.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Shortcut ichidagi 2 ta action
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          {SHORTCUT_ACTIONS.map((step) => (
            <li key={step.title}>
              <strong className="text-[var(--text)]">{step.title}</strong>
              <span className="block text-[var(--text-2)]">{step.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--gold)]">
          Если картинка не ставится на фон
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          {WALLPAPER_FIX_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/10 p-3 text-[var(--text)]">
          Ваш старый Shortcut «Получить содержимое URL» только скачивает файл и{" "}
          <strong>не меняет обои</strong>. Нужно добавить действие{" "}
          <em>Set Wallpaper Photo</em>.
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Quyosh chiqishi / botishi (avtomatik fon)
        </h2>
        <p className="text-[var(--text-2)]">
          <code className="text-[var(--gold)]">theme=auto</code> — Toshkent
          quyoshi chiqqanda ivory (oq), botganda yulduzli qora. Ikki
          automation kerak:
        </p>
        <ol className="list-decimal space-y-3 pl-5">
          {WALLPAPER_AUTOMATION_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </main>
  );
}
