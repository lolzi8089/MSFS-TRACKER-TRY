import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { FRIENDS } from "@/lib/mock-data";
import { UserPlus } from "lucide-react";

export const metadata = {
  title: "Friends · SkyPulse",
};

export default function FriendsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Friends & following"
        description="Discord-linked identities in production; this screen mirrors the social graph."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500/90 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          >
            <UserPlus className="h-4 w-4" />
            Find pilots
          </button>
        }
      />

      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:p-6">
        {FRIENDS.map((f) => (
          <GlassCard key={f.handle}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link href={`/pilot/${f.handle}`} className="text-lg font-semibold text-white hover:text-sky-200">
                  {f.name}
                </Link>
                <p className="text-xs text-slate-500">@{f.handle}</p>
              </div>
              <span
                className={
                  f.status === "In flight"
                    ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-500/30"
                    : f.status === "Online"
                      ? "rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sky-200 ring-1 ring-sky-500/30"
                      : "rounded-full bg-slate-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ring-1 ring-slate-500/25"
                }
              >
                {f.status}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Callsign <span className="font-mono text-slate-300">{f.callsign}</span>
            </p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
