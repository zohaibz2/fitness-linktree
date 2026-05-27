"use client";

import { useMemo, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { ExerciseWithCategory } from "@/lib/database.types";

function LibraryCard({ ex }: { ex: ExerciseWithCategory }) {
  const category = ex.categories?.name ?? "Uncategorized";
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `lib-${ex.id}`,
    data: {
      source: "library",
      exerciseId: ex.id,
      name: ex.name,
      category,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none rounded border border-zinc-200 bg-white p-2 text-sm shadow-sm hover:border-zinc-300 active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="font-medium text-zinc-900">{ex.name}</div>
      <div className="mt-0.5 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-zinc-600">
        {category}
      </div>
    </div>
  );
}

export function LibrarySidebar({
  exercises,
}: {
  exercises: ExerciseWithCategory[];
}) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? exercises.filter((e) => e.name.toLowerCase().includes(q))
      : exercises;
    const map = new Map<string, ExerciseWithCategory[]>();
    for (const ex of filtered) {
      const cat = ex.categories?.name ?? "Uncategorized";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(ex);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [exercises, query]);

  return (
    <aside className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
      <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-200 p-3">
          <h2 className="mb-2 text-sm font-semibold text-zinc-900">
            Exercise Library
          </h2>
          <input
            type="text"
            placeholder="Search exercises…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded border border-zinc-300 px-2 py-1.5 text-sm"
          />
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-3">
          {grouped.length === 0 && (
            <p className="text-sm text-zinc-500">No exercises.</p>
          )}
          {grouped.map(([cat, list]) => (
            <section key={cat}>
              <h3 className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                {cat}
              </h3>
              <div className="space-y-1.5">
                {list.map((ex) => (
                  <LibraryCard key={ex.id} ex={ex} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </aside>
  );
}
