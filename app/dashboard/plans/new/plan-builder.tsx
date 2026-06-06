"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { ExerciseWithCategory } from "@/lib/database.types";
import { DayColumn } from "./day-column";
import { LibrarySidebar } from "./library-sidebar";
import { savePlan, type SavePlanInput } from "./actions";
import { updatePlan, type UpdatePlanInput } from "../actions";

export type PlacedExercise = {
  instanceId: string;
  exerciseId: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  weight: string;
  notes: string;
};

export type DayKey = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type DaysState = Record<DayKey, PlacedExercise[]>;

// Present only in "Edit" mode; absent means "New" mode.
export type InitialPlanData = {
  planId: string;
  clientName: string;
  planName: string;
  startDate: string | null;
  endDate: string | null;
  days: DaysState;
};

const DAYS: { key: DayKey; label: string }[] = [
  { key: 1, label: "Monday" },
  { key: 2, label: "Tuesday" },
  { key: 3, label: "Wednesday" },
  { key: 4, label: "Thursday" },
  { key: 5, label: "Friday" },
  { key: 6, label: "Saturday" },
  { key: 7, label: "Sunday" },
];

function nextMondayISO(): string {
  const d = new Date();
  const day = d.getDay(); // 0=Sun..6=Sat
  const offset = ((1 - day + 7) % 7) || 7;
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function PlanBuilder({
  exercises,
  initialData,
}: {
  exercises: ExerciseWithCategory[];
  initialData?: InitialPlanData;
}) {
  const mode = initialData ? "edit" : "new";

  const [clientName, setClientName] = useState(
    () => initialData?.clientName ?? ""
  );
  const [planName, setPlanName] = useState(() => initialData?.planName ?? "");
  const [startDate, setStartDate] = useState(() =>
    initialData ? initialData.startDate ?? "" : nextMondayISO()
  );
  const [endDate, setEndDate] = useState(() =>
    initialData ? initialData.endDate ?? "" : addDaysISO(nextMondayISO(), 28)
  );
  const [days, setDays] = useState<DaysState>(
    () => initialData?.days ?? { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }
  );
  const [error, setError] = useState<string | null>(null);
  const [activeDrag, setActiveDrag] = useState<PlacedExercise | { name: string; category: string } | null>(null);
  const [isSaving, startSaving] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function handleDragStart(e: DragStartEvent) {
    const data = e.active.data.current as
      | { source: "library"; exerciseId: string; name: string; category: string }
      | { source: "placed"; day: DayKey; instanceId: string }
      | undefined;
    if (!data) return;
    if (data.source === "library") {
      setActiveDrag({ name: data.name, category: data.category });
    } else {
      const p = days[data.day].find((x) => x.instanceId === data.instanceId);
      if (p) setActiveDrag(p);
    }
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveDrag(null);
    const { active, over } = e;
    if (!over) return;

    const activeData = active.data.current as
      | { source: "library"; exerciseId: string; name: string; category: string }
      | { source: "placed"; day: DayKey; instanceId: string }
      | undefined;
    const overData = over.data.current as
      | { type: "day"; day: DayKey }
      | { type: "card"; day: DayKey; instanceId: string }
      | undefined;
    if (!activeData || !overData) return;

    const targetDay: DayKey = overData.day;

    if (activeData.source === "library") {
      const newCard: PlacedExercise = {
        instanceId: crypto.randomUUID(),
        exerciseId: activeData.exerciseId,
        name: activeData.name,
        category: activeData.category,
        sets: 3,
        reps: 10,
        weight: "",
        notes: "",
      };
      setDays((prev) => {
        const next = { ...prev, [targetDay]: [...prev[targetDay]] };
        if (overData.type === "card") {
          const idx = next[targetDay].findIndex((p) => p.instanceId === overData.instanceId);
          next[targetDay].splice(idx >= 0 ? idx : next[targetDay].length, 0, newCard);
        } else {
          next[targetDay].push(newCard);
        }
        return next;
      });
      return;
    }

    // source === "placed"
    const fromDay = activeData.day;
    const instanceId = activeData.instanceId;

    if (fromDay === targetDay) {
      if (overData.type !== "card" || overData.instanceId === instanceId) return;
      setDays((prev) => {
        const list = prev[fromDay];
        const oldIdx = list.findIndex((p) => p.instanceId === instanceId);
        const newIdx = list.findIndex((p) => p.instanceId === overData.instanceId);
        if (oldIdx < 0 || newIdx < 0) return prev;
        return { ...prev, [fromDay]: arrayMove(list, oldIdx, newIdx) };
      });
      return;
    }

    setDays((prev) => {
      const fromList = [...prev[fromDay]];
      const moveIdx = fromList.findIndex((p) => p.instanceId === instanceId);
      if (moveIdx < 0) return prev;
      const [moved] = fromList.splice(moveIdx, 1);
      const toList = [...prev[targetDay]];
      if (overData.type === "card") {
        const insertIdx = toList.findIndex((p) => p.instanceId === overData.instanceId);
        toList.splice(insertIdx >= 0 ? insertIdx : toList.length, 0, moved);
      } else {
        toList.push(moved);
      }
      return { ...prev, [fromDay]: fromList, [targetDay]: toList };
    });
  }

  function updateCard(day: DayKey, instanceId: string, patch: Partial<PlacedExercise>) {
    setDays((prev) => ({
      ...prev,
      [day]: prev[day].map((p) => (p.instanceId === instanceId ? { ...p, ...patch } : p)),
    }));
  }

  function removeCard(day: DayKey, instanceId: string) {
    setDays((prev) => ({
      ...prev,
      [day]: prev[day].filter((p) => p.instanceId !== instanceId),
    }));
  }

  function buildDaysPayload() {
    return Object.fromEntries(
      (Object.keys(days) as unknown as DayKey[]).map((k) => [
        String(k),
        days[k].map((p) => ({
          exerciseId: p.exerciseId,
          sets: Number(p.sets) || 0,
          reps: Number(p.reps) || 0,
          weight: p.weight.trim() === "" ? null : Number(p.weight),
          notes: p.notes.trim() === "" ? null : p.notes.trim(),
        })),
      ])
    );
  }

  function onSave() {
    setError(null);
    if (!planName.trim()) return setError("Plan name is required.");

    if (mode === "edit") {
      const payload: UpdatePlanInput = {
        planId: initialData!.planId,
        planName: planName.trim(),
        startDate: startDate || null,
        endDate: endDate || null,
        days: buildDaysPayload(),
      };
      startSaving(async () => {
        const res = await updatePlan(payload);
        if (res?.error) setError(res.error);
      });
      return;
    }

    if (!clientName.trim()) return setError("Client name is required.");

    const payload: SavePlanInput = {
      clientName: clientName.trim(),
      planName: planName.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      days: buildDaysPayload(),
    };

    startSaving(async () => {
      const res = await savePlan(payload);
      if (res?.error) setError(res.error);
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveDrag(null)}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col text-xs font-medium text-zinc-700">
                {mode === "edit" ? "Client" : "Client name *"}
                <input
                  className="mt-1 w-56 rounded border border-zinc-300 px-2 py-1.5 text-sm disabled:bg-zinc-100 disabled:text-zinc-500"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={mode === "edit"}
                  title={
                    mode === "edit"
                      ? "The client can't be changed when editing a plan."
                      : undefined
                  }
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-zinc-700">
                Plan name *
                <input
                  className="mt-1 w-56 rounded border border-zinc-300 px-2 py-1.5 text-sm"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-zinc-700">
                Start date
                <input
                  type="date"
                  className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </label>
              <label className="flex flex-col text-xs font-medium text-zinc-700">
                End date
                <input
                  type="date"
                  className="mt-1 rounded border border-zinc-300 px-2 py-1.5 text-sm"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving}
                className="ml-auto rounded bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {mode === "edit"
                  ? isSaving
                    ? "Updating…"
                    : "Update Plan"
                  : isSaving
                    ? "Saving…"
                    : "Save Plan"}
              </button>
            </div>
            {error && (
              <p className="mt-3 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                {error}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-7">
            {DAYS.map((d) => (
              <DayColumn
                key={d.key}
                day={d.key}
                label={d.label}
                items={days[d.key]}
                onUpdate={updateCard}
                onRemove={removeCard}
              />
            ))}
          </div>
        </div>

        <LibrarySidebar exercises={exercises} />
      </div>

      <DragOverlay>
        {activeDrag ? (
          <div className="rounded border border-zinc-300 bg-white px-3 py-2 text-sm shadow-lg">
            <div className="font-medium text-zinc-900">{activeDrag.name}</div>
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              {activeDrag.category}
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
