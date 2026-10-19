"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthProvider";
import { canAccessRoute, ROLE_HOME } from "@/src/lib/auth";
import { KpiSkeleton, ChartSkeleton } from "@/src/components/ui/Skeleton";

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!canAccessRoute(user.role, pathname)) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [user, loading, pathname, router]);

  if (loading || !user) {
    return (
      <div className="space-y-4 p-2">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <KpiSkeleton key={i} />
          ))}
        </div>
        <ChartSkeleton />
      </div>
    );
  }

  if (!canAccessRoute(user.role, pathname)) {
    return null;
  }

  return <>{children}</>;
}
