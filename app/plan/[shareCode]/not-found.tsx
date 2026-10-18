export default function PlanNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5 text-brand-deep">
      <div className="max-w-sm text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-brand-deep">
          Trainwithzohaib
        </p>
        <h1 className="mt-3 text-2xl font-bold text-brand-deep">Plan not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-deep/75">
          This plan link is invalid or has expired. Please contact your trainer
          for an up-to-date link.
        </p>
      </div>
    </div>
  );
}
