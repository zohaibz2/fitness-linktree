import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

// TODO(rls): When auth lands and RLS is enabled, replace this nested select with
// a security-definer RPC like `supabase.rpc("get_plan_by_share_code", { code })`
// that returns the joined plan as JSON. Otherwise clients/exercises/categories
// would all need permissive public SELECT policies, leaking more than intended.

type PlanExerciseRow = {
  day_of_week: number;
  order_in_day: number;
  sets: number;
  reps: number;
  weight: number | null;
  notes: string | null;
  exercises: {
    name: string;
    description: string | null;
    categories: { name: string } | null;
  } | null;
};

type PlanRow = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  share_code: string;
  clients: { name: string | null } | null;
  plan_exercises: PlanExerciseRow[];
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

async function loadPlan(shareCode: string): Promise<PlanRow | null> {
  const { data } = await supabase
    .from("plans")
    .select(
      `id, name, start_date, end_date, share_code,
       clients ( name ),
       plan_exercises (
         day_of_week, order_in_day, sets, reps, weight, notes,
         exercises ( name, description, categories ( name ) )
       )`
    )
    .eq("share_code", shareCode)
    .maybeSingle();
  return (data as unknown as PlanRow) ?? null;
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
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
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
  for (const pe of plan.plan_exercises ?? []) {
    if (!byDay.has(pe.day_of_week)) byDay.set(pe.day_of_week, []);
    byDay.get(pe.day_of_week)!.push(pe);
  }
  for (const list of byDay.values()) {
    list.sort((a, b) => a.order_in_day - b.order_in_day);
  }

  const clientName = plan.clients?.name ?? "client";
  const dateRange = formatRange(plan.start_date, plan.end_date);
  const totalExercises = plan.plan_exercises?.length ?? 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
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
  if (!pe.exercises) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-2 text-xs italic text-amber-700">
        Exercise no longer available
      </div>
    );
  }
  const category = pe.exercises.categories?.name ?? "Uncategorized";
  return (
    <div className="rounded border border-zinc-200 bg-white p-2 shadow-sm">
      <div className="text-sm font-semibold text-zinc-900">
        {pe.exercises.name}
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
      {pe.notes && (
        <p className="mt-1 text-xs text-zinc-600">{pe.notes}</p>
      )}
    </div>
  );
}
