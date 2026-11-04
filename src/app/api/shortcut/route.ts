import { NextRequest, NextResponse } from "next/server";
import { getShortcutInstallUrl, getWallpaperApiUrl } from "@/lib/shortcut";

export const runtime = "nodejs";

/**
 * One-tap install entry.
 * Always redirect to the plain iCloud HTTPS page (Get Shortcut).
 * Avoid shortcuts://import-shortcut — iOS often rejects it as wrong format.
 */
export async function GET(request: NextRequest) {
  const install = getShortcutInstallUrl();

  if (install) {
    return NextResponse.redirect(install, 302);
  }

  const setup = new URL("/setup", request.nextUrl.origin);
  setup.searchParams.set("install", "1");
  setup.searchParams.set("url", getWallpaperApiUrl());
  return NextResponse.redirect(setup, 302);
}
