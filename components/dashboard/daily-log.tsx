"use client";

import * as React from "react";
import { NotebookPen, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProgressDto = {
  version: 1;
  updatedAt: string;
  hoursStudied: Record<string, number>;
  dailyNotes?: Record<string, string>;
};

function todayKey() {
  // YYYY-MM-DD in local time
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function DailyLogCard() {
  const key = todayKey();
  const [text, setText] = React.useState("");
  const [storedText, setStoredText] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("Impossible de charger le journal.");
        const data = (await res.json()) as ProgressDto;
        if (cancelled) return;
        const fromJson = data.dailyNotes?.[key] ?? "";
        setText(fromJson);
        setStoredText(fromJson);
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
  }, [key]);

  async function onSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyNotes: { [key]: text } }),
      });
      if (!res.ok) throw new Error("Enregistrement impossible.");
      const data = (await res.json()) as ProgressDto;
      const fromJson = data.dailyNotes?.[key] ?? text;
      setStoredText(fromJson);
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
            <NotebookPen className="h-5 w-5 text-emerald" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Journal du jour</h2>
            <p className="text-sm text-muted-foreground">
              Notez ce que vous avez fait aujourd&apos;hui (technique, apprentissage, blocages, décisions).
            </p>
          </div>
          <Button onClick={onSave} disabled={disabled} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>

        <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-md md:p-8">
          <div className="space-y-2">
            <Label htmlFor="daily-log">
              Aujourd&apos;hui ({new Date().toLocaleDateString("fr-FR")})
            </Label>
            <Textarea
              id="daily-log"
              disabled={disabled}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ex. Implémenté le suivi des heures, corrigé un bug de route API, revu la gestion de la mémoire en C..."
              aria-describedby="daily-log-help"
              className="min-h-40"
            />
            <p id="daily-log-help" className="text-xs text-muted-foreground">
              Stocké localement dans `data/progress.json` (clé: {key}).
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-border/60 bg-background/30 p-4">
            <p className="text-xs font-medium text-muted-foreground">Texte enregistré (JSON)</p>
            <p className="mt-2 whitespace-pre-wrap break-words font-mono text-xs text-foreground">
              {storedText ? storedText : "—"}
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              Conseil: notez aussi les erreurs rencontrées et la solution, ça accélère la progression.
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

