"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { JobForm } from "@/components/dashboard/job-form";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";

export function NewJobPage() {
  const router = useRouter();
  const { isAuthenticated } = useDashboardGuard();
  const { createJob, canPublishJob, currentPlan, stats } = useDashboardStore();

  if (!isAuthenticated) {
    return null;
  }

  // Limite de vagas ativas atingido para o plano atual
  if (!canPublishJob) {
    const isGratuito = currentPlan.id === "gratuito";

    return (
      <DashboardShell
        title="Nova vaga"
        description="Limite de vagas ativas atingido para o seu plano atual."
      >
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
            ⚡
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-slate-900">
            {isGratuito
              ? "Limite do plano Gratuito atingido"
              : `Limite do plano ${currentPlan.nome} atingido`}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            {isGratuito
              ? `Você já tem ${stats.vagasAtivas} vaga ativa. O plano Gratuito permite apenas 1 vaga por vez. Faça upgrade para o Starter (até 5 vagas) ou Pro (ilimitadas) e também ganhe acesso ao WhatsApp dos candidatos.`
              : `Você já tem ${stats.vagasAtivas} de ${currentPlan.maxVagasAtivas} vagas ativas. Para publicar mais vagas, faça upgrade para o plano Pro (vagas ilimitadas).`}
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
              href={isGratuito ? "/dashboard/empresa/assinatura?plano=starter" : "/dashboard/empresa/assinatura?plano=pro"}
            >
              {isGratuito ? "Fazer upgrade para Starter" : "Fazer upgrade para Pro"}
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              href="/dashboard/empresa/vagas"
            >
              Gerenciar vagas ativas
            </Link>
          </div>
          <Link
            className="mt-4 inline-block text-sm text-slate-500 hover:text-brand-600 hover:underline"
            href="/planos"
          >
            Ver comparativo completo de planos →
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title="Nova vaga"
      description="Cadastre uma nova oportunidade com dados completos e estrutura já pronta para futura troca do mock por Supabase."
    >
      <JobForm
        submitLabel="Publicar vaga"
        successMessage="Vaga publicada com sucesso."
        onSubmit={(values) => {
          const job = createJob(values);
          window.setTimeout(() => {
            router.push(`/dashboard/empresa/vagas/${job.id}/editar`);
          }, 600);
        }}
      />
    </DashboardShell>
  );
}
