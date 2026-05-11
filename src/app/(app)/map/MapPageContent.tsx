"use client";

import { LiveMap } from "@/components/map/LiveMap";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { useSimulatedLiveFlights } from "@/hooks/useSimulatedLiveFlights";
import { useRemoteLiveFlightsPoll } from "@/hooks/useRemoteLiveFlightsPoll";
import { LIVE_FLIGHTS_SEED } from "@/lib/mock-data";
import { Radio, Wifi } from "lucide-react";

export default function MapPageContent() {
  const remote = useRemoteLiveFlightsPoll(3000);
  const simulated = useSimulatedLiveFlights(remote.length === 0);
  const flights = remote.length > 0 ? remote : simulated;
  const primary = flights[0] ?? LIVE_FLIGHTS_SEED[0];
  const liveSource = remote.length > 0 ? "Database (public live)" : "Simulated preview";

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Live operations"
        description="SimConnect bridge posts telemetry to PostgreSQL; this map polls /api/live. When nobody is connected, a local simulation keeps the UI alive."
        action={
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-200">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {liveSource}
          </div>
        }
      />

      <div className="grid flex-1 gap-4 p-4 lg:grid-cols-[1fr_320px] lg:p-6">
        <GlassCard className="relative min-h-[480px] overflow-hidden p-0 lg:min-h-0">
          <div className="absolute left-4 top-4 z-[500] flex flex-wrap gap-2">
            <span className="rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-300 backdrop-blur">
              Mapbox / Leaflet interchange
            </span>
            <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-100 backdrop-blur">
              Radar dark
            </span>
          </div>
          <LiveMap flights={flights} />
        </GlassCard>

        <div className="flex flex-col gap-4">
          <GlassCard title="Live status" subtitle={primary.callsign}>
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500">Altitude</dt>
                <dd className="font-mono text-lg text-white">FL{Math.round(primary.altitudeFt / 100)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Ground speed</dt>
                <dd className="font-mono text-lg text-white">{primary.speedKts} kt</dd>
              </div>
              <div>
                <dt className="text-slate-500">Heading</dt>
                <dd className="font-mono text-lg text-white">{primary.heading}°</dd>
              </div>
              <div>
                <dt className="text-slate-500">ETA (UTC)</dt>
                <dd className="font-mono text-lg text-white">{primary.etaUtc}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Route</dt>
                <dd className="mt-1 font-medium text-sky-100">
                  {primary.origin} → {primary.destination}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-slate-500">Aircraft</dt>
                <dd className="mt-1 text-white">{primary.aircraft}</dd>
              </div>
            </dl>
          </GlassCard>

          <GlassCard title="Stack" subtitle="Production targets">
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Wifi className="h-3.5 w-3.5 text-sky-400" /> SimConnect bridge (Windows) → HTTPS ingest
              </li>
              <li className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-sky-400" /> PostgreSQL sessions + public /api/live
              </li>
              <li>Optional: WebSocket fan-out + Redis for higher concurrency</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
