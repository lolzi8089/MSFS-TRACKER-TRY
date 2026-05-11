import Link from "next/link";
import { ArrowRight, Check, Plane, Radar, Users, Zap } from "lucide-react";

const features = [
  {
    title: "Live MSFS tracking",
    body: "WebSocket-first pipeline with SimConnect ingest, Redis fan-out, and sub-second map updates.",
    icon: Radar,
  },
  {
    title: "Full logbook & analytics",
    body: "Automatic flights, landing stats, airport heatmaps, and aircraft insights — zero locked charts.",
    icon: Plane,
  },
  {
    title: "Social layer",
    body: "Friends, following, feed, comments, likes, and VA tools built for the community, not upsells.",
    icon: Users,
  },
  {
    title: "Pilot & aircraft hubs",
    body: "Showcase flights, JetPhotos by registration, SimBrief OFP sync, and replay-ready telemetry.",
    icon: Zap,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
        aria-hidden
      />
      <div className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-400/30">
            <Plane className="h-5 w-5 text-sky-300" />
          </span>
          <div>
            <p className="text-sm font-semibold text-white">SkyPulse</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">MSFS live</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <Link href="/map" className="transition hover:text-white">
            Live map
          </Link>
          <Link href="/feed" className="transition hover:text-white">
            Community
          </Link>
          <Link href="/analytics" className="transition hover:text-white">
            Analytics
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/settings"
            className="hidden rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:bg-white/[0.04] sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-950 shadow-lg shadow-sky-500/25 transition hover:bg-sky-400"
          >
            Open radar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-10">
        <div className="glass-panel max-w-3xl rounded-2xl p-8 md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/90">Community · no paywalls</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            The flight tracker that stays{" "}
            <span className="bg-gradient-to-r from-sky-200 to-indigo-200 bg-clip-text text-transparent">
              completely free
            </span>
            .
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-400">
            Volanta-grade live map, logbook, social feed, VA events, SimBrief hooks, and replay — engineered for MSFS
            pilots who refuse subscriptions and locked stats.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-sky-500/10 transition hover:bg-slate-100"
            >
              Launch prototype
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/flights"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/[0.07]"
            >
              Explore logbook UI
            </Link>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            {[
              "No premium tiers or feature flags on core data",
              "Discord-ready identity & notifications",
              "Docker + Postgres + Redis reference architecture",
              "Mapbox or Leaflet — your token, your tiles",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Product surface</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="glass-panel rounded-xl p-6 transition hover:border-sky-500/25">
                  <Icon className="h-6 w-6 text-sky-400" />
                  <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.body}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
