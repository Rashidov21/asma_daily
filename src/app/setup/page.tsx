import Link from "next/link";
import type { Metadata } from "next";
import { InstallShortcutButton } from "@/components/InstallShortcutButton";
import { CopyApiUrl } from "@/components/CopyApiUrl";
import { AutoInstallBanner } from "@/components/AutoInstallBanner";
import {
  SHORTCUT_ACTIONS,
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
        Сайт сам не может сменить обои экрана блокировки. Для этого нужны Apple
        Shortcuts. Кнопка открывает страницу iCloud «Get Shortcut» — там нажмите{" "}
        <strong className="text-[var(--text)]">Add Shortcut</strong>. Не
        скачивайте .shortcut файл вручную (будет ошибка формата).
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
            Ссылка iCloud Shortcut ещё не задана — кнопка скопирует API URL и
            откроет Shortcuts. Готовую ссылку укажите в{" "}
            <code className="text-[var(--gold)]">NEXT_PUBLIC_SHORTCUT_INSTALL_URL</code>
            , тогда одним нажатием откроется «Add Shortcut».
          </p>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-[var(--text)]">API URL</h2>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          Для действия Shortcuts «Get Contents of URL»:
        </p>
        <CopyApiUrl url={overrideUrl} />
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Шаги Shortcut
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          {SHORTCUT_ACTIONS.map((step) => (
            <li key={step.title}>
              <strong className="text-[var(--text)]">{step.title}</strong>
              <span className="block text-[var(--text-2)]">{step.detail}</span>
            </li>
          ))}
        </ol>
        <p>
          Файл рецепта:{" "}
          <code className="text-[var(--gold)]">shortcuts/ASMA-Daily.json</code>
        </p>
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Ежедневная автоматизация
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <strong className="text-[var(--text)]">Shortcuts</strong> →{" "}
            <em>Automation</em> → <em>Time of Day</em>.
          </li>
          <li>
            Каждый день в выбранное время запускайте Shortcut «ASMA Daily».
          </li>
          <li>
            iOS иногда просит подтверждение — это ограничение Apple; сайт обойти
            его не может.
          </li>
        </ol>
      </section>

      <section className="mt-10 rounded-2xl border border-[var(--muted)] bg-[var(--bg-2)]/60 p-4 text-sm text-[var(--text-2)]">
        <p className="font-medium text-[var(--gold)]">Важно</p>
        <p className="mt-2">
          Веб-сайт сам не меняет обои iPhone. Он только отдаёт PNG; установку
          выполняют Shortcuts / Automation. Для «Add Shortcut» в один тап нужна
          ссылка iCloud (Shortcuts → Share → Copy iCloud Link).
        </p>
      </section>
    </main>
  );
}
