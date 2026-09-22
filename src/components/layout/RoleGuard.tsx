"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import { ChoppaMark } from "@/components/brand/ChoppaMark";

export function RoleGuard({ role, children }: { role: Role; children: ReactNode }) {
  const { ready, session } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== role) {
      router.replace(session.role === "seller" ? "/seller" : "/dashboard");
    }
  }, [ready, session, role, router]);

  if (!ready || !session || session.role !== role) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-choppa-cream">
        <ChoppaMark size={56} animated className="text-choppa-red" />
        <p className="text-sm font-medium text-choppa-ink-soft">Loading Choppa…</p>
      </div>
    );
  }

  return <>{children}</>;
}
