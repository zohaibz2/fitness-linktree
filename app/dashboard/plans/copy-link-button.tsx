"use client";

import { useState } from "react";

export function CopyLinkButton({
  shareCode,
  baseUrl,
}: {
  shareCode: string;
  baseUrl: string | null;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const base = (baseUrl ?? window.location.origin).replace(/\/+$/, "");
    const url = `${base}/plan/${shareCode}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
    >
      {copied ? "Copied" : "Copy link"}
    </button>
  );
}
