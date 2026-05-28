"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireTrainer } from "@/lib/auth";

export type PlacedExerciseInput = {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
};

export type SavePlanInput = {
  clientName: string;
  planName: string;
  startDate: string | null;
  endDate: string | null;
  days: Record<string, PlacedExerciseInput[]>; // keys "1".."7"
};

export type SavePlanResult = { error: string };

export async function savePlan(input: SavePlanInput): Promise<SavePlanResult> {
  const clientName = input.clientName.trim();
  const planName = input.planName.trim();

  if (!clientName) return { error: "Client name is required." };
  if (!planName) return { error: "Plan name is required." };

  const trainer = await requireTrainer();
  const sb = await createServerSupabase();

  const { data: newClientId, error: clientErr } = await sb.rpc(
    "create_client_stub",
    { p_name: clientName }
  );

  if (clientErr || !newClientId) {
    return {
      error: `Failed to create client: ${clientErr?.message ?? "no id returned"}`,
    };
  }

  const { data: planRow, error: planErr } = await sb
    .from("plans")
    .insert({
      name: planName,
      client_id: newClientId,
      trainer_id: trainer.id,
      start_date: input.startDate || null,
      end_date: input.endDate || null,
    })
    .select("id, share_code")
    .single();

  if (planErr || !planRow) {
    return {
      error: `Failed to create plan: ${planErr?.message ?? "no row returned"}`,
    };
  }

  const rows: Array<{
    plan_id: string;
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
      rows.push({
        plan_id: planRow.id,
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

  if (rows.length > 0) {
    const { error: peErr } = await sb.from("plan_exercises").insert(rows);
    if (peErr) {
      return { error: `Failed to save exercises: ${peErr.message}` };
    }
  }

  redirect(`/dashboard/plans/${planRow.share_code}`);
}
