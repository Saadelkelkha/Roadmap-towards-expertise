"use client";

import { Calendar, Clock } from "lucide-react";

type SessionType = "Core" | "Foundation" | "Immersion";

interface StudySession {
  time: string;
  subject: string;
  type: SessionType;
  duration: string;
}

interface DaySchedule {
  day: string;
  dayShort: string;
  sessions: StudySession[];
}

const typeStyles: Record<SessionType, { bg: string; text: string; border: string }> = {
  Core: {
    bg: "bg-emerald/10",
    text: "text-emerald",
    border: "border-emerald/30",
  },
  Foundation: {
    bg: "bg-blue/10",
    text: "text-blue",
    border: "border-blue/30",
  },
  Immersion: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
};

const weekSchedule: DaySchedule[] = [
  {
    day: "Lundi",
    dayShort: "Lun",
    sessions: [
      { time: "08:00", subject: "Arbres binaires en C", type: "Core", duration: "2h" },
      { time: "14:00", subject: "Révision algorithmique", type: "Foundation", duration: "1h30" },
    ],
  },
  {
    day: "Mardi",
    dayShort: "Mar",
    sessions: [
      { time: "09:00", subject: "Spring Boot REST API", type: "Core", duration: "3h" },
      { time: "15:00", subject: "Français - Expression écrite", type: "Immersion", duration: "1h" },
    ],
  },
  {
    day: "Mercredi",
    dayShort: "Mer",
    sessions: [
      { time: "08:00", subject: "Modèle OSI - Couches", type: "Foundation", duration: "2h" },
      { time: "11:00", subject: "TP Réseaux pratique", type: "Immersion", duration: "2h" },
    ],
  },
  {
    day: "Jeudi",
    dayShort: "Jeu",
    sessions: [
      { time: "08:00", subject: "Gestion de la mémoire en C", type: "Core", duration: "2h30" },
      { time: "14:00", subject: "Design Patterns Java", type: "Foundation", duration: "2h" },
    ],
  },
  {
    day: "Vendredi",
    dayShort: "Ven",
    sessions: [
      { time: "09:00", subject: "Projet intégration", type: "Immersion", duration: "4h" },
      { time: "15:00", subject: "Code review", type: "Core", duration: "1h" },
    ],
  },
  {
    day: "Samedi",
    dayShort: "Sam",
    sessions: [
      { time: "10:00", subject: "Révisions hebdomadaires", type: "Foundation", duration: "3h" },
    ],
  },
  {
    day: "Dimanche",
    dayShort: "Dim",
    sessions: [
      { time: "10:00", subject: "Lecture technique", type: "Immersion", duration: "2h" },
      { time: "14:00", subject: "Préparation semaine", type: "Foundation", duration: "1h" },
    ],
  },
];

function SessionTag({ type }: { type: SessionType }) {
  const styles = typeStyles[type];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {type}
    </span>
  );
}

export function MasterSchedule() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-glass-border bg-glass backdrop-blur-md">
            <Calendar className="h-5 w-5 text-emerald" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Planning Hebdomadaire
            </h2>
            <p className="text-sm text-muted-foreground">
              Vue d&apos;ensemble de la semaine d&apos;étude
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6 flex flex-wrap gap-4">
          {(["Core", "Foundation", "Immersion"] as SessionType[]).map((type) => (
            <div key={type} className="flex items-center gap-2">
              <SessionTag type={type} />
              <span className="text-xs text-muted-foreground">
                {type === "Core" && "— Compétences essentielles"}
                {type === "Foundation" && "— Bases théoriques"}
                {type === "Immersion" && "— Pratique intensive"}
              </span>
            </div>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {weekSchedule.map((day) => (
            <div
              key={day.day}
              className="group rounded-xl border border-glass-border bg-glass p-4 backdrop-blur-md transition-all duration-300 hover:border-emerald/30 hover:bg-card"
            >
              {/* Day Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <span className="block text-lg font-semibold text-foreground">
                    {day.dayShort}
                  </span>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {day.sessions.length} session{day.sessions.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Sessions */}
              <div className="space-y-3">
                {day.sessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-border/50 bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {session.time}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {session.duration}
                      </span>
                    </div>
                    <p className="mb-2 text-sm font-medium text-foreground leading-tight">
                      {session.subject}
                    </p>
                    <SessionTag type={session.type} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
