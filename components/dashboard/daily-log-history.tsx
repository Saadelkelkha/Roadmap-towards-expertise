"use client";

import * as React from "react";
import { Filter, History, RotateCcw } from "lucide-react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProgressDto = {
  version: 1;
  updatedAt: string;
  hoursStudied: { c: number; java: number; french: number };
  dailyNotes?: Record<string, string>;
};

type Entry = { date: string; text: string };

function isIsoDay(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function compareDateDesc(a: string, b: string) {
  // YYYY-MM-DD lexicographic order matches date order
  return b.localeCompare(a);
}

export function DailyLogHistoryCard() {
  const [entries, setEntries] = React.useState<Entry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // filters
  const [query, setQuery] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("Impossible de charger l’historique.");
        const data = (await res.json()) as ProgressDto;
        const dailyNotes = data.dailyNotes ?? {};

        const nextEntries = Object.entries(dailyNotes)
          .filter(([k, v]) => isIsoDay(k) && typeof v === "string" && v.trim().length > 0)
          .map(([date, text]) => ({ date, text }))
          .sort((a, b) => compareDateDesc(a.date, b.date));

        if (cancelled) return;
        setEntries(nextEntries);
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

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((e) => {
      if (from && e.date < from) return false;
      if (to && e.date > to) return false;
      if (q) {
        const hay = `${e.date}\n${e.text}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [entries, from, to, query]);

  function onReset() {
    setQuery("");
    setFrom("");
    setTo("");
  }

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-glass backdrop-blur-md">
            <History className="h-5 w-5 text-blue" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Historique du journal</h2>
            <p className="text-sm text-muted-foreground">
              Filtrez vos notes par date et recherchez dans le contenu.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-md md:p-8">
          <div className="grid gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-5">
              <Label htmlFor="log-search" className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                Recherche
              </Label>
              <Input
                id="log-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex. mémoire, Spring, bug, réseau..."
              />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="log-from">Du</Label>
              <Input id="log-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="log-to">Au</Label>
              <Input id="log-to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            <div className="md:col-span-1 md:flex md:justify-end">
              <Button variant="outline" size="icon" onClick={onReset} aria-label="Réinitialiser les filtres">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {loading ? "Chargement..." : `${filtered.length} note(s) affichée(s)`}
            </p>
            <p className="text-xs text-muted-foreground">
              Source: `data/progress.json` → `dailyNotes`
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground"
            >
              {error}
            </div>
          )}

          {!error && !loading && filtered.length === 0 && (
            <div className="mt-6 rounded-lg border border-border/60 bg-background/30 px-4 py-6 text-sm text-muted-foreground">
              Aucune note ne correspond à vos filtres.
            </div>
          )}

          {!error && filtered.length > 0 && (
            <Accordion type="multiple" className="mt-4">
              {filtered.map((e) => (
                <AccordionItem key={e.date} value={e.date}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between gap-4">
                      <span className="font-medium">{new Date(e.date).toLocaleDateString("fr-FR")}</span>
                      <span className="text-xs text-muted-foreground">{e.date}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="rounded-lg border border-border/60 bg-background/30 p-4">
                      <p className="whitespace-pre-wrap break-words font-mono text-xs text-foreground">
                        {e.text}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </section>
  );
}

