import { ReactNode } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="user">
      <DashboardShell role="user">{children}</DashboardShell>
    </RoleGuard>
  );
}
