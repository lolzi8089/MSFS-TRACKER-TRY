"use client";

import { useEffect, useState } from "react";
import type { LiveFlight } from "@/lib/mock-data";

export function useRemoteLiveFlightsPoll(intervalMs = 3000) {
  const [flights, setFlights] = useState<LiveFlight[]>([]);

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        const data = (await res.json()) as { flights?: LiveFlight[] };
        if (cancelled || !Array.isArray(data.flights)) return;
        setFlights(data.flights);
      } catch {
        if (!cancelled) setFlights([]);
      }
    };

    void tick();
    const id = window.setInterval(() => void tick(), intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return flights;
}
