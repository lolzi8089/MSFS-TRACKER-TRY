import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";

export const metadata = {
  title: "Settings · SkyPulse",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Discord login, notification routing, and map preferences — all included, nothing gated."
      />

      <div className="grid max-w-3xl gap-4 p-4 lg:p-6">
        <GlassCard title="SimConnect bridge" subtitle="MSFS 2020 / 2024 on Windows">
          <p className="text-sm leading-relaxed text-slate-400">
            The bridge in <span className="font-mono text-slate-200">/bridge</span> runs on the same PC as Microsoft
            Flight Simulator, reads live position via SimConnect, and POSTs to{" "}
            <span className="font-mono text-slate-200">/api/telemetry</span>. By default the app uses a local{" "}
            <span className="font-mono text-slate-200">SQLite</span> file (<span className="font-mono">prisma/dev.db</span>
            ) — no Docker required. The bridge loads <span className="font-mono text-slate-200">.env</span> from the
            project root automatically.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-400">
            <li>
              One-time: <span className="font-mono text-slate-200">npm run msfs:setup</span> (creates DB + installs
              bridge deps). If Prisma errors with EPERM on Windows, stop <span className="font-mono text-slate-200">npm
              run dev</span> first, then run <span className="font-mono text-slate-200">npm run db:regenerate</span>.
            </li>
            <li>
              Terminal A: <span className="font-mono text-slate-200">npm run dev</span>
            </li>
            <li>
              Start MSFS, then terminal B: <span className="font-mono text-slate-200">npm run msfs:bridge</span>
            </li>
            <li>
              Open <span className="font-mono text-slate-200">/map</span> — you should see your aircraft. Optional:{" "}
              set <span className="font-mono text-slate-200">BRIDGE_SECRET</span> (≥8 chars) in{" "}
              <span className="font-mono text-slate-200">.env</span>; if you skip it in dev, a built-in fallback is used.
            </li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            Optional: <span className="font-mono">MSFS_VERSION=2024</span>, <span className="font-mono">ORIGIN_ICAO</span>
            , <span className="font-mono">DEST_ICAO</span>, <span className="font-mono">API_BASE</span>,{" "}
            <span className="font-mono">PILOT_HANDLE</span>, <span className="font-mono">CALLSIGN</span>. For Postgres
            instead of SQLite, set <span className="font-mono">DATABASE_URL</span> and run{" "}
            <span className="font-mono">docker compose up -d</span> + <span className="font-mono">npx prisma db push</span>
            .
          </p>
        </GlassCard>

        <GlassCard title="Account" subtitle="Discord OAuth (prototype)">
          <button
            type="button"
            className="rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/25"
          >
            Continue with Discord
          </button>
          <p className="mt-3 text-xs text-slate-500">
            No subscription prompts after linking — community identity only.
          </p>
        </GlassCard>

        <GlassCard title="Notifications" subtitle="Real-time channels">
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span>Friend goes live</span>
              <input type="checkbox" defaultChecked className="accent-sky-500" />
            </li>
            <li className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span>Group flight reminders</span>
              <input type="checkbox" defaultChecked className="accent-sky-500" />
            </li>
            <li className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <span>Virtual airline dispatches</span>
              <input type="checkbox" className="accent-sky-500" />
            </li>
          </ul>
        </GlassCard>

        <GlassCard title="Map" subtitle="Mapbox token or OSM tiles">
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-500">
            Mapbox access token
          </label>
          <input
            type="password"
            placeholder="pk.········"
            className="mt-2 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-slate-200 outline-none ring-sky-500/40 focus:ring-2"
          />
          <p className="mt-2 text-xs text-slate-500">Leave blank to use bundled community tile stack.</p>
        </GlassCard>
      </div>
    </div>
  );
}
