import { NextRequest, NextResponse } from "next/server";
import { getDailyPayload, isValidDateParam } from "@/lib/daily-name";
import { renderWallpaperPng } from "@/lib/wallpaper/render";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");

  if (dateParam && !isValidDateParam(dateParam)) {
    return NextResponse.json(
      { error: "Invalid date. Use YYYY-MM-DD." },
      { status: 400 },
    );
  }

  try {
    const daily = getDailyPayload(dateParam ?? undefined);
    const png = await renderWallpaperPng(daily.name, daily.progress, {
      phrase: daily.phrase,
      caption: daily.caption,
      hijriLabel: daily.hijriLabel,
      nextHolidayLabel: daily.nextHolidayLabel,
    });

    // Avoid sticky CDN cache so daily Shortcuts always get today's PNG.
    // Netlify ignores query strings in cache keys unless Netlify-Vary lists them.
    const cacheControl = dateParam
      ? "public, max-age=86400, immutable"
      : "public, max-age=0, s-maxage=120, must-revalidate";

    return new NextResponse(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": cacheControl,
        "Netlify-Vary": "query=date",
        "Content-Disposition": `inline; filename="asma-daily-${daily.date}.png"`,
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
