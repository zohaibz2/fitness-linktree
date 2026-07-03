"use client";

import { useState } from "react";

// Waitlist form extracted from the landing page. Not currently rendered — kept
// here so it can be dropped back into any page later. Posts to /api/waitlist,
// which inserts the email into the Supabase `waitlist` table.
export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleWaitlist() {
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("success");
      setMessage("You're on the list! We'll be in touch.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(String(err));
    }
  }

  return (
    <>
      {/* Waitlist input */}
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full px-6 py-4 font-sans text-[#0A0A0A] shadow-lg outline-none sm:w-72"
        />
        <button
          onClick={handleWaitlist}
          disabled={status === "loading"}
          className="rounded-full bg-white px-8 py-4 font-sans font-semibold text-[#0A0A0A] shadow-lg transition hover:bg-zinc-100 disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Join Waitlist"}
        </button>
      </div>

      {/* Feedback message */}
      {message && (
        <p className={`mt-3 font-sans text-sm font-medium ${status === "success" ? "text-white" : "text-red-200"}`}>
          {message}
        </p>
      )}
    </>
  );
}
