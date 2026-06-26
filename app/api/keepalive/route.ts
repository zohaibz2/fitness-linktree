import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Just a lightweight ping to keep Supabase from pausing
    const { error } = await supabase
      .from("categories") // change this to any table in your project
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
