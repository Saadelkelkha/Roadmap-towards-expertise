import { NextResponse } from "next/server";
import { z } from "zod";

import { patchProgress, readProgress, writeProgress } from "@/lib/progress-storage";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const progress = await readProgress();
  return NextResponse.json(progress);
}

const UpdateProgressSchema = z.object({
  hoursStudied: z.record(z.number().nonnegative()),
  dailyNotes: z.record(z.string()).optional(),
  skillTasks: z.record(z.array(z.object({ id: z.string(), label: z.string(), done: z.boolean() }))).optional(),
  projectSteps: z
    .record(z.array(z.object({ id: z.string(), label: z.string(), done: z.boolean() })))
    .optional(),
});

export async function PUT(req: Request) {
  const json = await req.json();
  const input = UpdateProgressSchema.parse(json);

  const saved = await writeProgress({
    hoursStudied: input.hoursStudied,
    dailyNotes: input.dailyNotes ?? {},
    skillTasks: input.skillTasks ?? {},
    projectSteps: input.projectSteps ?? {},
  });

  return NextResponse.json(saved);
}

const PatchProgressSchema = z.object({
  hoursStudied: z.record(z.number().nonnegative()).optional(),
  dailyNotes: z.record(z.string()).optional(),
  skillTasks: z.record(z.array(z.object({ id: z.string(), label: z.string(), done: z.boolean() }))).optional(),
  projectSteps: z
    .record(z.array(z.object({ id: z.string(), label: z.string(), done: z.boolean() })))
    .optional(),
});

export async function PATCH(req: Request) {
  const json = await req.json();
  const input = PatchProgressSchema.parse(json);
  const saved = await patchProgress(input);
  return NextResponse.json(saved);
}

