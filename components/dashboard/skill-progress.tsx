"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

type Task = { id: string; label: string; done: boolean };

type ProgressDto = {
  version: 1;
  updatedAt: string;
  hoursStudied: Record<string, number>;
  dailyNotes?: Record<string, string>;
  skillTasks?: Record<string, Task[]>;
};

type DomainKey =
  | "c_programming"
  | "data_structures_trees"
  | "java_enterprise"
  | "networking"
  | "math_stats"
  | "cli_and_french"
  | "integration_boss";

const domainMeta: Record<
  DomainKey,
  { title: string; category: string; ring: string; accent: string }
> = {
  c_programming: {
    title: "C",
    category: "Systems & mémoire",
    ring: "stroke-emerald",
    accent: "text-emerald",
  },
  data_structures_trees: {
    title: "Structures de données",
    category: "Arbres & logique algorithmique",
    ring: "stroke-blue",
    accent: "text-blue",
  },
  java_enterprise: {
    title: "Java",
    category: "POO & enterprise",
    ring: "stroke-emerald",
    accent: "text-emerald",
  },
  networking: {
    title: "Réseau",
    category: "Networking",
    ring: "stroke-blue",
    accent: "text-blue",
  },
  math_stats: {
    title: "Math & Statistiques",
    category: "Logique & données",
    ring: "stroke-amber-400",
    accent: "text-amber-400",
  },
  cli_and_french: {
    title: "CLI & Français",
    category: "Habitudes & langue",
    ring: "stroke-emerald",
    accent: "text-emerald",
  },
  integration_boss: {
    title: "Integration Boss",
    category: "Projet final",
    ring: "stroke-blue",
    accent: "text-blue",
  },
};

function calcPercent(tasks: Task[]) {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.done).length;
  return Math.round((done / tasks.length) * 100);
}

function CircularProgress({
  progress,
  color,
  size = 120,
}: {
  progress: number;
  color: string;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="rotate-[-90deg]"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-secondary"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={`${color} transition-all duration-1000 ease-out`}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{progress}%</span>
      </div>
    </div>
  );
}

export function SkillProgress() {
  const [loading, setLoading] = React.useState(true);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [tasks, setTasks] = React.useState<Record<DomainKey, Task[]>>({
    c_programming: [],
    data_structures_trees: [],
    java_enterprise: [],
    networking: [],
    math_stats: [],
    cli_and_french: [],
    integration_boss: [],
  });

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("Impossible de charger les compétences.");
        const data = (await res.json()) as ProgressDto;
        if (cancelled) return;
        setTasks({
          c_programming: (data.skillTasks?.c_programming ?? []) as Task[],
          data_structures_trees: (data.skillTasks?.data_structures_trees ?? []) as Task[],
          java_enterprise: (data.skillTasks?.java_enterprise ?? []) as Task[],
          networking: (data.skillTasks?.networking ?? []) as Task[],
          math_stats: (data.skillTasks?.math_stats ?? []) as Task[],
          cli_and_french: (data.skillTasks?.cli_and_french ?? []) as Task[],
          integration_boss: (data.skillTasks?.integration_boss ?? []) as Task[],
        });
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Erreur inattendue.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function toggle(domain: DomainKey, id: string, nextDone: boolean) {
    setError(null);
    setSavingId(`${domain}:${id}`);

    // optimistic update
    const optimisticDomainTasks = tasks[domain].map((t) =>
      t.id === id ? { ...t, done: nextDone } : t,
    );
    setTasks((prev) => ({ ...prev, [domain]: optimisticDomainTasks }));

    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillTasks: { [domain]: optimisticDomainTasks } }),
      });
      if (!res.ok) throw new Error("Enregistrement impossible.");
    } catch (e) {
      // rollback by refetching (simple + safe)
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        const data = (await res.json()) as ProgressDto;
        setTasks({
          c_programming: (data.skillTasks?.c_programming ?? []) as Task[],
          data_structures_trees: (data.skillTasks?.data_structures_trees ?? []) as Task[],
          java_enterprise: (data.skillTasks?.java_enterprise ?? []) as Task[],
          networking: (data.skillTasks?.networking ?? []) as Task[],
          math_stats: (data.skillTasks?.math_stats ?? []) as Task[],
          cli_and_french: (data.skillTasks?.cli_and_french ?? []) as Task[],
          integration_boss: (data.skillTasks?.integration_boss ?? []) as Task[],
        });
      } catch {
        // ignore
      }
      setError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-glass backdrop-blur-md">
            <TrendingUp className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Progression des Compétences
            </h2>
            <p className="text-sm text-muted-foreground">
              Suivi par domaine avec checklist de tâches
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {(Object.keys(domainMeta) as DomainKey[]).map((domain) => {
            const meta = domainMeta[domain];
            const domainTasks = tasks[domain];
            const progress = calcPercent(domainTasks);
            const doneCount = domainTasks.filter((t) => t.done).length;
            const disabled = loading || domainTasks.length === 0;

            return (
              <div
                key={domain}
                className="rounded-xl border border-glass-border bg-glass p-6 backdrop-blur-md transition-all duration-300 hover:border-emerald/30 hover:bg-card"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <CircularProgress progress={progress} color={meta.ring} size={104} />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{meta.title}</h3>
                      <p className="text-sm text-muted-foreground">{meta.category}</p>
                      <p className={`mt-2 text-sm font-medium ${meta.accent}`}>
                        {disabled ? "—" : `${doneCount}/${domainTasks.length} tâches complétées`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {domainTasks.length === 0 ? (
                    <div className="rounded-lg border border-border/60 bg-background/30 px-4 py-4 text-sm text-muted-foreground">
                      {loading ? "Chargement..." : "Aucune tâche configurée pour ce domaine."}
                    </div>
                  ) : (
                    domainTasks.map((t) => {
                      const id = `task-${domain}-${t.id}`;
                      const busy = savingId === `${domain}:${t.id}`;
                      return (
                        <div key={t.id} className="flex items-start gap-3">
                          <Checkbox
                            id={id}
                            checked={t.done}
                            disabled={loading || busy}
                            onCheckedChange={(checked) =>
                              toggle(domain, t.id, checked === true)
                            }
                            aria-label={t.label}
                          />
                          <label
                            htmlFor={id}
                            className={`text-sm leading-5 text-foreground ${
                              t.done ? "line-through opacity-70" : ""
                            }`}
                          >
                            {t.label}
                          </label>
                        </div>
                      );
                    })
                  )}
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
                  >
                    {error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
