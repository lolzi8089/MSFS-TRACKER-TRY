export function appendPathPoint(pathJson: string, lat: number, lng: number, maxPoints = 48): string {
  try {
    const parsed = JSON.parse(pathJson) as unknown;
    const arr = Array.isArray(parsed) ? (parsed as [number, number][]) : [];
    arr.push([lat, lng]);
    return JSON.stringify(arr.slice(-maxPoints));
  } catch {
    return JSON.stringify([[lat, lng]]);
  }
}

export function parsePath(pathJson: string | null | undefined): [number, number][] {
  try {
    const parsed = JSON.parse(pathJson ?? "[]") as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p) => {
        if (!Array.isArray(p) || p.length < 2) return null;
        const lat = Number(p[0]);
        const lng = Number(p[1]);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        return [lat, lng] as [number, number];
      })
      .filter((x): x is [number, number] => x !== null);
  } catch {
    return [];
  }
}

export function ensurePathForMap(path: [number, number][], lat: number, lng: number): [number, number][] {
  if (path.length >= 2) return path;
  if (path.length === 1) return [path[0], [lat, lng]];
  return [[lat, lng], [lat, lng]];
}
