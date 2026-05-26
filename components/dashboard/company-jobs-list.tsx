"use client";

import Link from "next/link";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { formatCurrency, formatPublishedAt } from "@/lib/jobs";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
          : "rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600"
      }
    >
      {active ? "Ativa" : "Inativa"}
    </span>
  );
}

export function CompanyJobsList() {
  const { companyJobs, toggleJobStatus, canPublishJob } = useDashboardStore();

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Minhas vagas</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Gerencie publicações e candidaturas</h2>
        </div>
        {canPublishJob ? (
          <Link
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700"
            href="/dashboard/empresa/nova-vaga"
          >
            Publicar nova vaga
          </Link>
        ) : (
          <Link
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-5 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
            href="/planos"
          >
            Upgrade para publicar mais vagas
          </Link>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {companyJobs.map((job) => (
          <article key={job.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge active={job.ativa} />
                  <span className="text-sm text-slate-500">Publicada em {formatPublishedAt(job.createdAt)}</span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{job.titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{job.descricao}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="rounded-2xl bg-white px-3 py-2">{formatCurrency(job.valor, job.tipoValor)}</span>
                  <span className="rounded-2xl bg-white px-3 py-2">
                    {job.cidade}, {job.estado}
                  </span>
                  <span className="rounded-2xl bg-white px-3 py-2">{job.horario}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  href={`/dashboard/empresa/vagas/${job.id}/editar`}
                >
                  Editar
                </Link>
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  href={`/dashboard/empresa/vagas/${job.id}/candidatos`}
                >
                  Ver candidatos
                </Link>
                <button
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                  onClick={() => toggleJobStatus(job.id)}
                  type="button"
                >
                  {job.ativa ? "Desativar" : "Reativar"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}