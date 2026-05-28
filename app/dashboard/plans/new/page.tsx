import { createServerSupabase } from "@/lib/supabase-server";
import type { ExerciseWithCategory } from "@/lib/database.types";
import { PlanBuilder } from "./plan-builder";

export const dynamic = "force-dynamic";

export default async function NewPlanPage() {
  const sb = await createServerSupabase();
  const { data, error } = await sb
    .from("exercises")
    .select("id, name, category_id, categories(name)")
    .order("name");

  const exercises = (data ?? []) as unknown as ExerciseWithCategory[];

  return (
    <div>
      <div className="mx-auto max-w-[1400px] px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">New Plan</h1>
          <p className="text-sm text-zinc-600">
            Drag exercises from the library into days, then save.
          </p>
        </header>

        {error && (
          <p className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            Failed to load exercises: {error.message}
          </p>
        )}

        <PlanBuilder exercises={exercises} />
      </div>
    </div>
  );
}
