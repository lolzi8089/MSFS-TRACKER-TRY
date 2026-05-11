import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(var(--radar-grid) 1px, transparent 1px), linear-gradient(90deg, var(--radar-grid) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />
        <main className="relative z-10 flex min-h-screen flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
