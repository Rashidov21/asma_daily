import type { Metadata, Viewport } from "next";
import {
  Amiri,
  Cormorant_Garamond,
  Cinzel_Decorative,
  Manrope,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

// Arabic calligraphy — classic Quranic naskh feel
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Display / titles / meanings — elegant serif with Cyrillic
const display = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Decorative Latin accent (eyebrow only; no Cyrillic glyphs)
const cinzel = Cinzel_Decorative({
  variable: "--font-cinzel-src",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Refined UI sans (Latin / Uzbek / Cyrillic)
const ui = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Clear lining numerals for ring index / percent (Cormorant oldstyle digits mismatched)
const numerals = Source_Serif_4({
  variable: "--font-numerals-src",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://asma-daily-wallpaper.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "ASMA DAILY — 99 имён Аллаха",
    template: "%s · ASMA DAILY",
  },
  description:
    "Каждый день — одно из 99 прекрасных имён Аллаха. Обои для iPhone и автоматизация Shortcuts.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "ASMA DAILY",
    description: "Ежедневные обои с именем Аллаха для iPhone",
    type: "website",
    locale: "ru_RU",
  },
  appleWebApp: {
    capable: true,
    title: "ASMA DAILY",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icon-192.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#080619",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${amiri.variable} ${display.variable} ${cinzel.variable} ${ui.variable} ${numerals.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
