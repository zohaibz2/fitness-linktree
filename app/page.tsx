import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { count, error } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p style={{ color: "crimson" }}>
          <strong>Error:</strong> {error.message}
        </p>
      ) : (
        <p>
          <strong>categories</strong> row count: {count ?? 0}
        </p>
      )}
    </main>
  );
}
