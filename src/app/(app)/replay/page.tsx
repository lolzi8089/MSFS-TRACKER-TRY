import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { SAVED_FLIGHTS } from "@/lib/mock-data";
import { Play } from "lucide-react";

export const metadata = {
  title: "Replay · SkyPulse",
};

export default function ReplayPage() {
  const f = SAVED_FLIGHTS[0];
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Flight replay"
        description="Telemetry timeline + map scrubber — identical tooling for all pilots."
      />

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <GlassCard className="min-h-[360px] flex-1 overflow-hidden p-0">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Recording</p>
                <p className="font-mono text-sm text-white">
                  {f.origin} → {f.destination} · {f.date}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/90 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-950"
              >
                <Play className="h-4 w-4" />
                Play
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center bg-gradient-to-b from-slate-950 to-black">
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at center, rgba(56,189,248,0.15), transparent 55%)" }} />
              <p className="relative z-10 max-w-md text-center text-sm text-slate-500">
                Replay viewport — bind recorded SimConnect samples, camera presets, and optional shared cockpit audio
                offsets.
              </p>
            </div>
            <div className="border-t border-white/[0.06] px-5 py-4">
              <input type="range" min={0} max={100} defaultValue={32} className="w-full accent-sky-500" />
              <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-500">
                <span>00:00</span>
                <span>00:{String(f.durationMin).padStart(2, "0")}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
