"use client";

import { useActionState, useEffect, useRef } from "react";
import { createExercise } from "./actions";
import { initialState, type CreateExerciseState } from "./form-state";
import type { Category } from "@/lib/database.types";

export function NewExerciseForm({ categories }: { categories: Category[] }) {
  const [state, formAction, pending] = useActionState<
    CreateExerciseState,
    FormData
  >(createExercise, initialState);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-zinc-900">Add an exercise</h2>

      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-700"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="video_url"
          className="block text-sm font-medium text-zinc-700"
        >
          Video URL
        </label>
        <input
          id="video_url"
          name="video_url"
          type="url"
          placeholder="https://…"
          className="w-full rounded border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="category_id"
          className="block text-sm font-medium text-zinc-700"
        >
          Category <span className="text-red-500">*</span>
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue=""
          className="w-full rounded border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none"
        >
          <option value="" disabled>
            Select a category…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-amber-600">
            No categories exist yet. Add one in the <code>categories</code> table first.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || categories.length === 0}
          className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Adding…" : "Submit"}
        </button>

        {state.status === "success" && (
          <p aria-live="polite" className="text-sm text-green-700">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p aria-live="polite" className="text-sm text-red-600">
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
