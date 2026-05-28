import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type PlanRow = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  share_code: string;
};

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRange(start: string | null, end: string | null): string {
  if (start && end) return `${formatDate(start)} – ${formatDate(end)}`;
  if (start) return `From ${formatDate(start)}`;
  if (end) return `Until ${formatDate(end)}`;
  return "No dates";
}

export default async function ClientDashboardPage() {
  const sb = await createServerSupabase();
  const { data, error } = await sb
    .from("plans")
    .select("id, name, start_date, end_date, share_code")
    .order("created_at", { ascending: false });

  const plans = (data as PlanRow[] | null) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">My plans</h1>
        <p className="text-sm text-zinc-600">
          Plans your trainer has shared with you.
        </p>
      </header>

      {error && (
        <p className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          Failed to load plans: {error.message}
        </p>
      )}

      {plans.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-sm text-zinc-600">
            No plans yet. Your trainer will share a link with you.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {plans.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h2 className="text-base font-semibold text-zinc-900">{p.name}</h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {formatRange(p.start_date, p.end_date)}
                </p>
              </div>
              <Link
                href={`/plan/${p.share_code}`}
                className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
