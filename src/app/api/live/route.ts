import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { LiveFlight } from "@/lib/mock-data";
import { ensurePathForMap, parsePath } from "@/lib/path-json";

export const dynamic = "force-dynamic";

const STALE_MS = 5 * 60 * 1000;

function inferPhase(altFt: number): LiveFlight["phase"] {
  if (altFt < 500) return "ground";
  if (altFt < 8000) return "climb";
  return "cruise";
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: true, flights: [] as LiveFlight[], source: "no_database" });
  }

  const since = new Date(Date.now() - STALE_MS);

  try {
    const rows = await prisma.liveSession.findMany({
      where: {
        endedAt: null,
        updatedAt: { gte: since },
      },
      include: { user: true },
      orderBy: { updatedAt: "desc" },
      take: 200,
    });

    const flights: LiveFlight[] = rows.map((s) => {
      const rawPath = parsePath(s.pathJson);
      const path = ensurePathForMap(rawPath, s.lastLat, s.lastLng);
      return {
        id: s.id,
        callsign: s.callsign,
        pilotHandle: s.user.handle,
        lat: s.lastLat,
        lng: s.lastLng,
        heading: Math.round(s.lastHeading) % 360,
        altitudeFt: Math.round(s.lastAltFt),
        speedKts: Math.round(s.lastSpeedKts),
        origin: s.originIcao ?? "----",
        destination: s.destIcao ?? "----",
        etaUtc: "--:--",
        aircraft: s.aircraftTitle,
        phase: inferPhase(s.lastAltFt),
        path,
      };
    });

    return NextResponse.json({ ok: true, flights, source: "database" });
  } catch {
    return NextResponse.json({ ok: true, flights: [] as LiveFlight[], source: "database_error" });
  }
}
