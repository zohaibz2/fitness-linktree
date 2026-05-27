import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { CopyButton } from "./copy-button";

export const dynamic = "force-dynamic";

export default async function PlanConfirmationPage({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const { shareCode } = await params;

  const { data: plan } = await supabase
    .from("plans")
    .select("id, name, share_code, clients(name)")
    .eq("share_code", shareCode)
    .single();

  if (!plan) notFound();

  const h = await headers();
  const host = h.get("host") ?? "yoursite.com";
  const proto = h.get("x-forwarded-proto") ?? "https";
  const shareUrl = `${proto}://${host}/plan/${plan.share_code}`;

  const clientName =
    (plan as unknown as { clients: { name: string | null } | null }).clients?.name ??
    "client";

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">Plan saved.</h1>
          <p className="mt-1 text-sm text-zinc-600">
            <span className="font-medium">{plan.name}</span> for {clientName}.
          </p>

          <div className="mt-6">
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Share link
            </label>
            <div className="mt-1 flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 rounded border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm"
              />
              <CopyButton value={shareUrl} />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href="/dashboard/plans/new"
              className="rounded border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Create another
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
