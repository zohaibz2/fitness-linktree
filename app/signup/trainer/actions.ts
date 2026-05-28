"use server";

// NOTE: email confirmation is currently OFF in Supabase Auth for dev. Re-enable
// it before real users sign up (Supabase → Authentication → Sign In / Up).
// When re-enabled, change the success UX to "Check your email to confirm."

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export type SignupState = { error: string | null };

export async function signUpTrainer(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !password) return { error: "Email and password are required." };

  const sb = await createServerSupabase();
  const { error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: { user_type: "trainer", name: name || null },
    },
  });
  if (error) return { error: error.message };

  // The on_auth_user_created trigger has created the trainers row.
  redirect("/dashboard/plans");
}
