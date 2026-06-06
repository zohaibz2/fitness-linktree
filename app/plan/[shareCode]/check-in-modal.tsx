"use client";

import { useState, useTransition } from "react";
import { submitCheckIn } from "./check-in-actions";

export function CheckInButton({
  shareCode,
  planExerciseId,
  exerciseName,
}: {
  shareCode: string;
  planExerciseId: string;
  exerciseName: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setError(null);
    setDone(false);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Client-side identity check: name must not be empty before submitting.
    const clientName = String(formData.get("client_name") ?? "").trim();
    if (!clientName) {
      setError("Please confirm your name before submitting.");
      return;
    }

    formData.set("share_code", shareCode);
    formData.set("plan_exercise_id", planExerciseId);
    startTransition(async () => {
      const res = await submitCheckIn(formData);
      if (res.ok) setDone(true);
      else setError(res.error ?? "Something went wrong.");
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
      >
        Log Check-in
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-t-2xl border border-zinc-200 bg-white p-5 shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-zinc-900">Log Check-in</h2>
                <p className="text-sm text-zinc-500">{exerciseName}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {done ? (
              <div className="py-6 text-center">
                <p className="text-sm font-medium text-emerald-600">
                  ✓ Check-in logged. Nice work!
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <label className="flex flex-col text-xs font-medium text-zinc-600">
                  Confirm your name *
                  <input
                    name="client_name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Alex Smith"
                    className="mt-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none"
                  />
                </label>

                <div className="grid grid-cols-3 gap-3">
                  <label className="flex flex-col text-xs font-medium text-zinc-600">
                    Sets
                    <input
                      name="actual_sets"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      className="mt-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-zinc-600">
                    Reps
                    <input
                      name="actual_reps"
                      type="number"
                      min="0"
                      inputMode="numeric"
                      className="mt-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col text-xs font-medium text-zinc-600">
                    Weight (kg)
                    <input
                      name="actual_weight"
                      type="number"
                      min="0"
                      step="0.5"
                      inputMode="decimal"
                      className="mt-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none"
                    />
                  </label>
                </div>

                <label className="flex flex-col text-xs font-medium text-zinc-600">
                  Notes
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="How did it feel?"
                    className="mt-1 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none"
                  />
                </label>

                <label className="flex flex-col text-xs font-medium text-zinc-600">
                  Progress photo (optional)
                  <input
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="mt-1 text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-emerald-700 hover:file:bg-zinc-200"
                  />
                </label>

                {error && (
                  <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isPending ? "Saving…" : "Submit Check-in"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
