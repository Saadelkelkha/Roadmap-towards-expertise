"use client";

import * as React from "react";
import { Box, CheckCircle2, GitBranch, ListChecks } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

type Step = { id: string; label: string; done: boolean };

type ProgressDto = {
  version: 1;
  updatedAt: string;
  projectSteps?: Record<string, Step[]>;
  skillTasks?: Record<string, { id: string; label: string; done: boolean }[]>;
};

const projects: Array<{
  key: string;
  title: string;
  subtitle: string;
  from: "steps";
}> = [
  {
    key: "bank_management_system",
    title: "Bank Management System",
    subtitle: "Console • tableaux • dépôts/retraits",
    from: "steps",
  },
  {
    key: "custom_shell",
    title: "Custom Shell",
    subtitle: "fork() / exec() • built-ins • PATH",
    from: "steps",
  },
  {
    key: "binary_file_explorer",
    title: "Binary File Explorer",
    subtitle: "Hex/ASCII • style xxd • I/O fichiers",
    from: "steps",
  },
  {
    key: "undo_redo_system",
    title: "Undo/Redo System",
    subtitle: "Liste doublement chaînée • états",
    from: "steps",
  },
  {
    key: "contact_search_engine",
    title: "Contact Search Engine",
    subtitle: "Trie/BST • 5 000 contacts • recherche prefix",
    from: "steps",
  },
  {
    key: "visualizer_cli",
    title: "Visualizer (CLI)",
    subtitle: "Merge Sort / parcours d’arbre • animation CLI",
    from: "steps",
  },
  {
    key: "university_management",
    title: "University Management",
    subtitle: "Rôles • polymorphisme • permissions",
    from: "steps",
  },
  {
    key: "ecommerce_inventory",
    title: "E‑Commerce Inventory",
    subtitle: "Maps/Streams • filtres • stock",
    from: "steps",
  },
  {
    key: "restful_portfolio_api",
    title: "RESTful Portfolio API",
    subtitle: "Spring Boot • JWT • roadmap JSON",
    from: "steps",
  },
  {
    key: "ping_tool",
    title: "Ping Tool",
    subtitle: "ICMP • RTT • pertes",
    from: "steps",
  },
  {
    key: "chat_server",
    title: "Multi‑Client Chat Server",
    subtitle: "Sockets • threads • room globale",
    from: "steps",
  },
  {
    key: "packet_sniffer",
    title: "Packet Sniffer",
    subtitle: "pcap • parsing • stats HTTP/HTTPS",
    from: "steps",
  },
  {
    key: "image_filter_logic",
    title: "Image Filter Logic",
    subtitle: "Matrices • filtre luminosité",
    from: "steps",
  },
  {
    key: "matrix_calculator_cli",
    title: "Matrix Calculator CLI",
    subtitle: "3x3 • produit • déterminant",
    from: "steps",
  },
  {
    key: "grade_analyzer",
    title: "Grade Analyzer",
    subtitle: "Écart‑type • loi normale • rapport",
    from: "steps",
  },
  {
    key: "auto_backup",
    title: "Auto‑Backup",
    subtitle: "Script • zip • upload",
    from: "steps",
  },
  {
    key: "le_blog_tech",
    title: "Le Blog Tech",
    subtitle: "500 mots • français technique • pointeurs C",
    from: "steps",
  },
  {
    key: "integration_boss_project",
    title: "Integration Boss",
    subtitle: "C + matrices + Java + web + CLI",
    from: "steps",
  },
];

function percent(steps: Step[]) {
  if (!steps.length) return 0;
  const done = steps.filter((s) => s.done).length;
  return Math.round((done / steps.length) * 100);
}

export function ProjectIntegration() {
  const [loading, setLoading] = React.useState(true);
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [projectSteps, setProjectSteps] = React.useState<Record<string, Step[]>>({});

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("Impossible de charger les projets.");
        const data = (await res.json()) as ProgressDto;
        if (cancelled) return;
        setProjectSteps(data.projectSteps ?? {});
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

  async function toggleStep(projectKey: string, stepId: string, nextDone: boolean) {
    setError(null);
    setSavingId(`${projectKey}:${stepId}`);

    const current = projectSteps[projectKey] ?? [];
    const optimistic = current.map((s) => (s.id === stepId ? { ...s, done: nextDone } : s));
    setProjectSteps((prev) => ({ ...prev, [projectKey]: optimistic }));

    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSteps: { [projectKey]: optimistic } }),
      });
      if (!res.ok) throw new Error("Enregistrement impossible.");
    } catch (e) {
      // rollback via refetch
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        const data = (await res.json()) as ProgressDto;
        setProjectSteps(data.projectSteps ?? {});
      } catch {
        // ignore
      }
      setError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setSavingId(null);
    }
  }

  const totals = React.useMemo(() => {
    const all = projects.flatMap((p) => projectSteps[p.key] ?? []);
    const done = all.filter((s) => s.done).length;
    return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 };
  }, [projectSteps]);

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-glass backdrop-blur-md">
            <Box className="h-5 w-5 text-emerald" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Projet en Cours
            </h2>
            <p className="text-sm text-muted-foreground">
              Vos vrais projets (checklist + progression)
            </p>
          </div>
        </div>

        {/* Project Card */}
        <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-md md:p-8">
          {/* Project Title */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald/20 to-blue/20 backdrop-blur-md">
                <GitBranch className="h-6 w-6 text-emerald" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Roadmap Projects
                </h3>
                <p className="text-sm text-muted-foreground">
                  Étapes actionnables • sauvegarde locale JSON
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald/30 bg-emerald/10 px-3 py-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald" />
              <span className="text-sm font-medium text-emerald">
                {loading ? "Chargement..." : `${totals.pct}% complété`}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary/20 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ListChecks className="h-4 w-4 text-muted-foreground" />
                Projets & étapes
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "—" : `${totals.done}/${totals.total} étapes`}
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
              >
                {error}
              </div>
            )}

            <Accordion type="multiple" className="rounded-lg border border-border bg-background/20">
              {projects.map((p) => {
                const steps = projectSteps[p.key] ?? [];
                const pct = percent(steps);
                const done = steps.filter((s) => s.done).length;
                return (
                  <AccordionItem key={p.key} value={p.key} className="px-4">
                    <AccordionTrigger>
                      <div className="flex w-full items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{p.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.subtitle}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-xs font-medium text-emerald">{loading ? "—" : `${pct}%`}</p>
                          <p className="text-[11px] text-muted-foreground">{loading ? "—" : `${done}/${steps.length}`}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {steps.length === 0 ? (
                        <div className="rounded-lg border border-border/60 bg-background/30 px-4 py-4 text-sm text-muted-foreground">
                          {loading ? "Chargement..." : "Aucune étape configurée pour ce projet."}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {steps.map((s) => {
                            const id = `proj-${p.key}-${s.id}`;
                            const busy = savingId === `${p.key}:${s.id}`;
                            return (
                              <div key={s.id} className="flex items-start gap-3">
                                <Checkbox
                                  id={id}
                                  checked={s.done}
                                  disabled={loading || busy}
                                  onCheckedChange={(checked) => toggleStep(p.key, s.id, checked === true)}
                                  aria-label={s.label}
                                />
                                <label
                                  htmlFor={id}
                                  className={`text-sm leading-5 text-foreground ${s.done ? "line-through opacity-70" : ""}`}
                                >
                                  {s.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
