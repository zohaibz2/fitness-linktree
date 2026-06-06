"use server";

import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";

const BUCKET = "client-uploads";
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic"];

export type CheckInResult = { ok: boolean; error?: string };

function toIntOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function toNumOrNull(v: FormDataEntryValue | null): number | null {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export async function submitCheckIn(
  formData: FormData
): Promise<CheckInResult> {
  const shareCode = String(formData.get("share_code") ?? "").trim();
  const planExerciseId = String(formData.get("plan_exercise_id") ?? "").trim();
  if (!shareCode || !planExerciseId) {
    return { ok: false, error: "Missing check-in context." };
  }

  const actualSets = toIntOrNull(formData.get("actual_sets"));
  const actualReps = toIntOrNull(formData.get("actual_reps"));
  const actualWeight = toNumOrNull(formData.get("actual_weight"));
  const notes = String(formData.get("notes") ?? "").trim();

  // Anonymous share-code visitor: the anon client (with the bucket's anon
  // INSERT policy + the RPC's anon grant) is the right role here.
  const sb = supabase;

  // ---- Step 1: upload the photo FIRST (if provided) ----
  let mediaPath: string | null = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED.includes(file.type)) {
      return { ok: false, error: "Photo must be a JPEG, PNG, WEBP, or HEIC image." };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, error: "Photo must be 8 MB or smaller." };
    }
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const key = `${shareCode}/${planExerciseId}/${randomUUID()}.${ext}`;
    const { error: upErr } = await sb.storage
      .from(BUCKET)
      .upload(key, file, { contentType: file.type, upsert: false });
    if (upErr) {
      // Upload failed → abort with no DB write (nothing to clean up).
      return { ok: false, error: `Photo upload failed: ${upErr.message}` };
    }
    mediaPath = key;
  }

  // ---- Step 2: insert the log via the validated SECURITY DEFINER RPC ----
  const { error: rpcErr } = await sb.rpc("submit_check_in", {
    p_share_code: shareCode,
    p_plan_exercise_id: planExerciseId,
    p_actual_sets: actualSets,
    p_actual_reps: actualReps,
    p_actual_weight: actualWeight,
    p_notes: notes,
    p_media_url: mediaPath,
  });

  if (rpcErr) {
    // ---- Compensating cleanup: remove the orphaned upload ----
    if (mediaPath) {
      await sb.storage.from(BUCKET).remove([mediaPath]);
    }
    if (rpcErr.message.includes("invalid_check_in_target")) {
      return { ok: false, error: "This check-in link is no longer valid." };
    }
    return { ok: false, error: `Could not save check-in: ${rpcErr.message}` };
  }

  return { ok: true };
}
