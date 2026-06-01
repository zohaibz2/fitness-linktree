"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useActionState } from "react";
import { signUpTrainer, type SignupState } from "./actions";

const initial: SignupState = { error: null };

export default function TrainerSignupPage() {
  const [state, action, pending] = useActionState(signUpTrainer, initial);
  return (
    <div className="flex min-h-screen">
      {/* Left: full-bleed gym photo, hidden below md. Dark gradient is the
          fallback that shows through if the image is missing. */}
      <div className="relative hidden w-[45%] bg-gradient-to-br from-zinc-900 to-black md:block">
        <img
          src="/auth-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Right: orange panel that centers the card on both axes with equal
          orange margin all around (p-6). */}
      <div className="flex w-full items-center justify-center bg-[#FE6E3E] px-6 py-12 md:w-[55%]">
        <div className="w-full max-w-[520px] rounded-3xl bg-white p-10 shadow-2xl">
          <h1 className="font-display text-2xl font-bold leading-tight text-zinc-900">
            Sign Up To Your Account
          </h1>
          <p className="mt-2 font-sans text-sm text-zinc-500">
            Custom training plans with one shared link. Track every rep, every set, live.
          </p>

          <form action={action} className="mt-5">
            <div className="space-y-4">
              <PillField name="email" label="Email" type="email" />
              <PillField name="password" label="Password" type="password" />
              <PillField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
            </div>

            {state.error && (
              <p className="mt-4 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-5 h-12 w-full rounded-full bg-[#FE6E3E] font-sans font-bold text-white hover:bg-[#E5612E] disabled:opacity-50"
            >
              {pending ? "Signing up…" : "Sign Up"}
            </button>
          </form>

          <div className="mt-3 text-center font-sans text-sm text-zinc-400">Or</div>

          <div className="mt-3 space-y-2">
            <OAuthButton label="Continue with Google" icon={<GoogleIcon />} />
            <OAuthButton label="Continue with Apple" icon={<AppleIcon />} />
          </div>

          <p className="mt-5 text-center font-sans text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              href="/login/trainer"
              className="font-medium text-[#FE6E3E] underline hover:text-[#E5612E]"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PillField({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block font-sans text-sm font-medium text-zinc-700">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        className="mt-1.5 h-12 w-full rounded-xl bg-[#F0F0F0] px-4 font-sans text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-[#FE6E3E]/40"
      />
    </label>
  );
}

// OAuth is intentionally disabled for now — no provider is wired up.
function OAuthButton({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      title="Coming soon"
      className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white font-sans text-sm font-medium text-zinc-700 opacity-60"
    >
      {icon}
      <span>{label}</span>
      <span className="text-xs text-zinc-400">(Coming soon)</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.41 5.41 0 0 1 3.97 7.3V4.96H.96a9 9 0 0 0 0 8.09l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true" fill="#000">
      <path d="M13.3 9.55c-.02-1.9 1.55-2.81 1.62-2.86-.88-1.29-2.26-1.47-2.75-1.49-1.17-.12-2.28.69-2.87.69-.59 0-1.5-.67-2.47-.66-1.27.02-2.44.74-3.1 1.87-1.32 2.29-.34 5.68.95 7.54.63.91 1.38 1.93 2.36 1.9.95-.04 1.31-.61 2.45-.61 1.14 0 1.46.61 2.46.59 1.02-.02 1.66-.93 2.28-1.84.72-1.05 1.02-2.07 1.03-2.12-.02-.01-1.97-.76-1.99-3Zm-1.9-5.5c.52-.63.87-1.51.77-2.39-.75.03-1.66.5-2.2 1.13-.48.55-.9 1.44-.79 2.29.84.07 1.69-.42 2.22-1.03Z" />
    </svg>
  );
}
