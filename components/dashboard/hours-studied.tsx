"use client";

import * as React from "react";
import { BookOpen, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HoursStudied = Record<string, number>;

type HoursKey =
  | "c_programming"
  | "data_structures_trees"
  | "java_enterprise"
  | "networking"
  | "math_stats"
  | "cli_and_french"
  | "integration_boss";

const hoursFields: Array<{ key: HoursKey; label: string }> = [
  { key: "c_programming", label: "C Programming (Systems & Memory)" },
  { key: "data_structures_trees", label: "Data Structures & Arbres" },
  { key: "java_enterprise", label: "Java (OOP & Enterprise)" },
  { key: "networking", label: "Réseau (Networking)" },
  { key: "math_stats", label: "Math & Statistique" },
  { key: "cli_and_french", label: "Command Line (CLI) & French" },
  { key: "integration_boss", label: "Integration Boss (final project)" },
];

type ProgressDto = {
  version: 1;
  updatedAt: string;
  hoursStudied: HoursStudied;
  dailyNotes?: Record<string, string>;
};

function clampHours(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value * 10) / 10);
}

function parseHoursFromInput(value: string) {
  const normalized = value.replace(",", ".");
  const num = Number(normalized);
  return clampHours(num);
}

export function HoursStudiedCard() {
  const [hours, setHours] = React.useState<HoursStudied>({
    c_programming: 0,
    data_structures_trees: 0,
    java_enterprise: 0,
    networking: 0,
    math_stats: 0,
    cli_and_french: 0,
    integration_boss: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("Impossible de charger les données.");
        const data = (await res.json()) as ProgressDto;
        if (cancelled) return;
        const next: HoursStudied = { ...hours };
        for (const f of hoursFields) {
          next[f.key] = clampHours(Number(data.hoursStudied?.[f.key] ?? 0));
        }
        setHours(next);
        setSavedAt(data.updatedAt);
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

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hoursStudied: hours }),
      });
      if (!res.ok) throw new Error("Enregistrement impossible.");
      const data = (await res.json()) as ProgressDto;
      setSavedAt(data.updatedAt);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setSaving(false);
    }
  }

  const disabled = loading || saving;

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-glass backdrop-blur-md">
            <BookOpen className="h-5 w-5 text-emerald" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Heures étudiées</h2>
            <p className="text-sm text-muted-foreground">
              Mettez à jour facilement votre temps d&apos;étude (stockage local JSON).
            </p>
          </div>
          <Button onClick={onSave} disabled={disabled} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>

        <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-md md:p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hoursFields.map((f) => {
              const id = `hours-${f.key}`;
              return (
                <div key={f.key} className="space-y-2">
                  <Label htmlFor={id}>{f.label}</Label>
                  <Input
                    id={id}
                    inputMode="decimal"
                    disabled={disabled}
                    value={String(hours[f.key] ?? 0)}
                    onChange={(e) =>
                      setHours((h) => ({ ...h, [f.key]: parseHoursFromInput(e.target.value) }))
                    }
                    aria-describedby="hours-help"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p id="hours-help" className="text-xs text-muted-foreground">
              Astuce: vous pouvez saisir des décimales (ex. 1,5) — elles seront normalisées.
            </p>
            <p className="text-xs text-muted-foreground">
              {savedAt ? `Dernière mise à jour: ${new Date(savedAt).toLocaleString("fr-FR")}` : "—"}
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
        </div>
      </div>
    </section>
  );
}

