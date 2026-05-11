import { timingSafeEqual } from "node:crypto";

/** Used only when NODE_ENV !== production and BRIDGE_SECRET is unset (local MSFS testing). */
export const DEV_BRIDGE_SECRET_FALLBACK = "dev-skypulse-bridge-local-only";

let warnedDevFallback = false;

export function getEffectiveBridgeSecret(): string {
  const fromEnv = process.env.BRIDGE_SECRET?.trim() ?? "";
  if (fromEnv.length >= 8) {
    return fromEnv;
  }
  if (process.env.NODE_ENV !== "production") {
    if (!warnedDevFallback) {
      warnedDevFallback = true;
      console.warn(
        `[SkyPulse] BRIDGE_SECRET not set (or shorter than 8 chars). Using dev fallback "${DEV_BRIDGE_SECRET_FALLBACK}".`,
      );
    }
    return DEV_BRIDGE_SECRET_FALLBACK;
  }
  return "";
}

export function verifyBridgeSecret(headerValue: string | null): boolean {
  const expected = getEffectiveBridgeSecret();
  if (!expected) {
    return false;
  }
  if (!headerValue) return false;
  const token = headerValue.startsWith("Bearer ") ? headerValue.slice(7).trim() : headerValue.trim();
  if (token.length !== expected.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}
