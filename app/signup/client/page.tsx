"use client";

import Link from "next/link";
import { use } from "react";
import { useActionState } from "react";
import { AuthShell, Field } from "@/app/auth-ui";
import { signUpClient, type SignupState } from "./actions";

const initial: SignupState = { error: null };

export default function ClientSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = use(searchParams);
  const [state, action, pending] = useActionState(signUpClient, initial);
  return (
    <AuthShell title="Create a client account">
      {plan && (
        <p className="mb-4 rounded border border-brand-tint bg-brand-tint/30 p-2 text-sm text-brand-deep">
          You&apos;ll be linked to the plan you opened.
        </p>
      )}
      <form action={action} className="space-y-3">
        <input type="hidden" name="plan" value={plan ?? ""} />
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
          className="w-full rounded bg-brand-deep px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep/90 disabled:opacity-50"
        >
          {pending ? "Redirecting…" : "Sign up"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-brand-deep/80">
        Already have an account?{" "}
        <Link href="/login/client" className="font-medium text-brand-deep hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
