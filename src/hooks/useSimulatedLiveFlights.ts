"use client";

import { useEffect, useState } from "react";
import type { LiveFlight } from "@/lib/mock-data";
import { LIVE_FLIGHTS_SEED } from "@/lib/mock-data";

function jitter(n: number, amount: number) {
  return n + (Math.random() - 0.5) * amount;
}

export function useSimulatedLiveFlights(enabled = true, intervalMs = 2500) {
  const [flights, setFlights] = useState<LiveFlight[]>(LIVE_FLIGHTS_SEED);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      setFlights((prev) =>
        prev.map((f) => ({
          ...f,
          lat: jitter(f.lat, 0.004),
          lng: jitter(f.lng, 0.004),
          heading: Math.round((f.heading + (Math.random() - 0.5) * 8 + 360) % 360),
          altitudeFt: Math.round(f.altitudeFt + (Math.random() - 0.5) * 120),
          speedKts: Math.round(f.speedKts + (Math.random() - 0.5) * 6),
        })),
      );
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);

  return flights;
}
