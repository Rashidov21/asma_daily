import { DailyDashboard } from "@/components/dashboard/DailyDashboard";
import { getDailyPayload } from "@/lib/daily-name";
import { getShortcutInstallUrl, getWallpaperApiUrl } from "@/lib/shortcut";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const daily = getDailyPayload();
  return (
    <DailyDashboard
      daily={daily}
      wallpaperUrl={getWallpaperApiUrl()}
      installUrl={getShortcutInstallUrl()}
    />
  );
}
