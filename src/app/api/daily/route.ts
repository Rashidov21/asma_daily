import { NextRequest, NextResponse } from "next/server";
import { getDailyPayload, isValidDateParam } from "@/lib/daily-name";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const dateParam = request.nextUrl.searchParams.get("date");

  if (dateParam && !isValidDateParam(dateParam)) {
    return NextResponse.json(
      { error: "Invalid date. Use YYYY-MM-DD." },
      { status: 400 },
    );
  }

  try {
    const payload = getDailyPayload(dateParam ?? undefined);
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": dateParam
          ? "public, max-age=86400, immutable"
          : "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to resolve daily name" },
      { status: 400 },
    );
  }
}
