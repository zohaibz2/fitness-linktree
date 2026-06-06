"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireTrainer } from "@/lib/auth";
import type { PlacedExerciseInput } from "./new/actions";

export type UpdatePlanInput = {
  planId: string;
  planName: string;
  startDate: string | null;
  endDate: string | null;
  days: Record<string, PlacedExerciseInput[]>; // keys "1".."7"
};

export type UpdatePlanResult = { error: string };

export async function updatePlan(
  input: UpdatePlanInput
): Promise<UpdatePlanResult> {
  const planName = input.planName.trim();
  if (!planName) return { error: "Plan name is required." };

  // Auth gate: redirects to login if not an authenticated trainer.
  await requireTrainer();
  const sb = await createServerSupabase();

  // Flatten the per-day builder state into the flat rows the RPC expects,
  // deriving day_of_week and order_in_day from position (same convention as
  // savePlan in ./new/actions.ts).
  const exercises: Array<{
    exercise_id: string;
    day_of_week: number;
    order_in_day: number;
    sets: number;
    reps: number;
    weight: number | null;
    notes: string | null;
  }> = [];

  for (let day = 1; day <= 7; day++) {
    const placed = input.days[String(day)] ?? [];
    placed.forEach((ex, idx) => {
      exercises.push({
        exercise_id: ex.exerciseId,
        day_of_week: day,
        order_in_day: idx,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        notes: ex.notes,
      });
    });
  }

  // Single atomic transaction: update plan + replace its exercises.
  const { error } = await sb.rpc("update_plan_with_exercises", {
    p_plan_id: input.planId,
    p_name: planName,
    p_start_date: input.startDate,
    p_end_date: input.endDate,
    p_exercises: exercises,
  });

  if (error) {
    if (error.message.includes("plan_not_found_or_forbidden")) {
      return { error: "Plan not found, or you don't have access to it." };
    }
    return { error: `Failed to update plan: ${error.message}` };
  }

  redirect("/dashboard/plans");
}

export type CoachFeedbackResult = { error?: string; ok?: boolean };

export async function updateCoachFeedback(
  logId: string,
  feedback: string
): Promise<CoachFeedbackResult> {
  await requireTrainer();
  const sb = await createServerSupabase();

  // RLS (trainer_updates_feedback_for_their_plans) ensures the trainer can only
  // update logs tied to plans they own.
  const { error } = await sb
    .from("progress_logs")
    .update({ coach_feedback: feedback.trim() || null })
    .eq("id", logId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/plans");
  return { ok: true };
}
