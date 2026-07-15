import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Vercel Cron hits this route on a schedule (see vercel.json) to run a tiny
// read against Supabase so the project isn't paused for inactivity.
export async function GET(request: Request) {
  // Only Vercel Cron (which sends `Authorization: Bearer <CRON_SECRET>`)
  // should be able to trigger this — not random public traffic.
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    // Minimal read — just enough activity to keep Supabase marked active.
    const { error } = await supabase
      .from("categories")
      .select("id")
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      ok: true,
      message: "Supabase is alive!",
      time: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
