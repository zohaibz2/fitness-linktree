"use client";

import Link from "next/link";
import { signOutClient } from "@/lib/auth-actions";

export function ClientNav({ email }: { email: string }) {
  return (
    <nav className="border-b border-brand-deep/10 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-5 text-sm">
          <Link href="/client/dashboard" className="font-semibold text-brand-deep">
            Fitness Linktree
          </Link>
          <Link
            href="/client/dashboard"
            className="text-brand-deep/90 hover:text-brand-deep"
          >
            My plans
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-brand-deep/80">
          <span>{email}</span>
          <form action={signOutClient}>
            <button
              type="submit"
              className="rounded border border-brand-deep/20 bg-white px-3 py-1 font-medium text-brand-deep/90 hover:bg-paper"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
