import { DailyDashboard } from "@/components/dashboard/DailyDashboard";
import { getDailyPayload } from "@/lib/daily-name";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const daily = getDailyPayload();
  return <DailyDashboard daily={daily} />;
}
