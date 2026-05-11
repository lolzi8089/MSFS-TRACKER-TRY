import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { SAVED_FLIGHTS } from "@/lib/mock-data";
import { getCommunityCompletedFlights } from "@/lib/public-flights";
import { ArrowRight, Plane } from "lucide-react";

export const metadata = {
  title: "Flight log · SkyPulse",
};

export default async function FlightsPage() {
  const community = await getCommunityCompletedFlights();

  const demoTotalMin = SAVED_FLIGHTS.reduce((s, f) => s + f.durationMin, 0);
  const demoHours = Math.round((demoTotalMin / 60) * 10) / 10;

  const communityHours =
    community?.reduce((s, f) => s + (f.durationMin ?? 0), 0) ?? 0;
  const hours = community?.length
    ? Math.round((communityHours / 60) * 10) / 10
    : demoHours;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Flight history"
        description={
          community
            ? "Completed sessions from every pilot using the SimConnect bridge (public logbook)."
            : "Connect PostgreSQL to aggregate community flights. Demo rows below are local-only."
        }
        action={
          <button
            type="button"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/[0.08]"
          >
            Export log (stub)
          </button>
        }
      />

      <div className="grid gap-4 p-4 sm:grid-cols-3 lg:p-6">
        <GlassCard title="Flight time (sample)" subtitle={`${hours} h`} />
        <GlassCard
          title="Flights listed"
          subtitle={String(community?.length ?? SAVED_FLIGHTS.length)}
        />
        <GlassCard title="Avg. landing" subtitle={community ? "—" : "-287 fpm"} />
      </div>

      <div className="flex-1 px-4 pb-6 lg:px-6">
        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Ended (UTC)</th>
                  <th className="px-4 py-3 font-medium">Pilot</th>
                  <th className="px-4 py-3 font-medium">Callsign</th>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Aircraft</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {community
                  ? community.map((f) => (
                      <tr key={f.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {f.endedAt.toISOString().slice(0, 16).replace("T", " ")}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/pilot/${f.pilotHandle}`} className="font-medium text-sky-200 hover:text-sky-100">
                            @{f.pilotHandle}
                          </Link>
                          <div className="text-xs text-slate-500">{f.pilotName}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">{f.callsign}</td>
                        <td className="px-4 py-3 font-medium text-white">
                          {(f.origin ?? "----") + " "}
                          <ArrowRight className="mx-1 inline h-3 w-3 text-slate-500" /> {f.destination ?? "----"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{f.aircraft}</td>
                        <td className="px-4 py-3 text-slate-400">{f.durationMin != null ? `${f.durationMin} min` : "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href="/replay"
                            className="inline-flex items-center gap-1 text-xs font-medium text-sky-300 hover:text-sky-200"
                          >
                            <Plane className="h-3.5 w-3.5" />
                            Replay
                          </Link>
                        </td>
                      </tr>
                    ))
                  : SAVED_FLIGHTS.map((f) => (
                      <tr key={f.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono text-slate-300">{f.date}</td>
                        <td className="px-4 py-3 text-slate-500">@you (demo)</td>
                        <td className="px-4 py-3 font-mono text-slate-500">—</td>
                        <td className="px-4 py-3 font-medium text-white">
                          {f.origin} <ArrowRight className="mx-1 inline h-3 w-3 text-slate-500" /> {f.destination}
                        </td>
                        <td className="px-4 py-3 text-slate-300">{f.aircraft}</td>
                        <td className="px-4 py-3 text-slate-400">{f.durationMin} min</td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href="/replay"
                            className="inline-flex items-center gap-1 text-xs font-medium text-sky-300 hover:text-sky-200"
                          >
                            <Plane className="h-3.5 w-3.5" />
                            Replay
                          </Link>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
