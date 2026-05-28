"use client";

import Link from "next/link";
import { signOutTrainer } from "@/lib/auth-actions";

export function TrainerNav({ email }: { email: string }) {
  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-5 text-sm">
          <Link href="/dashboard/plans" className="font-semibold text-zinc-900">
            Fitness Linktree
          </Link>
          <Link href="/dashboard/plans" className="text-zinc-700 hover:text-zinc-900">
            Plans
          </Link>
          <Link href="/dashboard/exercises" className="text-zinc-700 hover:text-zinc-900">
            Exercises
          </Link>
          <Link
            href="/dashboard/plans/new"
            className="rounded bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800"
          >
            New plan
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span>{email}</span>
          <form action={signOutTrainer}>
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
