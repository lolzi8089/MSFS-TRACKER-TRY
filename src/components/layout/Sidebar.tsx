"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  Map,
  Plane,
  Radio,
  Settings,
  Users,
  Compass,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/map", label: "Live map", icon: Map },
  { href: "/flights", label: "Flight log", icon: History },
  { href: "/feed", label: "Community", icon: Activity },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/events", label: "Events", icon: Radio },
  { href: "/replay", label: "Replay", icon: Compass },
];

const secondary = [
  { href: "/aircraft/a320", label: "Aircraft", icon: Plane },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-white/[0.08] bg-[rgba(6,12,22,0.85)] backdrop-blur-xl">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-5">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 ring-1 ring-sky-400/30">
          <span className="absolute inset-0 rounded-xl radar-sweep opacity-60" aria-hidden />
          <Plane className="relative z-10 h-5 w-5 text-sky-300" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight text-white">SkyPulse</p>
          <p className="text-[11px] uppercase tracking-widest text-slate-500">Community tracker</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Operations
        </p>
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sky-500/15 text-sky-100 ring-1 ring-sky-400/25"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {item.label}
            </Link>
          );
        })}

        <p className="mt-6 px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          Library
        </p>
        {secondary.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white/[0.06] text-white ring-1 ring-white/10"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 opacity-80" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <Link
          href="/pilot/you"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.04]"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/40 to-indigo-500/40 text-xs font-bold text-white ring-1 ring-white/10">
            DP
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium text-white">Demo Pilot</span>
            <span className="block truncate text-xs text-slate-500">@you · Prototype session</span>
          </span>
          <Bell className="h-4 w-4 shrink-0 text-slate-500" />
        </Link>
      </div>
    </aside>
  );
}
