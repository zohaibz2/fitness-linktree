"use client";

import Link from "next/link";
import { signOutTrainer } from "@/lib/auth-actions";

export function TrainerNav({ email }: { email: string }) {
  return (
    <nav className="border-b border-brand-deep/10 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-5 text-sm">
          <Link href="/dashboard/plans" className="font-semibold text-brand-deep">
            Fitness Linktree
          </Link>
          <Link href="/dashboard/plans" className="text-brand-deep/90 hover:text-brand-deep">
            Plans
          </Link>
          <Link href="/dashboard/exercises" className="text-brand-deep/90 hover:text-brand-deep">
            Exercises
          </Link>
          <Link
            href="/dashboard/plans/new"
            className="rounded bg-brand-deep px-3 py-1 text-xs font-semibold text-white hover:bg-brand-deep/90"
          >
            New plan
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-brand-deep/80">
          <span>{email}</span>
          <form action={signOutTrainer}>
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
