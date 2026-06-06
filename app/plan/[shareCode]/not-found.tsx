export default function PlanNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-5 text-zinc-100">
      <div className="max-w-sm text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-emerald-400">
          FitTree
        </p>
        <h1 className="mt-3 text-2xl font-bold text-white">Plan not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          This plan link is invalid or has expired. Please contact your trainer
          for an up-to-date link.
        </p>
      </div>
    </div>
  );
}
