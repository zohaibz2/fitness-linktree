import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CopyLinkButton } from "./copy-link-button";

export const dynamic = "force-dynamic";

// TODO(rls): once trainer auth lands, filter by .eq("trainer_id", session.user.id)
// and add an RLS policy so trainers can only see their own plans.

type PlanRow = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  share_code: string;
  created_at: string;
  clients: { name: string | null } | null;
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

function formatCreated(iso: string): string {
  const created = new Date(iso);
  const diffMs = Date.now() - created.getTime();
  const day = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor(diffMs / day);

  if (diffDays <= 30) {
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
      if (diffHours === 0) {
        const diffMin = Math.max(1, Math.floor(diffMs / (60 * 1000)));
        return rtf.format(-diffMin, "minute");
      }
      return rtf.format(-diffHours, "hour");
    }
    return rtf.format(-diffDays, "day");
  }
  return created.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function PlansListPage() {
  const { data, error } = await supabase
    .from("plans")
    .select("id, name, start_date, end_date, share_code, created_at, clients(name)")
    .order("created_at", { ascending: false });

  const plans = (data as unknown as PlanRow[]) ?? [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Your plans</h1>
            <p className="text-sm text-zinc-600">
              All plans you&apos;ve created, newest first.
            </p>
          </div>
          <Link
            href="/dashboard/plans/new"
            className="rounded bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Create new plan
          </Link>
        </header>

        {error && (
          <p className="mb-6 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            Failed to load plans: {error.message}
          </p>
        )}

        {plans.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
            <p className="text-sm text-zinc-600">No plans yet.</p>
            <Link
              href="/dashboard/plans/new"
              className="mt-4 inline-block rounded bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              Create your first plan
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {plans.map((p) => (
              <li
                key={p.id}
                className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-zinc-900">
                      {p.name}
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-600">
                      Client: {p.clients?.name ?? "—"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                      <span>{formatRange(p.start_date, p.end_date)}</span>
                      <span>Created {formatCreated(p.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <CopyLinkButton shareCode={p.share_code} baseUrl={baseUrl} />
                    <a
                      href={`/plan/${p.share_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800"
                    >
                      View
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
