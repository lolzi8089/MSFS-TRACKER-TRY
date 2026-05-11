import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyBridgeSecret } from "@/lib/bridge-auth";
import { appendPathPoint } from "@/lib/path-json";

export const dynamic = "force-dynamic";

type Body = {
  pilotHandle: string;
  displayName?: string;
  callsign: string;
  aircraftTitle: string;
  originIcao?: string | null;
  destIcao?: string | null;
  lat: number;
  lng: number;
  altitudeFt: number;
  heading: number;
  speedKts: number;
  clientSessionId: string;
  endSession?: boolean;
};

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyBridgeSecret(auth)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    return await handleTelemetry(body);
  } catch (e) {
    console.error("telemetry error", e);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}

async function handleTelemetry(body: Body) {
  const handle = String(body.pilotHandle ?? "").trim().toLowerCase();
  const displayName = String(body.displayName ?? handle).trim() || handle;
  const callsign = String(body.callsign ?? "").trim();
  const aircraftTitle = String(body.aircraftTitle ?? "").trim() || "Unknown aircraft";
  const clientSessionId = String(body.clientSessionId ?? "").trim();

  if (!handle || handle.length > 32) {
    return NextResponse.json({ ok: false, error: "pilotHandle is required" }, { status: 400 });
  }
  if (!callsign || callsign.length > 20) {
    return NextResponse.json({ ok: false, error: "callsign is required" }, { status: 400 });
  }
  if (!clientSessionId || clientSessionId.length > 64) {
    return NextResponse.json({ ok: false, error: "clientSessionId is required" }, { status: 400 });
  }

  const originIcao = body.originIcao ? String(body.originIcao).slice(0, 4).toUpperCase() : null;
  const destIcao = body.destIcao ? String(body.destIcao).slice(0, 4).toUpperCase() : null;

  const user = await prisma.user.upsert({
    where: { handle },
    create: { handle, displayName },
    update: { displayName },
  });

  const existing = await prisma.liveSession.findFirst({
    where: { userId: user.id, clientSessionId },
  });

  if (body.endSession) {
    if (!existing) {
      return NextResponse.json({ ok: true, message: "No active session" });
    }

    const endedAt = new Date();
    const durationMin = Math.max(
      1,
      Math.round((endedAt.getTime() - existing.startedAt.getTime()) / 60000),
    );

    await prisma.$transaction([
      prisma.completedFlight.create({
        data: {
          userId: user.id,
          callsign: existing.callsign,
          aircraftTitle: existing.aircraftTitle,
          originIcao: existing.originIcao,
          destIcao: existing.destIcao,
          startedAt: existing.startedAt,
          endedAt,
          durationMin,
        },
      }),
      prisma.liveSession.delete({ where: { id: existing.id } }),
    ]);

    return NextResponse.json({ ok: true, ended: true });
  }

  const lat = Number(body.lat);
  const lng = Number(body.lng);
  const altitudeFt = Number(body.altitudeFt);
  const heading = Number(body.heading);
  const speedKts = Number(body.speedKts);
  if (![lat, lng, altitudeFt, heading, speedKts].every(Number.isFinite)) {
    return NextResponse.json({ ok: false, error: "Invalid telemetry numbers" }, { status: 400 });
  }

  if (existing) {
    const pathJson = appendPathPoint(existing.pathJson, lat, lng);
    const session = await prisma.liveSession.update({
      where: { id: existing.id },
      data: {
        callsign,
        aircraftTitle,
        originIcao: originIcao ?? existing.originIcao,
        destIcao: destIcao ?? existing.destIcao,
        lastLat: lat,
        lastLng: lng,
        lastAltFt: altitudeFt,
        lastHeading: heading,
        lastSpeedKts: speedKts,
        pathJson,
      },
    });
    return NextResponse.json({ ok: true, sessionId: session.id });
  }

  const pathJson = appendPathPoint("[]", lat, lng);
  const session = await prisma.liveSession.create({
    data: {
      userId: user.id,
      clientSessionId,
      callsign,
      aircraftTitle,
      originIcao,
      destIcao,
      lastLat: lat,
      lastLng: lng,
      lastAltFt: altitudeFt,
      lastHeading: heading,
      lastSpeedKts: speedKts,
      pathJson,
    },
  });

  return NextResponse.json({ ok: true, sessionId: session.id });
}
