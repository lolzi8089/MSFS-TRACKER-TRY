import { prisma } from "@/lib/prisma";

export type CommunityFlightRow = {
  id: string;
  endedAt: Date;
  pilotHandle: string;
  pilotName: string;
  origin: string | null;
  destination: string | null;
  aircraft: string;
  callsign: string;
  durationMin: number | null;
};

export async function getCommunityCompletedFlights(): Promise<CommunityFlightRow[] | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  try {
    const rows = await prisma.completedFlight.findMany({
      take: 100,
      orderBy: { endedAt: "desc" },
      include: { user: true },
    });

    return rows.map((r) => ({
      id: r.id,
      endedAt: r.endedAt,
      pilotHandle: r.user.handle,
      pilotName: r.user.displayName,
      origin: r.originIcao,
      destination: r.destIcao,
      aircraft: r.aircraftTitle,
      callsign: r.callsign,
      durationMin: r.durationMin,
    }));
  } catch {
    return null;
  }
}
