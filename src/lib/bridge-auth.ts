import { timingSafeEqual } from "node:crypto";

export function verifyBridgeSecret(headerValue: string | null): boolean {
  const expected = process.env.BRIDGE_SECRET;
  if (!expected || expected.length < 8) {
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
