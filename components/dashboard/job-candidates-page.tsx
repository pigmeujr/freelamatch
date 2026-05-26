"use client";

import { notFound } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { formatPublishedAt } from "@/lib/jobs";

function statusClasses(status: "pendente" | "aceita" | "recusada") {
  if (status === "aceita") return "bg-emerald-100 text-emerald-700";
  if (status === "recusada") return "bg-rose-100 text-rose-700";
  return "bg-amber-100 text-amber-700";
}

export function JobCandidatesPage({ jobId }: { jobId: string }) {
  const { isAuthenticated } = useDashboardGuard();
  const { getApplicationsByJobId, getJobById, updateApplicationStatus } = useDashboardStore();
  const job = getJobById(jobId);
  const candidates = getApplicationsByJobId(jobId);

  if (!isAuthenticated) {
    return null;
  }

  if (!job) {
    notFound();
  }

  return (
    <DashboardShell
      title="Candidatos da vaga"
      description="Avalie freelancers que se candidataram, responda rapidamente e acompanhe o status de cada candidatura em tempo real no mock local."
    >
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-100 pb-6">
          <p className="text-sm font-medium text-brand-700">Vaga selecionada</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">{job.titulo}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{job.descricao}</p>
          <p className="mt-4 text-sm text-slate-500">Publicada em {formatPublishedAt(job.createdAt)}</p>
        </div>

        <div className="mt-6 space-y-4">
          {candidates.length > 0 ? (
            candidates.map(({ application, freelancer }) => (
              <article key={application.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(application.status)}`}>
                        {application.status}
                      </span>
                      <span className="text-sm text-slate-500">
                        {freelancer?.cidade}, {freelancer?.estado}
                      </span>
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-950">{freelancer?.nome ?? "Freelancer"}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{application.mensagem}</p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <button
                      className="inline-flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-4 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      onClick={() => updateApplicationStatus(application.id, "aceita")}
                      type="button"
                    >
                      Aceitar
                    </button>
                    <button
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                      onClick={() => updateApplicationStatus(application.id, "recusada")}
                      type="button"
                    >
                      Recusar
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <h3 className="text-xl font-semibold text-slate-950">Ainda não há candidaturas</h3>
              <p className="mt-3 text-sm text-slate-600">Quando novos freelancers se candidatarem, eles aparecerão aqui.</p>
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}