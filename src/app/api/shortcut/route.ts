import { NextRequest, NextResponse } from "next/server";
import {
  getShortcutInstallUrl,
  getWallpaperApiUrl,
  toShortcutsImportDeepLink,
} from "@/lib/shortcut";

export const runtime = "nodejs";

/**
 * One-tap install entry.
 * - If NEXT_PUBLIC_SHORTCUT_INSTALL_URL is set → redirect to Shortcuts import (iCloud).
 * - Else → redirect to /setup with the wallpaper API URL ready.
 */
export async function GET(request: NextRequest) {
  const install = getShortcutInstallUrl();
  const preferDeepLink = request.nextUrl.searchParams.get("deep") === "1";

  if (install) {
    const target =
      preferDeepLink || request.nextUrl.searchParams.get("app") === "1"
        ? toShortcutsImportDeepLink(install)
        : install;
    return NextResponse.redirect(target, 302);
  }

  const setup = new URL("/setup", request.nextUrl.origin);
  setup.searchParams.set("install", "1");
  setup.searchParams.set("url", getWallpaperApiUrl());
  return NextResponse.redirect(setup, 302);
}
