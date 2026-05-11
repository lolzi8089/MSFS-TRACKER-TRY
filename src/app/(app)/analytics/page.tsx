import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { SAVED_FLIGHTS, LEADERBOARD } from "@/lib/mock-data";
import Link from "next/link";

export const metadata = {
  title: "Analytics · SkyPulse",
};

export default function AnalyticsPage() {
  const totalMin = SAVED_FLIGHTS.reduce((s, f) => s + f.durationMin, 0);
  const hours = Math.round((totalMin / 60) * 10) / 10;
  const byAircraft: Record<string, number> = {};
  SAVED_FLIGHTS.forEach((f) => {
    byAircraft[f.aircraft] = (byAircraft[f.aircraft] ?? 0) + 1;
  });
  const topAc = Object.entries(byAircraft).sort((a, b) => b[1] - a[1])[0];
  const apCounts: Record<string, number> = {};
  SAVED_FLIGHTS.forEach((f) => {
    apCounts[f.origin] = (apCounts[f.origin] ?? 0) + 1;
    apCounts[f.destination] = (apCounts[f.destination] ?? 0) + 1;
  });
  const topAp = Object.entries(apCounts).sort((a, b) => b[1] - a[1])[0];
  const avgLanding =
    Math.round(SAVED_FLIGHTS.reduce((s, f) => s + f.landingRateFpm, 0) / SAVED_FLIGHTS.length) || 0;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Analytics"
        description="Full depth for every account: hours, sectors, aircraft mix, airport heat, landing histograms."
      />

      <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4 lg:p-6">
        <GlassCard title="Flight hours" subtitle={`${hours} h`} />
        <GlassCard title="Flights" subtitle={String(SAVED_FLIGHTS.length)} />
        <GlassCard title="Most used aircraft" subtitle={topAc ? `${topAc[0]} (${topAc[1]})` : "—"} />
        <GlassCard title="Busiest airport" subtitle={topAp ? `${topAp[0]} (${topAp[1]} visits)` : "—"} />
      </div>

      <div className="grid flex-1 gap-4 px-4 pb-6 lg:grid-cols-2 lg:px-6">
        <GlassCard title="Landing stats" subtitle={`Average ${avgLanding} fpm`}>
          <div className="space-y-4">
            {SAVED_FLIGHTS.map((f) => (
              <div key={f.id}>
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>
                    {f.origin} → {f.destination}
                  </span>
                  <span className="font-mono">{f.landingRateFpm} fpm</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
                    style={{ width: `${Math.min(100, (600 + f.landingRateFpm) / 6)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard title="Leaderboard" subtitle="Global hours · same rules for everyone">
          <ol className="space-y-2">
            {LEADERBOARD.map((row) => (
              <li
                key={row.handle}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-mono text-xs text-slate-300">
                    {row.rank}
                  </span>
                  <Link href={`/pilot/${row.handle}`} className="font-medium text-white hover:text-sky-200">
                    @{row.handle}
                  </Link>
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {row.hours}h · {row.landings} LDG
                </span>
              </li>
            ))}
          </ol>
        </GlassCard>
      </div>
    </div>
  );
}
