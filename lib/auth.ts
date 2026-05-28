import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase-server";

export type UserType = "trainer" | "client";

export async function getUser() {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user;
}

export function userTypeOf(user: { user_metadata?: { user_type?: string } } | null): UserType | null {
  const t = user?.user_metadata?.user_type;
  return t === "trainer" || t === "client" ? t : null;
}

export async function requireTrainer() {
  const user = await getUser();
  if (!user) redirect("/login/trainer");
  if (userTypeOf(user) !== "trainer") redirect("/client/dashboard");
  return user;
}

export async function requireClient() {
  const user = await getUser();
  if (!user) redirect("/login/client");
  if (userTypeOf(user) !== "client") redirect("/dashboard/plans");
  return user;
}
