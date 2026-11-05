import { NextRequest, NextResponse } from "next/server";
import { getDailyPayload, isValidDateParam } from "@/lib/daily-name";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");
  const startParam = request.nextUrl.searchParams.get("start");

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
    const payload = getDailyPayload(dateParam ?? undefined, {
      start: startParam ?? undefined,
    });
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": dateParam
          ? "public, max-age=86400, immutable"
          : "public, s-maxage=300, stale-while-revalidate=60",
        "Netlify-Vary": "query=date,start",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resolve daily name" },
      { status: 400 },
    );
  }
}
