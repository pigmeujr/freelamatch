"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CompanyProfileForm } from "@/components/dashboard/company-profile-form";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";

export function CompanyProfilePage() {
  const { isAuthenticated } = useDashboardGuard();
  const { currentCompany, updateCompanyProfile } = useDashboardStore();

  if (!isAuthenticated || !currentCompany) {
    return null;
  }

  return (
    <DashboardShell
      title="Perfil da empresa"
      description="Edite as informações institucionais, contato e branding da sua empresa usando o estado local preparado para futura persistência real."
    >
      <CompanyProfileForm
        initialValues={{
          nome: currentCompany.nome,
          cnpj: currentCompany.cnpj ?? "",
          cep: currentCompany.cep ?? "",
          endereco: currentCompany.endereco ?? "",
          bairro: currentCompany.bairro ?? "",
          numero: currentCompany.numero ?? "",
          whatsapp: currentCompany.whatsapp ?? "",
          descricao: currentCompany.descricao ?? "",
          logoUrl: currentCompany.logoUrl ?? "",
        }}
        onSubmit={updateCompanyProfile}
      />
    </DashboardShell>
  );
}