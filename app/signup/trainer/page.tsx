"use client";

import Link from "next/link";
import { useActionState } from "react";
import { AuthShell, Field } from "@/app/auth-ui";
import { signUpTrainer, type SignupState } from "./actions";

const initial: SignupState = { error: null };

export default function TrainerSignupPage() {
  const [state, action, pending] = useActionState(signUpTrainer, initial);
  return (
    <AuthShell title="Create a trainer account">
      <form action={action} className="space-y-3">
        <Field name="name" label="Name (optional)" />
        <Field name="email" label="Email" type="email" />
        <Field name="password" label="Password" type="password" />
        {state.error && (
          <p className="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {pending ? "Redirecting…" : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link href="/login/trainer" className="font-medium text-zinc-900 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
