"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase-server";

export async function signOutTrainer() {
  const sb = await createServerSupabase();
  await sb.auth.signOut();
  redirect("/login/trainer");
}

export async function signOutClient() {
  const sb = await createServerSupabase();
  await sb.auth.signOut();
  redirect("/login/client");
}
