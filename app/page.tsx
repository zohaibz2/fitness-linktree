import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold text-zinc-900">Fitness Linktree</h1>
        <p className="mt-3 text-base text-zinc-600">
          Build workout plans for clients. Share with one link.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/signup/trainer"
            className="rounded bg-zinc-900 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Sign up as trainer
          </Link>
          <Link
            href="/signup/client"
            className="rounded border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            Sign up as client
          </Link>
        </div>

        <div className="mt-6 flex justify-center gap-6 text-sm text-zinc-600">
          <Link href="/login/trainer" className="hover:underline">
            Trainer login
          </Link>
          <Link href="/login/client" className="hover:underline">
            Client login
          </Link>
        </div>
      </div>
    </div>
  );
}
