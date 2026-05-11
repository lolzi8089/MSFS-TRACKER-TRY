import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { GlassCard } from "@/components/dashboard/GlassCard";
import { getAircraft } from "@/lib/mock-data";
import { Camera, FileText } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const ac = getAircraft(id);
  return { title: ac ? `${ac.registration} · Aircraft` : "Aircraft · SkyPulse" };
}

export default async function AircraftPage({ params }: Props) {
  const { id } = await params;
  const ac = getAircraft(id);
  if (!ac) notFound();

  const jetPhotosUrl = `https://www.jetphotos.com/registration/${encodeURIComponent(ac.jetPhotosQuery)}`;

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={ac.type}
        description={`${ac.registration} · ${ac.livery}`}
        action={
          <a
            href={jetPhotosUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/[0.08]"
          >
            <Camera className="h-4 w-4" />
            JetPhotos lookup
          </a>
        }
      />

      <div className="grid gap-4 p-4 lg:grid-cols-2 lg:p-6">
        <GlassCard title="Aircraft profile" subtitle="Registration & livery">
          <dl className="grid gap-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Registration</dt>
              <dd className="mt-1 font-mono text-xl text-white">{ac.registration}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Livery</dt>
              <dd className="mt-1 text-slate-200">{ac.livery}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider text-slate-500">Hours on type</dt>
              <dd className="mt-1 font-mono text-slate-200">{ac.hoursOnType} h</dd>
            </div>
          </dl>
        </GlassCard>

        <GlassCard title="SimBrief" subtitle="OFP import · route sync">
          <div className="flex items-start gap-3 text-sm text-slate-400">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
            <div>
              <p>
                Production flow: paste dispatch ID, hydrate route, fuel, alternates. Same workspace as{" "}
                <Link href="/map" className="text-sky-300 hover:text-sky-200">
                  live map
                </Link>
                .
              </p>
              <button
                type="button"
                className="mt-4 rounded-lg border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sky-100"
              >
                Connect SimBrief (stub)
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="Gallery" subtitle="JetPhotos + hangar uploads" className="lg:col-span-2">
          <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-white/10 bg-black/30 text-sm text-slate-500">
            Aircraft photo grid — wire JetPhotos API by registration (
            <span className="font-mono text-slate-400">{ac.jetPhotosQuery}</span>)
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
