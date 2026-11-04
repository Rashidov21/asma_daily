import Link from "next/link";
import type { Metadata } from "next";
import { InstallShortcutButton } from "@/components/InstallShortcutButton";
import { CopyApiUrl } from "@/components/CopyApiUrl";

export const metadata: Metadata = {
  title: "iPhone Setup",
  description: "ASMA DAILY ni iPhone Shortcuts orqali har kuni o‘rnatish",
};

function getWallpaperApiUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://asma-daily.netlify.app";
  return `${base}/api/wallpaper`;
}

export default function SetupPage() {
  const apiUrl = getWallpaperApiUrl();
  const hasInstallLink = Boolean(process.env.NEXT_PUBLIC_SHORTCUT_INSTALL_URL?.trim());

  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">
        iPhone&apos;ga o&apos;rnatish
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-2)]">
        Sayt o‘zi Lock Screen wallpaperini o‘zgartira olmaydi. Buning uchun
        Apple Shortcuts kerak. Bitta tugma bilan Shortcut qo‘shing, keyin kunlik
        avtomatlashtirishni yoqing.
      </p>

      <div className="mt-8">
        <InstallShortcutButton />
        {!hasInstallLink && (
          <p className="mt-3 text-xs text-[var(--text-2)]">
            iCloud Shortcut linki hali sozlanmagan — quyidagi qo‘lda yo‘riqnoma
            bilan o‘zingiz yarating.
          </p>
        )}
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl text-[var(--text)]">API URL</h2>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          Shortcuts «Get Contents of URL» uchun:
        </p>
        <CopyApiUrl url={apiUrl} />
      </section>

      <section className="mt-10 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <h2 className="font-display text-xl text-[var(--text)]">
          Kunlik avtomatlashtirish
        </h2>
        <ol className="list-decimal space-y-3 pl-5">
          <li>
            <strong className="text-[var(--text)]">Shortcuts</strong> ilovasini
            oching.
          </li>
          <li>
            Yangi Shortcut: <em>Get Contents of URL</em> → yuqoridagi API URL
            (GET).
          </li>
          <li>
            Natijani rasm sifatida oling, keyin{" "}
            <em>Set Wallpaper</em> (Lock Screen) yoki{" "}
            <em>Save to Photo Album</em>.
          </li>
          <li>
            <strong className="text-[var(--text)]">Automation</strong> →{" "}
            <em>Time of Day</em> → har kuni tanlangan vaqtda shu Shortcutni
            ishga tushiring.
          </li>
          <li>
            iOS ba’zan tasdiqlash so‘rashi mumkin — bu Apple cheklovi; sayt
            buni chetlab o‘ta olmaydi.
          </li>
        </ol>
      </section>

      <section className="mt-10 rounded-2xl border border-[var(--muted)] bg-[var(--bg-2)]/60 p-4 text-sm text-[var(--text-2)]">
        <p className="font-medium text-[var(--gold)]">Muhim</p>
        <p className="mt-2">
          Veb-sayt iPhone wallpaperini mustaqil o‘zgartira olmaydi. Faqat PNG
          beradi; o‘rnatishni Shortcuts / Automation bajaradi.
        </p>
      </section>
    </main>
  );
}
