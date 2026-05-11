import { prisma } from "@/lib/prisma";

export type DbPilotView = {
  handle: string;
  displayName: string;
  createdAt: Date;
  flightCount: number;
  hoursApprox: number;
  recent: {
    id: string;
    origin: string | null;
    destination: string | null;
    aircraft: string;
    callsign: string;
    endedAt: Date;
    durationMin: number | null;
  }[];
};

export async function getDbPilot(handle: string): Promise<DbPilotView | null> {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const h = handle.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { handle: h },
    });

    if (!user) {
      return null;
    }

    const [recent, flightCount, sumAgg] = await Promise.all([
      prisma.completedFlight.findMany({
        where: { userId: user.id },
        orderBy: { endedAt: "desc" },
        take: 12,
      }),
      prisma.completedFlight.count({ where: { userId: user.id } }),
      prisma.completedFlight.aggregate({
        where: { userId: user.id },
        _sum: { durationMin: true },
      }),
    ]);

    const minutes = sumAgg._sum.durationMin ?? 0;
    const hoursApprox = Math.round((minutes / 60) * 10) / 10;

    return {
      handle: user.handle,
      displayName: user.displayName,
      createdAt: user.createdAt,
      flightCount,
      hoursApprox,
      recent: recent.map((f) => ({
        id: f.id,
        origin: f.originIcao,
        destination: f.destIcao,
        aircraft: f.aircraftTitle,
        callsign: f.callsign,
        endedAt: f.endedAt,
        durationMin: f.durationMin,
      })),
    };
  } catch {
    return null;
  }
}
