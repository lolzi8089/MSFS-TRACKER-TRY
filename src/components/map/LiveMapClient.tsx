"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import type { LiveFlight } from "@/lib/mock-data";

const darkTiles =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

type Props = {
  flights: LiveFlight[];
  className?: string;
};

export function LiveMapClient({ flights, className }: Props) {
  const center = useMemo(() => {
    if (!flights.length) return [55.0, 10.0] as [number, number];
    const lat = flights.reduce((s, f) => s + f.lat, 0) / flights.length;
    const lng = flights.reduce((s, f) => s + f.lng, 0) / flights.length;
    return [lat, lng] as [number, number];
  }, [flights]);

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={4}
        className="h-full w-full rounded-xl"
        scrollWheelZoom
        zoomControl={false}
      >
        <TileLayer attribution={attribution} url={darkTiles} />
        {flights.map((f) => (
          <Polyline
            key={`${f.id}-path`}
            positions={f.path.map(([lat, lng]) => [lat, lng])}
            pathOptions={{
              color: "#38bdf8",
              weight: 2,
              opacity: 0.45,
              dashArray: "6 10",
            }}
          />
        ))}
        {flights.map((f) => (
          <CircleMarker
            key={f.id}
            center={[f.lat, f.lng]}
            radius={9}
            pathOptions={{
              color: "#7dd3fc",
              weight: 2,
              fillColor: "#0ea5e9",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={false}>
              <div className="text-xs font-medium text-slate-900">
                <div className="font-semibold">{f.callsign}</div>
                <div>
                  {f.origin} → {f.destination}
                </div>
                <div className="text-[10px] text-slate-600">
                  FL{f.altitudeFt.toLocaleString()} · {f.speedKts} kt · {f.phase}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
