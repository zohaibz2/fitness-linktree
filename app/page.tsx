import Link from "next/link";
import {
  GripVertical,
  UserRound,
  Link2,
  Smartphone,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A]">
      <nav className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Fitness Linktree
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/login/trainer"
              className="text-sm font-medium text-zinc-700 hover:text-black"
            >
              Sign in
            </Link>
            <Link
              href="/signup/trainer"
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Built by a trainer who&apos;s coached 25+ clients in person
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            The simplest way to deliver workout plans to your online clients.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
            Build custom plans, share one link per client, update them anytime
            — no apps to install, no spreadsheets.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup/trainer"
              className="w-full rounded-md bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 sm:w-auto"
            >
              Sign up
            </Link>
            <Link
              href="/plan/j0mhd2s6"
              className="w-full rounded-md border border-black bg-transparent px-6 py-3 text-sm font-semibold text-black hover:bg-zinc-50 sm:w-auto"
            >
              See an example plan
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="absolute inset-x-8 -bottom-6 h-12 rounded-full bg-zinc-900/10 blur-2xl" />
          <div className="relative rotate-[-1.5deg] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10">
            <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-zinc-300" />
              <span className="h-3 w-3 rounded-full bg-zinc-300" />
              <span className="h-3 w-3 rounded-full bg-zinc-300" />
              <div className="ml-4 flex-1">
                <div className="mx-auto h-6 max-w-md rounded-md border border-zinc-200 bg-white px-3 text-xs leading-6 text-zinc-400">
                  fitnesslinktree.app/plan/…
                </div>
              </div>
            </div>
            <div className="bg-zinc-50 p-3">
              <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-3 py-2">
                <span className="text-[11px] font-semibold text-zinc-700">
                  Push / Pull / Legs — Week 1
                </span>
                <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-semibold text-white">
                  Save Plan
                </span>
              </div>

              <div className="mt-3 flex gap-3">
                <div className="grid flex-1 grid-cols-3 gap-1.5 sm:grid-cols-5 lg:grid-cols-7">
                  {[
                    { day: "MON", show: "flex", cards: [{ t: "Squats", s: "3 × 10" }, { t: "Bench Press", s: "3 × 8" }] },
                    { day: "TUE", show: "hidden sm:flex", rest: true, cards: [] },
                    { day: "WED", show: "flex", cards: [{ t: "Deadlift", s: "4 × 5" }, { t: "Rows", s: "3 × 10" }, { t: "Pull-Ups", s: "3 × 8" }] },
                    { day: "THU", show: "hidden sm:flex", cards: [{ t: "Overhead Press", s: "3 × 8" }] },
                    { day: "FRI", show: "hidden lg:flex", rest: true, cards: [] },
                    { day: "SAT", show: "flex", cards: [{ t: "Plank", s: "3 × 45s" }, { t: "Lunges", s: "3 × 12" }] },
                    { day: "SUN", show: "hidden lg:flex", rest: true, cards: [] },
                  ].map((d) => (
                    <div key={d.day} className={`${d.show} flex-col gap-1.5`}>
                      <div className="text-[9px] font-semibold tracking-wider text-zinc-500">
                        {d.day}
                      </div>
                      {d.rest ? (
                        <div className="rounded border border-dashed border-zinc-200 px-1.5 py-4 text-center text-[9px] text-zinc-400">
                          Rest
                        </div>
                      ) : (
                        d.cards.map((c) => (
                          <div
                            key={c.t}
                            className="rounded border border-zinc-200 bg-white px-1.5 py-1.5"
                          >
                            <div className="truncate text-[10px] font-semibold leading-tight text-zinc-800">
                              {c.t}
                            </div>
                            <div className="mt-0.5 text-[9px] text-zinc-500">{c.s}</div>
                          </div>
                        ))
                      )}
                    </div>
                  ))}
                </div>

                <div className="hidden w-40 shrink-0 lg:block">
                  <div className="rounded border border-zinc-200 bg-white px-2 py-1.5 text-[10px] text-zinc-400">
                    Search exercises…
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {[
                      { t: "Romanian Deadlift", c: "Hamstrings" },
                      { t: "Incline Press", c: "Chest" },
                      { t: "Lat Pulldown", c: "Back" },
                      { t: "Goblet Squat", c: "Legs" },
                      { t: "Face Pull", c: "Shoulders" },
                      { t: "Bicep Curl", c: "Arms" },
                    ].map((e) => (
                      <div
                        key={e.t}
                        className="rounded border border-zinc-200 bg-white px-2 py-1.5 shadow-sm"
                      >
                        <div className="truncate text-[10px] font-semibold text-zinc-800">
                          {e.t}
                        </div>
                        <div className="text-[9px] text-zinc-500">{e.c}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Build a plan",
              body:
                "Drag exercises into days. Set reps, weight, notes. Done in minutes.",
            },
            {
              n: "02",
              title: "Send the link",
              body:
                "Each plan gets a unique link. Send it via WhatsApp, email, anywhere.",
            },
            {
              n: "03",
              title: "Client opens it on their phone",
              body:
                "Clean mobile view. They can optionally sign up to track progress.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-zinc-200 bg-white p-6"
            >
              <span className="inline-flex items-center justify-center rounded-md bg-orange-500 px-2 py-1 text-xs font-bold text-white">
                {s.n}
              </span>
              <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to coach online
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: GripVertical,
              title: "Drag-and-drop plan builder",
              body: "Compose weeks of training without leaving the keyboard.",
            },
            {
              icon: UserRound,
              title: "Custom plan per client",
              body: "No templates forced on every client — each plan is its own.",
            },
            {
              icon: Link2,
              title: "One link per client",
              body: "No client login needed to view their plan.",
            },
            {
              icon: Smartphone,
              title: "Mobile-friendly client view",
              body: "Reads cleanly on the phone they already train with.",
            },
            {
              icon: TrendingUp,
              title: "Clients can sign up to track progress",
              body: "Optional accounts let clients log what they actually lifted.",
            },
            {
              icon: RefreshCw,
              title: "Update plans anytime",
              body: "Edit on your end. Changes are live for the client instantly.",
            },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-zinc-200 bg-white p-6"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-orange-500">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-zinc-600">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-orange-50">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to ditch the screenshots?
          </h2>
          <div className="mt-8 flex justify-center">
            <Link
              href="/signup/trainer"
              className="rounded-md bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white hover:bg-orange-600"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-sm text-zinc-600 sm:flex-row">
          <p>© 2026 Fitness Linktree</p>
          <p>
            Contact:{" "}
            <a
              href="mailto:narejozohaib33@gmail.com"
              className="hover:text-black"
            >
              narejozohaib33@gmail.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
