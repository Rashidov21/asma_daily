import { NextRequest, NextResponse } from "next/server";
import { getDailyPayload, isValidDateParam } from "@/lib/daily-name";
import { parseWallpaperTheme, renderWallpaperPng } from "@/lib/wallpaper/render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");
  const startParam = request.nextUrl.searchParams.get("start");
  const theme = parseWallpaperTheme(request.nextUrl.searchParams.get("theme"));

  if (dateParam && !isValidDateParam(dateParam)) {
    return NextResponse.json(
      { error: "Invalid date. Use YYYY-MM-DD." },
      { status: 400 },
    );
  }

  if (startParam && !isValidDateParam(startParam)) {
    return NextResponse.json(
      { error: "Invalid start. Use YYYY-MM-DD (install day → name 1)." },
      { status: 400 },
    );
  }

  try {
    const daily = getDailyPayload(dateParam ?? undefined, {
      start: startParam ?? undefined,
    });
    const png = await renderWallpaperPng(daily.name, daily.progress, {
      phrase: daily.phrase,
      caption: daily.caption,
      hijriLabel: daily.hijriLabel,
      nextHolidayLabel: daily.nextHolidayLabel,
      theme,
      date: daily.date,
    });

    // With only `start` (no fixed `date`), the name changes daily — short CDN TTL.
    // Fixed `date` (+ optional start) is immutable for that calendar day.
    const cacheControl = dateParam
      ? "public, max-age=86400, immutable"
      : "public, max-age=0, s-maxage=120, must-revalidate";

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(png.length),
        "Content-Disposition": `inline; filename="asma-daily-${daily.date}-${theme}.png"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": cacheControl,
        "Netlify-Vary": "query=date,start,theme",
      },
    });
  } catch (error) {
    console.error("Wallpaper generation failed", error);
    return NextResponse.json(
      { error: "Wallpaper generation failed" },
      { status: 500 },
    );
  }
}
