"use client";

import dynamic from "next/dynamic";
import { useSimulatedLiveFlights } from "@/hooks/useSimulatedLiveFlights";
import type { LiveFlight } from "@/lib/mock-data";

const LiveMapClient = dynamic(() => import("./LiveMapClient").then((m) => m.LiveMapClient), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center rounded-xl border border-white/10 bg-slate-950/60 text-sm text-slate-400">
      Initializing radar…
    </div>
  ),
});

type Props = {
  /** When omitted, positions are simulated on an interval (prototype). */
  flights?: LiveFlight[];
};

export function LiveMap({ flights: controlled }: Props) {
  const simulated = useSimulatedLiveFlights(controlled === undefined);
  const flights = controlled ?? simulated;
  return <LiveMapClient flights={flights} className="h-full min-h-[420px] w-full overflow-hidden rounded-xl" />;
}
