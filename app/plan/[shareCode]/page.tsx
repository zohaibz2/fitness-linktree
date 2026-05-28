import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { createServerSupabase } from "@/lib/supabase-server";

type PlanExerciseRow = {
  day_of_week: number;
  order_in_day: number;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
  exercise_name: string | null;
  category_name: string | null;
};

type PlanData = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  share_code: string;
  client_name: string | null;
  exercises: PlanExerciseRow[];
};

const DAYS: { key: number; label: string }[] = [
  { key: 1, label: "Monday" },
  { key: 2, label: "Tuesday" },
  { key: 3, label: "Wednesday" },
  { key: 4, label: "Thursday" },
  { key: 5, label: "Friday" },
  { key: 6, label: "Saturday" },
  { key: 7, label: "Sunday" },
];

async function loadPlan(shareCode: string): Promise<PlanData | null> {
  // Public read goes through SECURITY DEFINER RPC — the one trust boundary for
  // unauthenticated access. All other tables are RLS-locked.
  const { data } = await supabase.rpc("get_plan_by_share_code", {
    code: shareCode,
  });
  return (data as PlanData | null) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}): Promise<Metadata> {
  const { shareCode } = await params;
  const plan = await loadPlan(shareCode);
  if (!plan) return { title: "Plan not found" };
  return { title: `${plan.name} – Fitness Plan` };
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRange(start: string | null, end: string | null): string | null {
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  if (start) return `From ${formatDate(start)}`;
  if (end) return `Until ${formatDate(end)}`;
  return null;
}

export default async function PublicPlanPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;
  const plan = await loadPlan(shareCode);
  if (!plan) notFound();

  const byDay = new Map<number, PlanExerciseRow[]>();
  for (const pe of plan.exercises ?? []) {
    if (!byDay.has(pe.day_of_week)) byDay.set(pe.day_of_week, []);
    byDay.get(pe.day_of_week)!.push(pe);
  }

  const clientName = plan.client_name ?? "client";
  const dateRange = formatRange(plan.start_date, plan.end_date);
  const totalExercises = plan.exercises?.length ?? 0;

  const sb = await createServerSupabase();
  const { data: { user } } = await sb.auth.getUser();
  const showSignupBanner = !user;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {showSignupBanner && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              Want to track your progress on this plan?
            </p>
            <Link
              href={`/signup/client?plan=${encodeURIComponent(plan.share_code)}`}
              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Sign up
            </Link>
          </div>
        )}

        <header className="mb-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-zinc-900">{plan.name}</h1>
          <p className="mt-1 text-sm text-zinc-600">Plan for {clientName}</p>
          {dateRange && (
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
              {dateRange}
            </p>
          )}
        </header>

        {totalExercises === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-10 text-center">
            <p className="text-sm text-zinc-500">
              This plan has no exercises yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-7">
            {DAYS.map(({ key, label }) => {
              const items = byDay.get(key) ?? [];
              return (
                <section
                  key={key}
                  className="flex min-h-[200px] flex-col rounded-lg border border-zinc-200 bg-zinc-100/60 p-2"
                >
                  <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    {label}
                  </h2>
                  <div className="flex flex-1 flex-col gap-2">
                    {items.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded border border-dashed border-zinc-300 p-3 text-center text-xs text-zinc-400">
                        Rest day
                      </div>
                    ) : (
                      items.map((pe, idx) => <ExerciseCard key={idx} pe={pe} />)
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseCard({ pe }: { pe: PlanExerciseRow }) {
  if (!pe.exercise_name) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs italic text-amber-700">
        Exercise no longer available
      </div>
    );
  }
  const category = pe.category_name ?? "Uncategorized";
  return (
    <div className="rounded border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="text-sm font-semibold text-zinc-900">
        {pe.exercise_name}
      </div>
      <div className="mt-0.5 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-600">
        {category}
      </div>
      <div className="mt-2 text-sm text-zinc-800">
        <span className="font-medium">{pe.sets}</span> ×{" "}
        <span className="font-medium">{pe.reps}</span>
        {pe.weight != null && (
          <span className="ml-1 text-zinc-600">@ {pe.weight}</span>
        )}
      </div>
      {pe.notes && <p className="mt-1 text-xs text-zinc-600">{pe.notes}</p>}
    </div>
  );
}
