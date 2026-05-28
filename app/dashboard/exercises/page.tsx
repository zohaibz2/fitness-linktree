import { createServerSupabase } from "@/lib/supabase-server";
import type { Category, ExerciseWithCategory } from "@/lib/database.types";
import { NewExerciseForm } from "./new-exercise-form";

export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const sb = await createServerSupabase();
  const [categoriesRes, exercisesRes] = await Promise.all([
    sb.from("categories").select("*").order("name"),
    sb
      .from("exercises")
      .select("*, categories(name)")
      .order("created_at", { ascending: false }),
  ]);

  const categories = (categoriesRes.data ?? []) as Category[];
  const exercises = (exercisesRes.data ?? []) as ExerciseWithCategory[];
  const loadError = categoriesRes.error?.message ?? exercisesRes.error?.message;

  return (
    <div>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900">Exercise Library</h1>
          <p className="text-sm text-zinc-600">
            Build the pool of exercises you can drop into workout plans.
          </p>
        </header>

        {loadError && (
          <p className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            Failed to load data: {loadError}
          </p>
        )}

        <NewExerciseForm categories={categories} />

        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900">
            All exercises ({exercises.length})
          </h2>

          {exercises.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-center text-sm text-zinc-500">
              No exercises yet. Add your first one above.
            </p>
          ) : (
            <ul className="space-y-3">
              {exercises.map((ex) => (
                <li
                  key={ex.id}
                  className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-zinc-900">
                        {ex.name}
                      </h3>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {ex.categories?.name ?? "Uncategorized"}
                      </p>
                    </div>
                    {ex.video_url && (
                      <a
                        href={ex.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-sm text-blue-600 hover:underline"
                        aria-label={`Video for ${ex.name}`}
                      >
                        ▶ Video
                      </a>
                    )}
                  </div>
                  {ex.description && (
                    <p className="mt-2 text-sm text-zinc-700">{ex.description}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
