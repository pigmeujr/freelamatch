"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";

export function useDashboardGuard(requiredRole?: "empresa" | "freelancer") {
  const router = useRouter();
  const pathname = usePathname();
  const { session, isLoading } = useDashboardStore();

  useEffect(() => {
    // Aguarda hidratação/init antes de verificar
    if (isLoading) return;

    if (!session.isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole && session.role !== requiredRole) {
      router.replace(session.role === "empresa" ? "/dashboard/empresa" : "/dashboard/freelancer");
    }
  }, [pathname, router, session.isAuthenticated, session.role, requiredRole, isLoading]);

  return {
    isAuthenticated: !isLoading && session.isAuthenticated && (!requiredRole || session.role === requiredRole),
    role: session.role,
  };
}
