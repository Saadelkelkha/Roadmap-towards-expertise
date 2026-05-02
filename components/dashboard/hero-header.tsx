"use client";

import { Code2, Database, Terminal } from "lucide-react";

export function HeroHeader() {
  return (
    <header className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 via-transparent to-blue/5" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="relative px-6 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-1.5 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              Programme Actif
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 text-balance font-sans text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-emerald via-emerald/80 to-blue bg-clip-text text-transparent">
              Roadmap
            </span>{" "}
            vers l&apos;Expertise
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Maîtrisez les fondamentaux de la programmation système en C, 
            l&apos;architecture Java avec Spring Boot et les concepts réseaux avancés.
          </p>

          {/* Tech Stack Icons */}
          <div className="flex items-center justify-center gap-6">
            <div className="group flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-glass-border bg-glass backdrop-blur-md transition-all duration-300 group-hover:border-emerald/50 group-hover:bg-emerald/10">
                <Code2 className="h-6 w-6 text-emerald" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Langage C</span>
            </div>
            
            <div className="group flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-glass-border bg-glass backdrop-blur-md transition-all duration-300 group-hover:border-blue/50 group-hover:bg-blue/10">
                <Database className="h-6 w-6 text-blue" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Java / Spring</span>
            </div>
            
            <div className="group flex flex-col items-center gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-glass-border bg-glass backdrop-blur-md transition-all duration-300 group-hover:border-emerald/50 group-hover:bg-emerald/10">
                <Terminal className="h-6 w-6 text-emerald" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">Systèmes</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
