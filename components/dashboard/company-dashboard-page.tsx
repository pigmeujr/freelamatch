"use client";

import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { CompanyJobsList } from "@/components/dashboard/company-jobs-list";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";

export function CompanyDashboardPage() {
  const { isAuthenticated } = useDashboardGuard();
  const { stats, currentPlan } = useDashboardStore();

  if (!isAuthenticated) {
    return null;
  }

  const isGratuito = currentPlan.id === "gratuito";

  return (
    <DashboardShell
      title="Visão geral"
      description="Acompanhe suas vagas, o volume de candidaturas e mantenha a operação organizada."
    >
      {/* Upgrade banner — shown only on free plan */}
      {isGratuito && (
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-brand-100 bg-brand-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-brand-900">Você está no plano Gratuito</p>
            <p className="mt-1 text-sm text-brand-700">
              Faça upgrade para acessar o WhatsApp dos candidatos, publicar mais vagas e destacar sua empresa nas buscas.
            </p>
          </div>
          <Link
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
            href="/planos"
          >
            Ver planos
          </Link>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard label="Total de vagas" value={stats.totalVagas} helper="Vagas publicadas pela sua empresa." />
        <DashboardStatCard label="Candidaturas recebidas" value={stats.candidaturasRecebidas} helper="Somando todas as vagas desta conta." />
        <DashboardStatCard label="Vagas ativas" value={stats.vagasAtivas} helper="Oportunidades atualmente abertas para candidatos." />
      </section>

      {/* Plan info card — shown for paid plans */}
      {!isGratuito && (
        <div className="mt-6 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Plano ativo</p>
            <p className="mt-1 font-semibold text-slate-900">
              {currentPlan.nome}
              {currentPlan.maxVagasAtivas
                ? ` — até ${currentPlan.maxVagasAtivas} vagas ativas (${stats.vagasAtivas}/${currentPlan.maxVagasAtivas} usadas)`
                : " — vagas ilimitadas"}
            </p>
          </div>
          <Link
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            href="/dashboard/empresa/assinatura"
          >
            Gerenciar assinatura
          </Link>
        </div>
      )}

      <div className="mt-8">
        <CompanyJobsList />
      </div>
    </DashboardShell>
  );
}
