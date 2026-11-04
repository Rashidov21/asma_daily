import { NextResponse } from "next/server";
import { NAMES, TOTAL_NAMES } from "@/data/names";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    { total: TOTAL_NAMES, names: NAMES },
    {
      headers: {
        "Cache-Control": "public, max-age=86400",
      },
    },
  );
}
