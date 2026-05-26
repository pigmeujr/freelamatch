"use client";

import { useMemo, useState } from "react";
import { FreelancerShell } from "@/components/dashboard/freelancer-shell";
import { ApplyJobModal } from "@/components/dashboard/apply-job-modal";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { formatCurrency, formatPublishedAt } from "@/lib/jobs";
import type { ValorType } from "@/lib/mock-data";

export function FreelancerJobsPage() {
  const { isAuthenticated } = useDashboardGuard("freelancer");
  const { jobs, currentFreelancer, freelancerApplications } = useDashboardStore();

  const [cityFilter, setCityFilter] = useState(currentFreelancer?.cidade ?? "");
  const [typeFilter, setTypeFilter] = useState<ValorType | "">("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        if (!job.ativa) return false;
        if (
          cityFilter &&
          !job.cidade.toLowerCase().includes(cityFilter.toLowerCase()) &&
          !job.estado.toLowerCase().includes(cityFilter.toLowerCase())
        ) {
          return false;
        }
        if (typeFilter && job.tipoValor !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [jobs, cityFilter, typeFilter]);

  const selectedJob = selectedJobId ? (jobs.find((j) => j.id === selectedJobId) ?? null) : null;
  const appliedJobIds = new Set(freelancerApplications.map((app) => app.vagaId));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <FreelancerShell
      title="Buscar vagas"
      description="Encontre oportunidades ativas filtrando por cidade ou tipo de contratação. Candidate-se diretamente pelo painel."
    >
      {/* Filtros */}
      <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="mb-4 text-sm font-semibold text-slate-700">Filtrar vagas</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Cidade ou estado
            <input
              className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              onChange={(e) => setCityFilter(e.target.value)}
              placeholder="Ex: São Paulo, SP…"
              type="text"
              value={cityFilter}
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Tipo de valor
            <select
              className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              onChange={(e) => setTypeFilter(e.target.value as ValorType | "")}
              value={typeFilter}
            >
              <option value="">Todos os formatos</option>
              <option value="dia">Por dia</option>
              <option value="hora">Por hora</option>
              <option value="projeto">Por projeto</option>
            </select>
          </label>
        </div>
      </div>

      {/* Listagem */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-base font-semibold text-slate-900">Nenhuma vaga encontrada</p>
            <p className="mt-2 text-sm text-slate-500">
              Tente ajustar os filtros para ver mais oportunidades.
            </p>
            <button
              className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800"
              onClick={() => {
                setCityFilter("");
                setTypeFilter("");
              }}
              type="button"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const applied = appliedJobIds.has(job.id);

            return (
              <article
                key={job.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Ativa
                      </span>
                      {applied && (
                        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
                          Candidatura enviada
                        </span>
                      )}
                      <span className="text-sm text-slate-500">
                        Publicada em {formatPublishedAt(job.createdAt)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-brand-700">{job.empresa.nome}</p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-950">{job.titulo}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{job.descricao}</p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                        {formatCurrency(job.valor, job.tipoValor)}
                      </span>
                      <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                        {job.cidade}, {job.estado}
                      </span>
                      <span className="rounded-2xl bg-slate-50 px-3 py-2 text-sm">{job.horario}</span>
                    </div>

                    {job.requisitos.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {job.requisitos.map((req) => (
                          <span
                            key={req}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <button
                      className={
                        applied
                          ? "inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-500 cursor-not-allowed"
                          : "inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
                      }
                      disabled={applied}
                      onClick={() => !applied && setSelectedJobId(job.id)}
                      type="button"
                    >
                      {applied ? "Já candidatado" : "Candidatar-se"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {selectedJob && (
        <ApplyJobModal job={selectedJob} onClose={() => setSelectedJobId(null)} />
      )}
    </FreelancerShell>
  );
}
