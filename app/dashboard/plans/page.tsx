import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase-server";
import { requireTrainer } from "@/lib/auth";
import { CopyLinkButton } from "./copy-link-button";
import { CoachFeedbackForm } from "./coach-feedback-form";

export const dynamic = "force-dynamic";

const UPLOADS_BUCKET = "client-uploads";

type PlanRow = {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
  share_code: string;
  created_at: string;
  clients: { name: string | null } | null;
};

type CheckInRow = {
  id: string;
  client_name: string | null;
  exercise_name: string | null;
  actual_sets: number | null;
  actual_reps: number | null;
  actual_weight: number | null;
  notes: string | null;
  media_url: string | null;
  coach_feedback: string | null;
  created_at: string;
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
  const trainer = await requireTrainer();
  const sb = await createServerSupabase();
  const { data, error } = await sb
    .from("plans")
    .select("id, name, start_date, end_date, share_code, created_at, clients(name)")
    .eq("trainer_id", trainer.id)
    .order("created_at", { ascending: false });

  const plans = (data as unknown as PlanRow[]) ?? [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? null;

  // Recent check-ins via SECURITY DEFINER RPC (assembles client + exercise
  // names across tables; filters to this trainer's plans internally).
  const { data: checkInData } = await sb.rpc("get_recent_check_ins");
  const checkIns = (checkInData as unknown as CheckInRow[]) ?? [];

  // Private bucket → resolve short-lived signed URLs for any photos.
  const signedUrls = new Map<string, string>();
  const withPhotos = checkIns.filter((c) => c.media_url);
  if (withPhotos.length > 0) {
    const results = await Promise.all(
      withPhotos.map((c) =>
        sb.storage.from(UPLOADS_BUCKET).createSignedUrl(c.media_url!, 3600)
      )
    );
    withPhotos.forEach((c, i) => {
      const url = results[i].data?.signedUrl;
      if (url) signedUrls.set(c.id, url);
    });
  }

  return (
    <div>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <RecentCheckIns checkIns={checkIns} signedUrls={signedUrls} />

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
                    <Link
                      href={`/dashboard/plans/edit/${p.id}`}
                      className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                    >
                      Edit
                    </Link>
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

function RecentCheckIns({
  checkIns,
  signedUrls,
}: {
  checkIns: CheckInRow[];
  signedUrls: Map<string, string>;
}) {
  if (checkIns.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-3 text-lg font-bold text-zinc-900">Recent check-ins</h2>
      <ul className="space-y-3">
        {checkIns.map((c) => {
          const photo = signedUrls.get(c.id);
          const exerciseName = c.exercise_name ?? "(exercise removed)";
          const stats = [
            c.actual_weight != null ? `${c.actual_weight} kg` : null,
            c.actual_sets != null && c.actual_reps != null
              ? `${c.actual_sets} × ${c.actual_reps}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ");

          return (
            <li
              key={c.id}
              className="flex gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt="Progress photo"
                  className="h-16 w-16 shrink-0 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-[10px] uppercase tracking-wide text-zinc-400">
                  No photo
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="text-sm font-semibold text-zinc-900">
                    {c.client_name ?? "Client"}
                    <span className="font-normal text-zinc-500">
                      {" "}
                      · {exerciseName}
                    </span>
                  </p>
                  <span className="text-xs text-zinc-400">
                    {formatCreated(c.created_at)}
                  </span>
                </div>
                {stats && (
                  <p className="mt-0.5 text-sm text-zinc-700">{stats}</p>
                )}
                {c.notes && (
                  <p className="mt-0.5 text-xs text-zinc-500">{c.notes}</p>
                )}
                <CoachFeedbackForm logId={c.id} initial={c.coach_feedback} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
