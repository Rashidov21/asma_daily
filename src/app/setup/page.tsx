import Link from "next/link";
import type { Metadata } from "next";
import { InstallShortcutButton } from "@/components/InstallShortcutButton";
import { CopyApiUrl } from "@/components/CopyApiUrl";
import { AutoInstallBanner } from "@/components/AutoInstallBanner";
import {
  SHORTCUT_ACTIONS,
  WALLPAPER_FIX_STEPS,
  getShortcutInstallUrl,
  getWallpaperApiUrl,
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
  const apiUrl = getWallpaperApiUrl();
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
          Для «Get Contents of URL»:
        </p>
        <CopyApiUrl url={overrideUrl} />
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Обязательные действия
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
          Ежедневная автоматизация
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <strong className="text-[var(--text)]">Shortcuts</strong> →
            Automation → Time of Day.
          </li>
          <li>
            Выберите <em>Run Immediately</em> (сразу), без подтверждения.
          </li>
          <li>Запускайте тот же Shortcut каждый день.</li>
        </ol>
      </section>
    </main>
  );
}
