import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  title,
  subtitle,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      className={cn(
        "glass-panel rounded-xl p-5 text-sm text-slate-300",
        className,
      )}
    >
      {title ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">{title}</h2>
            {subtitle ? <p className="mt-1 text-base font-medium text-white">{subtitle}</p> : null}
          </div>
        </div>
      ) : null}
      {children}
    </section>
  );
}
