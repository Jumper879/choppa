import { ReactNode } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard role="seller">
      <DashboardShell role="seller">{children}</DashboardShell>
    </RoleGuard>
  );
}
