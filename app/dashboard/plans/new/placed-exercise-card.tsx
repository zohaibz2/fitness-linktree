"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DayKey, PlacedExercise } from "./plan-builder";

export function PlacedExerciseCard({
  day,
  item,
  onUpdate,
  onRemove,
}: {
  day: DayKey;
  item: PlacedExercise;
  onUpdate: (day: DayKey, instanceId: string, patch: Partial<PlacedExercise>) => void;
  onRemove: (day: DayKey, instanceId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: item.instanceId,
      data: { type: "card", source: "placed", day, instanceId: item.instanceId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded border border-zinc-200 bg-white p-2 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div
          {...attributes}
          {...listeners}
          className="min-w-0 flex-1 cursor-grab touch-none active:cursor-grabbing"
        >
          <div className="truncate text-sm font-semibold text-zinc-900">
            {item.name}
          </div>
          <div className="truncate text-[10px] uppercase tracking-wide text-zinc-500">
            {item.category}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onRemove(day, item.instanceId)}
          aria-label="Remove"
          className="rounded px-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-600"
        >
          ×
        </button>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <label className="flex flex-col text-[10px] text-zinc-500">
          Sets
          <input
            type="number"
            min={0}
            value={item.sets}
            onChange={(e) =>
              onUpdate(day, item.instanceId, { sets: Number(e.target.value) })
            }
            className="rounded border border-zinc-300 px-1 py-0.5 text-xs"
          />
        </label>
        <label className="flex flex-col text-[10px] text-zinc-500">
          Reps
          <input
            type="number"
            min={0}
            value={item.reps}
            onChange={(e) =>
              onUpdate(day, item.instanceId, { reps: Number(e.target.value) })
            }
            className="rounded border border-zinc-300 px-1 py-0.5 text-xs"
          />
        </label>
        <label className="col-span-2 flex flex-col text-[10px] text-zinc-500">
          Weight
          <input
            type="number"
            step="0.5"
            value={item.weight}
            onChange={(e) =>
              onUpdate(day, item.instanceId, { weight: e.target.value })
            }
            className="rounded border border-zinc-300 px-1 py-0.5 text-xs"
          />
        </label>
        <label className="col-span-2 flex flex-col text-[10px] text-zinc-500">
          Notes
          <input
            type="text"
            value={item.notes}
            onChange={(e) =>
              onUpdate(day, item.instanceId, { notes: e.target.value })
            }
            className="rounded border border-zinc-300 px-1 py-0.5 text-xs"
          />
        </label>
      </div>
    </div>
  );
}
