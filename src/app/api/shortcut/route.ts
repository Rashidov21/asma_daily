import { NextRequest, NextResponse } from "next/server";
import {
  getPersonalWallpaperApiUrl,
  getShortcutInstallUrl,
} from "@/lib/shortcut";

export const runtime = "nodejs";

/**
 * One-tap install entry.
 * Always redirect to the plain iCloud HTTPS page (Get Shortcut).
 * Avoid shortcuts://import-shortcut — iOS often rejects it as wrong format.
 *
 * Fallback setup gets a personal `?start=today` wallpaper URL so day 0 = name 1.
 */
export async function GET(request: NextRequest) {
  const install = getShortcutInstallUrl();

  if (install) {
    return NextResponse.redirect(install, 302);
  }

  const setup = new URL("/setup", request.nextUrl.origin);
  setup.searchParams.set("install", "1");
  setup.searchParams.set("url", getPersonalWallpaperApiUrl());
  return NextResponse.redirect(setup, 302);
}
