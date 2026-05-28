"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export type LoginState = { error: string | null };

export async function loginClient(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password are required." };

  const sb = await createServerSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  if (data.user?.user_metadata?.user_type !== "client") {
    await sb.auth.signOut();
    return { error: "This account is not a client account." };
  }

  redirect("/client/dashboard");
}
