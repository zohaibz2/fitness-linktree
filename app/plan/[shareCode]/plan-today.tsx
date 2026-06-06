"use client";

import { useSyncExternalStore, type ReactNode } from "react";

// The "now"-dependent presentation lives here so it can use the viewer's
// local clock. Both server render and first client paint use a neutral
// baseline (mounted=false); once mounted, the value resolves against the
// visitor's own timezone rather than the server's UTC. useSyncExternalStore
// gives us a hydration-safe server/client split with no setState-in-effect.

const subscribe = () => () => {};
function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}

type RangeState = "before" | "during" | "after" | "unknown";

// JS getDay(): 0=Sun..6=Sat. Plan day_of_week: 1=Mon..7=Sun.
function localWeekday(d: Date): number {
  const js = d.getDay();
  return js === 0 ? 7 : js;
}

// Local calendar date as YYYY-MM-DD, for date-only comparison against the
// plan's start/end (which carry no time component).
function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function resolveRange(
  startDate: string | null,
  endDate: string | null
): { state: RangeState; weekday: number } {
  const now = new Date();
  const today = localDateString(now);
  let state: RangeState = "during";
  if (startDate && today < startDate) state = "before";
  else if (endDate && today > endDate) state = "after";
  return { state, weekday: localWeekday(now) };
}

function formatLongDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function PlanDateBanner({
  startDate,
  endDate,
}: {
  startDate: string | null;
  endDate: string | null;
}) {
  const mounted = useMounted();
  const state: RangeState = mounted
    ? resolveRange(startDate, endDate).state
    : "unknown";

  if (state === "before" && startDate) {
    return (
      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        This plan starts on{" "}
        <span className="font-semibold">{formatLongDate(startDate)}</span>.
      </div>
    );
  }

  if (state === "after" && endDate) {
    return (
      <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-500">
        This plan ended on{" "}
        <span className="font-semibold text-zinc-700">
          {formatLongDate(endDate)}
        </span>
        .
      </div>
    );
  }

  return null;
}

export function DaySection({
  dayOfWeek,
  label,
  startDate,
  endDate,
  children,
}: {
  dayOfWeek: number;
  label: string;
  startDate: string | null;
  endDate: string | null;
  children: ReactNode;
}) {
  const mounted = useMounted();
  const { state, weekday } = mounted
    ? resolveRange(startDate, endDate)
    : { state: "unknown" as RangeState, weekday: 0 };
  const isToday = state === "during" && weekday === dayOfWeek;

  return (
    <section
      className={`rounded-2xl border p-4 shadow-sm transition-colors ${
        isToday
          ? "border-emerald-500 bg-emerald-50"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-base font-semibold tracking-tight text-zinc-900">
          {label}
        </h2>
        {isToday && (
          <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
            Today
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
