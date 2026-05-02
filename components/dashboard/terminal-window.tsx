"use client";

import * as React from "react";
import { Terminal } from "lucide-react";

type ProgressDto = {
  version: 1;
  updatedAt: string;
  hoursStudied: Record<string, number>;
};

function fmtHours(n: number) {
  if (!Number.isFinite(n)) return "0.0";
  return (Math.round(n * 10) / 10).toFixed(1);
}

export function TerminalWindow() {
  const [hours, setHours] = React.useState<ProgressDto["hoursStudied"]>({});

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as ProgressDto;
        if (cancelled) return;
        setHours(data.hoursStudied ?? {});
      } catch {
        // ignore: terminal stays with 0s if offline/error
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const lines = React.useMemo(
    () => [
      { dim: true, text: "saade@progress-tracker:~$" },
      { text: "progress hours --show" },
      { dim: true, text: `C:                 ${fmtHours(hours.c_programming)} h` },
      { dim: true, text: `Data Structures:    ${fmtHours(hours.data_structures_trees)} h` },
      { dim: true, text: `Java:              ${fmtHours(hours.java_enterprise)} h` },
      { dim: true, text: `Réseau:            ${fmtHours(hours.networking)} h` },
      { dim: true, text: `Math & Stats:      ${fmtHours(hours.math_stats)} h` },
      { dim: true, text: `CLI & French:      ${fmtHours(hours.cli_and_french)} h` },
      { dim: true, text: `Integration Boss:  ${fmtHours(hours.integration_boss)} h` },
    ],
    [hours],
  );

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-glass backdrop-blur-md">
            <Terminal className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Ligne de commande</h2>
            <p className="text-sm text-muted-foreground">
              Un aperçu du workflow CLI, avec vos vraies heures étudiées.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-glass-border bg-glass backdrop-blur-md">
          {/* Titlebar */}
          <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">
                progress-tracker — terminal
              </span>
            </div>
            <span className="text-xs text-muted-foreground">UTF-8</span>
          </div>

          {/* Terminal body */}
          <div className="bg-[#05070d] px-4 py-4">
            <pre
              className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-slate-100"
              role="region"
              aria-label="Sortie du terminal"
            >
              {lines.map((l, i) => (
                <React.Fragment key={i}>
                  <span className={l.dim ? "text-slate-300/80" : "text-slate-100"}>
                    {l.text}
                  </span>
                  {"\n"}
                </React.Fragment>
              ))}
              <span className="inline-block h-4 w-2 translate-y-0.5 bg-slate-100/80 align-middle" aria-hidden="true" />
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

