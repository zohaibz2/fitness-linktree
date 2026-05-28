"use client";

import Link from "next/link";
import { signOutClient } from "@/lib/auth-actions";

export function ClientNav({ email }: { email: string }) {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-5 text-sm">
          <Link href="/client/dashboard" className="font-semibold text-zinc-900">
            Fitness Linktree
          </Link>
          <Link
            href="/client/dashboard"
            className="text-zinc-700 hover:text-zinc-900"
          >
            My plans
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span>{email}</span>
          <form action={signOutClient}>
            <button
              type="submit"
              className="rounded border border-zinc-300 bg-white px-3 py-1 font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
