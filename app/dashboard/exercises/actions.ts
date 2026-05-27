"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import type { CreateExerciseState } from "./form-state";

export async function createExercise(
  _prevState: CreateExerciseState,
  formData: FormData
): Promise<CreateExerciseState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();

  if (!name) {
    return { status: "error", message: "Name is required." };
  }
  if (!categoryId) {
    return { status: "error", message: "Category is required." };
  }

  const { error } = await supabase.from("exercises").insert({
    name,
    description: description || null,
    video_url: videoUrl || null,
    category_id: categoryId,
    created_by: null,
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/dashboard/exercises");
  return { status: "success", message: `Added "${name}".` };
}
