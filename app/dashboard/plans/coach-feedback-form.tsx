"use client";

import { useState, useTransition } from "react";
import { updateCoachFeedback } from "./actions";

export function CoachFeedbackForm({
  logId,
  initial,
}: {
  logId: string;
  initial: string | null;
}) {
  const [feedback, setFeedback] = useState(initial ?? "");
  const [draft, setDraft] = useState(initial ?? "");
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function open() {
    setDraft(feedback);
    setError(null);
    setEditing(true);
  }

  function cancel() {
    setDraft(feedback);
    setError(null);
    setEditing(false);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await updateCoachFeedback(logId, draft);
      if (res.error) {
        setError(res.error);
      } else {
        setFeedback(draft.trim());
        setEditing(false);
      }
    });
  }

  if (!editing) {
    return (
      <div className="mt-2">
        {feedback ? (
          <div className="flex items-start justify-between gap-2 rounded border border-zinc-200 bg-zinc-50 px-2 py-1.5">
            <p className="text-xs text-zinc-700">{feedback}</p>
            <button
              type="button"
              onClick={open}
              className="shrink-0 text-xs font-semibold text-zinc-500 hover:text-zinc-800"
            >
              Edit
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={open}
            className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Add Feedback
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={2}
        placeholder="Reply to this check-in…"
        className="w-full rounded border border-zinc-300 px-2 py-1.5 text-xs text-zinc-800 focus:border-zinc-500 focus:outline-none"
      />
      <div className="mt-1.5 flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={isPending}
          className="rounded border border-zinc-300 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
        >
          Cancel
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}
