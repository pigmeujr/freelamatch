"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";

export function useDashboardGuard(requiredRole?: "empresa" | "freelancer") {
  const router = useRouter();
  const pathname = usePathname();
  const { session } = useDashboardStore();

  useEffect(() => {
    if (!session.isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole && session.role !== requiredRole) {
      router.replace(session.role === "empresa" ? "/dashboard/empresa" : "/dashboard/freelancer");
    }
  }, [pathname, router, session.isAuthenticated, session.role, requiredRole]);

  return {
    isAuthenticated: session.isAuthenticated && (!requiredRole || session.role === requiredRole),
  };
}
