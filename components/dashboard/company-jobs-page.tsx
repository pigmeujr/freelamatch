"use client";

import { CompanyJobsList } from "@/components/dashboard/company-jobs-list";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";

export function CompanyJobsPage() {
  const { isAuthenticated } = useDashboardGuard();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell
      title="Minhas vagas"
      description="Consulte todas as vagas publicadas pela empresa, acompanhe o status e acesse rapidamente edição ou análise de candidatos."
    >
      <CompanyJobsList />
    </DashboardShell>
  );
}