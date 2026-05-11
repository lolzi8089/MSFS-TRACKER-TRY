import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { EVENTS } from "@/lib/mock-data";

export const metadata = {
  title: "Events · SkyPulse",
};

export default function EventsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Multiplayer events"
        description="Virtual airlines, group flights, and live server slots — RSVP without premium tiers."
      />

      <div className="grid gap-4 p-4 lg:grid-cols-2 lg:p-6">
        {EVENTS.map((e) => (
          <GlassCard key={e.id} title={e.title}>
            <p className="text-xs uppercase tracking-wider text-slate-500">Start (UTC)</p>
            <p className="mt-1 font-mono text-lg text-white">{new Date(e.startUtc).toUTCString()}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
              <span className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-xs">{e.server}</span>
              <span>{e.participants.toLocaleString()} signed up</span>
            </div>
            <button
              type="button"
              className="mt-5 w-full rounded-lg bg-sky-500/90 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-950 hover:bg-sky-400"
            >
              Join event
            </button>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
