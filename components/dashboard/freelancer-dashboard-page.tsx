"use client";

import Link from "next/link";
import { FreelancerShell } from "@/components/dashboard/freelancer-shell";
import { DashboardStatCard } from "@/components/dashboard/dashboard-stat-card";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { formatCurrency, formatPublishedAt } from "@/lib/jobs";

export function FreelancerDashboardPage() {
  const { isAuthenticated } = useDashboardGuard("freelancer");
  const { freelancerStats, freelancerApplications, jobs, currentFreelancer } = useDashboardStore();

  if (!isAuthenticated) {
    return null;
  }

  const recentApplications = freelancerApplications.slice(0, 3);

  const availableJobs = jobs
    .filter((job) => {
      if (!job.ativa) return false;
      if (!currentFreelancer?.cidade) return true;
      return job.cidade.toLowerCase().includes(currentFreelancer.cidade.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <FreelancerShell
      title="Visão geral"
      description="Acompanhe vagas disponíveis na sua cidade, candidaturas enviadas e oportunidades aceitas, tudo em um só lugar."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Vagas disponíveis"
          value={freelancerStats.vagasDisponiveis}
          helper="Vagas ativas sem candidatura enviada."
        />
        <DashboardStatCard
          label="Candidaturas enviadas"
          value={freelancerStats.candidaturasEnviadas}
          helper="Total de candidaturas submetidas por você."
        />
        <DashboardStatCard
          label="Candidaturas aceitas"
          value={freelancerStats.candidaturasAceitas}
          helper="Vagas em que você foi selecionado."
        />
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Vagas recentes na cidade */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-end justify-between border-b border-slate-100 pb-5">
            <div>
              <p className="text-sm font-medium text-brand-700">Oportunidades</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                Vagas em {currentFreelancer?.cidade ?? "sua cidade"}
              </h2>
            </div>
            <Link
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
              href="/dashboard/freelancer/vagas"
            >
              Ver todas →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {availableJobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Nenhuma vaga ativa encontrada na sua cidade.
              </p>
            ) : (
              availableJobs.map((job) => (
                <article
                  key={job.id}
                  className="flex items-start justify-between gap-4 rounded-[20px] border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-brand-700">{job.empresa.nome}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-950">{job.titulo}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatCurrency(job.valor, job.tipoValor)} · {job.bairro}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Ativa
                  </span>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Candidaturas recentes */}
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-end justify-between border-b border-slate-100 pb-5">
            <div>
              <p className="text-sm font-medium text-brand-700">Histórico</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
                Candidaturas recentes
              </h2>
            </div>
            <Link
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
              href="/dashboard/freelancer/candidaturas"
            >
              Ver todas →
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {recentApplications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Você ainda não enviou nenhuma candidatura.{" "}
                <Link className="font-semibold text-brand-700" href="/dashboard/freelancer/vagas">
                  Buscar vagas
                </Link>
              </p>
            ) : (
              recentApplications.map((application) => {
                const job = jobs.find((j) => j.id === application.vagaId);
                const statusMap = {
                  pendente: { label: "Pendente", classes: "bg-amber-100 text-amber-700" },
                  aceita: { label: "Aceita", classes: "bg-emerald-100 text-emerald-700" },
                  recusada: { label: "Recusada", classes: "bg-red-100 text-red-700" },
                };
                const statusInfo = statusMap[application.status];

                return (
                  <article
                    key={application.id}
                    className="flex items-start justify-between gap-4 rounded-[20px] border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-brand-700">{job?.empresa.nome ?? "Empresa"}</p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                        {job?.titulo ?? "Vaga removida"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Enviada em {formatPublishedAt(application.createdAt)}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.classes}`}>
                      {statusInfo.label}
                    </span>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>
    </FreelancerShell>
  );
}
