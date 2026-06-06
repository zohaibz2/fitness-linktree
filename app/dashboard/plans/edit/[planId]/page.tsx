import { notFound } from "next/navigation";
import { randomUUID } from "node:crypto";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireTrainer } from "@/lib/auth";
import type { ExerciseWithCategory } from "@/lib/database.types";
import {
  PlanBuilder,
  type DayKey,
  type DaysState,
  type PlacedExercise,
  type InitialPlanData,
} from "../../new/plan-builder";

export const dynamic = "force-dynamic";

// Shape of the nested plan fetch. Supabase returns to-one embeds as objects.
type FetchedExercise = {
  name: string | null;
  categories: { name: string | null } | null;
};
type FetchedPlanExercise = {
  day_of_week: number;
  order_in_day: number;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
  exercise_id: string;
  exercises: FetchedExercise | null;
};
type FetchedPlan = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  clients: { name: string | null } | null;
  plan_exercises: FetchedPlanExercise[];
};

function emptyDays(): DaysState {
  return { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
}

function toInitialData(plan: FetchedPlan): InitialPlanData {
  const days = emptyDays();

  // Sort by order_in_day so positional re-derivation on save round-trips.
  const sorted = [...plan.plan_exercises].sort(
    (a, b) => a.order_in_day - b.order_in_day
  );

  for (const pe of sorted) {
    if (pe.day_of_week < 1 || pe.day_of_week > 7) continue;
    const card: PlacedExercise = {
      instanceId: randomUUID(),
      exerciseId: pe.exercise_id,
      name: pe.exercises?.name ?? "(deleted exercise)",
      category: pe.exercises?.categories?.name ?? "Uncategorized",
      sets: pe.sets,
      reps: pe.reps,
      weight: pe.weight == null ? "" : String(pe.weight),
      notes: pe.notes ?? "",
    };
    days[pe.day_of_week as DayKey].push(card);
  }

  return {
    planId: plan.id,
    clientName: plan.clients?.name ?? "",
    planName: plan.name,
    startDate: plan.start_date,
    endDate: plan.end_date,
    days,
  };
}

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;

  await requireTrainer();
  const sb = await createServerSupabase();

  // Library for the sidebar (same query as the New Plan page).
  const { data: exerciseData } = await sb
    .from("exercises")
    .select("id, name, category_id, categories(name)")
    .order("name");
  const exercises = (exerciseData ?? []) as unknown as ExerciseWithCategory[];

  // The plan itself. RLS (trainer_manages_own_plans) scopes this to the owner,
  // so a non-owner or bad id yields no row → notFound().
  const { data: planData } = await sb
    .from("plans")
    .select(
      `
      id, name, start_date, end_date,
      clients(name),
      plan_exercises(
        day_of_week, order_in_day, sets, reps, weight, notes, exercise_id,
        exercises(name, categories(name))
      )
    `
    )
    .eq("id", planId)
    .single();

  if (!planData) notFound();

  const initialData = toInitialData(planData as unknown as FetchedPlan);

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Edit Plan</h1>
          <p className="text-sm text-zinc-600">
            Rearrange exercises and update the plan details, then save changes.
          </p>
        </header>

        <PlanBuilder exercises={exercises} initialData={initialData} />
      </div>
    </div>
  );
}
