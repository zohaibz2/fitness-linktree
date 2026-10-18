import type { ReactNode } from "react";

export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-lg border border-brand-deep/10 bg-white p-6 shadow-sm">
          <h1 className="mb-6 text-xl font-bold text-brand-deep">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  name,
  label,
  type = "text",
  defaultValue,
}: {
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-brand-deep/90">{label}</span>
      <input
        name={name}
        type={type}
        required
        defaultValue={defaultValue}
        className="mt-1 w-full rounded border border-brand-deep/20 px-2 py-1.5 text-sm"
      />
    </label>
  );
}
