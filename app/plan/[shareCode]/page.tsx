import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { PlanShareView, PlanShareExercise } from "@/lib/database.types";
import { PlanDateBanner, DaySection } from "./plan-today";
import { CheckInButton } from "./check-in-modal";

const DAYS: { key: number; label: string }[] = [
  { key: 1, label: "Monday" },
  { key: 2, label: "Tuesday" },
  { key: 3, label: "Wednesday" },
  { key: 4, label: "Thursday" },
  { key: 5, label: "Friday" },
  { key: 6, label: "Saturday" },
  { key: 7, label: "Sunday" },
];

// Anon visitors can't read the tables directly (RLS); the SECURITY DEFINER
// RPC is the only sanctioned public read path. It returns the plan + nested
// exercises already sorted by day_of_week, order_in_day — or null if the
// share_code matches nothing.
async function loadPlan(shareCode: string): Promise<PlanShareView | null> {
  const { data } = await supabase.rpc("get_plan_by_share_code", {
    code: shareCode,
  });
  return (data as PlanShareView | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}): Promise<Metadata> {
  const { shareCode } = await params;
  const plan = await loadPlan(shareCode);
  if (!plan) return { title: "Plan not found" };
  return { title: `${plan.name} — Workout Plan` };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PublicPlanPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;
  const plan = await loadPlan(shareCode);
  if (!plan) notFound();

  // Group the pre-sorted exercises by day; insertion order preserves the
  // RPC's order_in_day sort within each day.
  const byDay = new Map<number, PlanShareExercise[]>();
  for (const pe of plan.exercises ?? []) {
    const list = byDay.get(pe.day_of_week);
    if (list) list.push(pe);
    else byDay.set(pe.day_of_week, [pe]);
  }

  const clientName = plan.client_name ?? "Client";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-xl px-5 py-8">
        <header className="mb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-emerald-600">
            {clientName}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">
            {plan.name}
          </h1>
          {(plan.start_date || plan.end_date) && (
            <p className="mt-2 text-sm text-zinc-500">
              {plan.start_date && formatDate(plan.start_date)}
              {plan.start_date && plan.end_date && " — "}
              {plan.end_date && formatDate(plan.end_date)}
            </p>
          )}
        </header>

        <PlanDateBanner
          startDate={plan.start_date}
          endDate={plan.end_date}
        />

        <div className="flex flex-col gap-4">
          {DAYS.map(({ key, label }) => {
            const items = byDay.get(key) ?? [];
            return (
              <DaySection
                key={key}
                dayOfWeek={key}
                label={label}
                startDate={plan.start_date}
                endDate={plan.end_date}
              >
                {items.length === 0 ? (
                  <p className="text-sm italic text-zinc-400">Rest day</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {items.map((pe, idx) => (
                      <ExerciseCard key={idx} pe={pe} shareCode={plan.share_code} />
                    ))}
                  </div>
                )}
              </DaySection>
            );
          })}
        </div>

        <footer className="mt-10 text-center text-xs text-zinc-600">
          Powered by FitTree
        </footer>
      </div>
    </div>
  );
}

function ExerciseCard({
  pe,
  shareCode,
}: {
  pe: PlanShareExercise;
  shareCode: string;
}) {
  if (!pe.exercise_name) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs italic text-amber-700">
        Exercise no longer available
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-zinc-900">
          {pe.exercise_name}
        </h3>
        {pe.video_url && (
          <a
            href={pe.video_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${pe.exercise_name} demo`}
            className="shrink-0 rounded-full bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-100"
          >
            <PlayIcon />
          </a>
        )}
      </div>

      {pe.category_name && (
        <span className="mt-2 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
          {pe.category_name}
        </span>
      )}

      <div className="mt-3 flex items-baseline gap-3 text-sm">
        <span className="font-semibold text-zinc-900">
          {pe.sets} <span className="text-zinc-400">×</span> {pe.reps}
        </span>
        {pe.weight != null && (
          <span className="text-emerald-600">{pe.weight} kg</span>
        )}
      </div>

      {pe.notes && (
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">{pe.notes}</p>
      )}

      {pe.id && (
        <CheckInButton
          shareCode={shareCode}
          planExerciseId={pe.id}
          exerciseName={pe.exercise_name}
        />
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
