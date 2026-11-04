import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "ASMA DAILY haqida",
};

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-md px-5 py-8">
      <Link href="/" className="text-sm text-[var(--gold)]">
        ← ASMA DAILY
      </Link>
      <h1 className="mt-4 font-display text-3xl text-[var(--gold)]">About</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--text-2)]">
        <p>
          <strong className="text-[var(--text)]">ASMA DAILY</strong> har kuni
          Allohning 99 go‘zal ismidan birini ko‘rsatadi va iPhone Lock Screen
          uchun PNG wallpaper yaratadi.
        </p>
        <p>
          Kunlik aylanish <strong className="text-[var(--text)]">Asia/Tashkent</strong>{" "}
          vaqt zonasiga asoslanadi — bir xil sanada barcha foydalanuvchilar bir
          xil ismni ko‘radi.
        </p>
        <p>
          Arabcha yozuvlar va ma’nolar klassik Asma ul-Husna tartibida
          keltirilgan. Bu ilova ibodat o‘rnini bosmaydi; oddiy kundalik
          eslatma vositasidir.
        </p>
        <p>
          Autentifikatsiya talab qilinmaydi. Wallpaper endpoint ochiq:{" "}
          <code className="text-[var(--gold)]">/api/wallpaper</code>
        </p>
      </div>
    </main>
  );
}
