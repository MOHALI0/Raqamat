"use client";

import { LayoutProvider } from "@/src/context/LayoutProvider";
import { PageMetaProvider } from "@/src/context/PageMetaProvider";
import { DashboardLayoutShell } from "@/src/components/layout/DashboardLayoutShell";
import { RoleGuard } from "@/src/components/auth/RoleGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <PageMetaProvider>
        <RoleGuard>
          <DashboardLayoutShell>{children}</DashboardLayoutShell>
        </RoleGuard>
      </PageMetaProvider>
    </LayoutProvider>
  );
}
