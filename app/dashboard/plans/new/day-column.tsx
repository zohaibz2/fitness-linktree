"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlacedExerciseCard } from "./placed-exercise-card";
import type { DayKey, PlacedExercise } from "./plan-builder";

export function DayColumn({
  day,
  label,
  items,
  onUpdate,
  onRemove,
}: {
  day: DayKey;
  label: string;
  items: PlacedExercise[];
  onUpdate: (day: DayKey, instanceId: string, patch: Partial<PlacedExercise>) => void;
  onRemove: (day: DayKey, instanceId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `day-${day}`,
    data: { type: "day", day },
  });

  return (
    <div className="flex min-h-[300px] flex-col rounded-lg border border-zinc-200 bg-zinc-100/60 p-2">
      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
        {label}
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2 rounded p-1 transition ${
          isOver ? "ring-2 ring-blue-400 bg-blue-50/40" : ""
        }`}
      >
        <SortableContext
          items={items.map((p) => p.instanceId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <PlacedExerciseCard
              key={item.instanceId}
              day={day}
              item={item}
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>
        {items.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded border border-dashed border-zinc-300 p-3 text-center text-xs text-zinc-400">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
