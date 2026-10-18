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
    <div className="flex min-h-[300px] flex-col rounded-lg border border-brand-deep/10 bg-paper/60 p-2">
      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-brand-deep/90">
        {label}
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2 rounded p-1 transition ${
          isOver ? "ring-2 ring-brand bg-brand-tint/30/40" : ""
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
          <div className="flex flex-1 items-center justify-center rounded border border-dashed border-brand-deep/20 p-3 text-center text-xs text-brand-deep/60">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}
