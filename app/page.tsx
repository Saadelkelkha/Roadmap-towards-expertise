import { HeroHeader } from "@/components/dashboard/hero-header";
import { MasterSchedule } from "@/components/dashboard/master-schedule";
import { SkillProgress } from "@/components/dashboard/skill-progress";
import { HoursStudiedCard } from "@/components/dashboard/hours-studied";
import { DailyLogCard } from "@/components/dashboard/daily-log";
import { DailyLogHistoryCard } from "@/components/dashboard/daily-log-history";
import { TerminalWindow } from "@/components/dashboard/terminal-window";
import { ProjectIntegration } from "@/components/dashboard/project-integration";

export default function DeveloperDashboard() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Header */}
      <HeroHeader />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Master Schedule */}
      <MasterSchedule />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Skill Progress */}
      <SkillProgress />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Hours studied */}
      <HoursStudiedCard />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Daily log */}
      <DailyLogCard />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Daily log history + filters */}
      <DailyLogHistoryCard />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Command Line */}
      <TerminalWindow />

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Project Integration */}
      <ProjectIntegration />

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 Roadmap vers l&apos;Expertise. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                Documentation
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                Support
              </span>
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                Paramètres
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
