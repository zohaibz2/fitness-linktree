import { requireTrainer } from "@/lib/auth";
import { TrainerNav } from "./nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireTrainer();
  return (
    <div className="min-h-screen bg-paper">
      <TrainerNav email={user.email ?? ""} />
      {children}
    </div>
  );
}
