import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { getPilot } from "@/lib/mock-data";
import { getDbPilot } from "@/lib/pilot-from-db";
import { Plane, Trophy } from "lucide-react";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const h = handle.toLowerCase();
  const db = await getDbPilot(h);
  if (db) {
    return { title: `${db.displayName} · SkyPulse` };
  }
  const pilot = getPilot(h);
  return { title: pilot ? `${pilot.displayName} · SkyPulse` : "Pilot · SkyPulse" };
}

export default async function PilotProfilePage({ params }: Props) {
  const { handle } = await params;
  const h = handle.toLowerCase();

  const db = await getDbPilot(h);
  if (db) {
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(db.handle)}`;
    const joined = db.createdAt.toISOString().slice(0, 10);

    return (
      <div className="flex flex-1 flex-col">
        <PageHeader
          title={db.displayName}
          description="Profile from live database (SimConnect bridge + logbook)."
          action={
            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-white/[0.08]"
            >
              Follow
            </button>
          }
        />

        <div className="grid gap-4 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
          <GlassCard className="h-fit">
            <div className="flex flex-col items-center text-center">
              <Image
                src={avatarUrl}
                alt=""
                width={96}
                height={96}
                className="h-24 w-24 rounded-2xl ring-2 ring-sky-500/30"
              />
              <p className="mt-4 text-lg font-semibold text-white">{db.displayName}</p>
              <p className="text-sm text-slate-500">@{db.handle}</p>
              <p className="mt-2 text-xs text-slate-600">Joined {joined}</p>
            </div>
            <dl className="mt-6 space-y-3 border-t border-white/[0.06] pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Hours (approx.)</dt>
                <dd className="font-mono text-white">{db.hoursApprox}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Completed flights</dt>
                <dd className="font-mono text-white">{db.flightCount}</dd>
              </div>
            </dl>
          </GlassCard>

          <div className="flex flex-col gap-4">
            <GlassCard title="Recent flights" subtitle="Public logbook">
              {db.recent.length === 0 ? (
                <p className="text-sm text-slate-500">No completed flights yet.</p>
              ) : (
                <ul className="space-y-3">
                  {db.recent.map((f) => (
                    <li
                      key={f.id}
                      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25">
                          <Plane className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-medium text-white">
                            {(f.origin ?? "----") + " → " + (f.destination ?? "----")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {f.endedAt.toISOString().slice(0, 16).replace("T", " ")} · {f.aircraft} ·{" "}
                            <span className="font-mono">{f.callsign}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p className="font-mono text-slate-200">
                          {f.durationMin != null ? `${f.durationMin} min` : "—"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </GlassCard>

            <GlassCard title="Pilot stats" subtitle="Leaderboard-ready metrics">
              <div className="flex items-center gap-3 text-slate-400">
                <Trophy className="h-5 w-5 text-amber-300/90" />
                <p className="text-sm">
                  All stats visible to followers — no locked tiers.{" "}
                  <Link href="/analytics" className="text-sky-300 hover:text-sky-200">
                    Open analytics
                  </Link>
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  const pilot = getPilot(h);
  if (!pilot) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={pilot.displayName}
        description={pilot.bio}
        action={
          <button
            type="button"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:bg-white/[0.08]"
          >
            Follow
          </button>
        }
      />

      <div className="grid gap-4 p-4 lg:grid-cols-[280px_1fr] lg:p-6">
        <GlassCard className="h-fit">
          <div className="flex flex-col items-center text-center">
            <Image
              src={pilot.avatarUrl}
              alt=""
              width={96}
              height={96}
              className="h-24 w-24 rounded-2xl ring-2 ring-sky-500/30"
            />
            <p className="mt-4 text-lg font-semibold text-white">{pilot.displayName}</p>
            <p className="text-sm text-slate-500">@{pilot.handle}</p>
            <p className="mt-2 text-xs text-slate-600">Joined {pilot.joined}</p>
          </div>
          <dl className="mt-6 space-y-3 border-t border-white/[0.06] pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Hours</dt>
              <dd className="font-mono text-white">{pilot.hours}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Flights</dt>
              <dd className="font-mono text-white">{pilot.flights}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Favorite aircraft</dt>
              <dd className="mt-1 font-medium text-sky-100">{pilot.favoriteAircraft}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Top airports</dt>
              <dd className="mt-1 font-mono text-xs text-slate-300">{pilot.favoriteAirports.join(" · ")}</dd>
            </div>
          </dl>
        </GlassCard>

        <div className="flex flex-col gap-4">
          <GlassCard title="Showcase flights" subtitle="Pinned from logbook">
            <ul className="space-y-3">
              {pilot.showcase.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/25">
                      <Plane className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-medium text-white">
                        {f.origin} → {f.destination}
                      </p>
                      <p className="text-xs text-slate-500">
                        {f.date} · {f.aircraft}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p className="font-mono text-slate-200">{f.durationMin} min</p>
                    <p>Landing {f.landingRateFpm} fpm</p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard title="Pilot stats" subtitle="Leaderboard-ready metrics">
            <div className="flex items-center gap-3 text-slate-400">
              <Trophy className="h-5 w-5 text-amber-300/90" />
              <p className="text-sm">
                All stats visible to followers — no locked tiers.{" "}
                <Link href="/analytics" className="text-sky-300 hover:text-sky-200">
                  Open analytics
                </Link>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
