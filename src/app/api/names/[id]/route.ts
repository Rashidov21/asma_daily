import { NextRequest, NextResponse } from "next/server";
import { getNameById } from "@/data/names";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId < 1 || numericId > 99) {
    return NextResponse.json({ error: "Invalid id. Use 1–99." }, { status: 400 });
  }

  const name = getNameById(numericId);
  if (!name) {
    return NextResponse.json({ error: "Name not found" }, { status: 404 });
  }

  return NextResponse.json(name, {
    headers: { "Cache-Control": "public, max-age=86400, immutable" },
  });
}
