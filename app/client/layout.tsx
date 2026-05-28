import { requireClient } from "@/lib/auth";
import { ClientNav } from "./nav";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireClient();
  return (
    <div className="min-h-screen bg-zinc-50">
      <ClientNav email={user.email ?? ""} />
      {children}
    </div>
  );
}
