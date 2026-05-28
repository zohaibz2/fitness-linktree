"use server";

// NOTE: email confirmation is currently OFF in Supabase Auth for dev. Re-enable
// it before real users sign up.

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase-server";

export type SignupState = { error: string | null };

export async function signUpClient(
  _prev: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const planShareCode = String(formData.get("plan") ?? "").trim();
  if (!email || !password) return { error: "Email and password are required." };

  const sb = await createServerSupabase();
  const { error: signUpErr } = await sb.auth.signUp({
    email,
    password,
    options: { data: { user_type: "client" } },
  });
  if (signUpErr) return { error: signUpErr.message };

  // Email confirmation is off → user is auto-signed-in. Cookies are set.

  if (planShareCode) {
    const { error: claimErr } = await sb.rpc("claim_plan_for_client", {
      p_share_code: planShareCode,
    });
    if (claimErr) {
      const m = claimErr.message;
      if (m.includes("plan_already_claimed")) {
        return {
          error:
            "This plan is already linked to another account. Contact your trainer.",
        };
      }
      if (m.includes("plan_not_found")) {
        return { error: "Plan link is invalid." };
      }
      return { error: `Failed to link plan: ${m}` };
    }
  } else {
    const { error: profErr } = await sb.rpc("ensure_client_profile");
    if (profErr) {
      return { error: `Profile creation failed: ${profErr.message}` };
    }
  }

  redirect("/client/dashboard");
}
