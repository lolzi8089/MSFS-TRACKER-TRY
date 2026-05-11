import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { open, Protocol, SimConnectConstants, SimConnectDataType, SimConnectPeriod } from "node-simconnect";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_BASE = (process.env.API_BASE ?? "http://localhost:3000").replace(/\/$/, "");
const BRIDGE_SECRET = process.env.BRIDGE_SECRET ?? "";
const PILOT_HANDLE = (process.env.PILOT_HANDLE ?? "demo-pilot").toLowerCase();
const DISPLAY_NAME = process.env.DISPLAY_NAME ?? "Demo Pilot";
const CALLSIGN = process.env.CALLSIGN ?? "SKYPULSE";
const AIRCRAFT_TITLE = process.env.AIRCRAFT_TITLE ?? "MSFS aircraft";
const ORIGIN_ICAO = process.env.ORIGIN_ICAO ?? undefined;
const DEST_ICAO = process.env.DEST_ICAO ?? undefined;
const MSFS_VERSION = process.env.MSFS_VERSION ?? "2020";

const REQ_POS = 1 as const;
const DEF_POS = 1 as const;

const sessionFile = join(__dirname, "..", ".skypulse-session");

function loadOrCreateSessionId(): string {
  if (existsSync(sessionFile)) {
    const existing = readFileSync(sessionFile, "utf8").trim();
    if (existing) return existing;
  }
  const id = randomUUID();
  writeFileSync(sessionFile, id, "utf8");
  return id;
}

const clientSessionId = loadOrCreateSessionId();

async function postTelemetry(body: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/telemetry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BRIDGE_SECRET}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Telemetry HTTP ${res.status}: ${text}`);
  }
}

async function endSession() {
  try {
    await postTelemetry({
      pilotHandle: PILOT_HANDLE,
      displayName: DISPLAY_NAME,
      callsign: CALLSIGN,
      aircraftTitle: AIRCRAFT_TITLE,
      originIcao: ORIGIN_ICAO,
      destIcao: DEST_ICAO,
      lat: 0,
      lng: 0,
      altitudeFt: 0,
      heading: 0,
      speedKts: 0,
      clientSessionId,
      endSession: true,
    });
    console.log("Session closed on server.");
  } catch (e) {
    console.error("Failed to end session on server:", e);
  }
}

function protocolOrder(): Protocol[] {
  if (MSFS_VERSION === "2024") {
    return [Protocol.SunRise, Protocol.KittyHawk, Protocol.FSX_SP2];
  }
  return [Protocol.KittyHawk, Protocol.SunRise, Protocol.FSX_SP2];
}

async function connectSim() {
  let last: unknown;
  for (const p of protocolOrder()) {
    try {
      const conn = await open("SkyPulse Bridge", p);
      console.log(`SimConnect connected (${String(p)}) — ${conn.recvOpen.applicationName}`);
      return conn;
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

async function main() {
  if (!BRIDGE_SECRET || BRIDGE_SECRET.length < 8) {
    console.error("Set BRIDGE_SECRET (min 8 chars) to match the Next.js server .env");
    process.exit(1);
  }

  const { handle } = await connectSim();

  handle.addToDataDefinition(DEF_POS, "Plane Latitude", "degrees", SimConnectDataType.FLOAT64);
  handle.addToDataDefinition(DEF_POS, "Plane Longitude", "degrees", SimConnectDataType.FLOAT64);
  handle.addToDataDefinition(DEF_POS, "Plane Altitude", "feet", SimConnectDataType.FLOAT64);
  handle.addToDataDefinition(DEF_POS, "Plane Heading Degrees True", "degrees", SimConnectDataType.FLOAT64);
  handle.addToDataDefinition(DEF_POS, "Airspeed Indicated", "knots", SimConnectDataType.FLOAT64);

  handle.on("simObjectData", (recv) => {
    if (recv.requestID !== REQ_POS) return;
    const latitude = recv.data.readFloat64();
    const longitude = recv.data.readFloat64();
    const altitudeFt = recv.data.readFloat64();
    const heading = recv.data.readFloat64();
    const speedKts = recv.data.readFloat64();

    void postTelemetry({
      pilotHandle: PILOT_HANDLE,
      displayName: DISPLAY_NAME,
      callsign: CALLSIGN,
      aircraftTitle: AIRCRAFT_TITLE,
      originIcao: ORIGIN_ICAO,
      destIcao: DEST_ICAO,
      lat: latitude,
      lng: longitude,
      altitudeFt,
      heading,
      speedKts,
      clientSessionId,
    }).catch((e) => console.error("Telemetry post failed:", e));
  });

  handle.on("exception", (ex) => console.error("SimConnect exception:", ex));
  handle.on("quit", () => {
    console.log("Simulator quit.");
    void endSession();
    process.exit(0);
  });

  handle.requestDataOnSimObject(
    REQ_POS,
    DEF_POS,
    SimConnectConstants.OBJECT_ID_USER,
    SimConnectPeriod.SECOND,
  );

  const shutdown = () => {
    void endSession();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  console.log(`Streaming to ${API_BASE} as @${PILOT_HANDLE} (${CALLSIGN}) — session ${clientSessionId}`);
}

void main().catch((e) => {
  console.error(e);
  process.exit(1);
});
