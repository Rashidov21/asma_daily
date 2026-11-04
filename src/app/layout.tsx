import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Cinzel_Decorative, Manrope } from "next/font/google";
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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://asma-daily.netlify.app";

export const metadata: Metadata = {
  title: {
    default: "ASMA DAILY — 99 Names of Allah",
    template: "%s · ASMA DAILY",
  },
  description:
    "Har kuni Allohning 99 ismidan biri. iPhone Lock Screen wallpaper va Shortcuts avtomatlashtirish.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "ASMA DAILY",
    description: "Daily Name of Allah wallpaper for iPhone",
    type: "website",
    locale: "uz_UZ",
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
    <html lang="uz">
      <body
        className={`${amiri.variable} ${display.variable} ${cinzel.variable} ${ui.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
