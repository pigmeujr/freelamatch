"use client";

import { FreelancerShell } from "@/components/dashboard/freelancer-shell";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { formatPublishedAt } from "@/lib/jobs";

type StatusKey = "pendente" | "aceita" | "recusada";

const statusMap: Record<StatusKey, { label: string; classes: string }> = {
  pendente: { label: "Pendente", classes: "bg-amber-100 text-amber-700" },
  aceita: { label: "Aceita", classes: "bg-emerald-100 text-emerald-700" },
  recusada: { label: "Recusada", classes: "bg-red-100 text-red-700" },
};

export function FreelancerApplicationsPage() {
  const { isAuthenticated } = useDashboardGuard("freelancer");
  const { freelancerApplications, jobs } = useDashboardStore();

  if (!isAuthenticated) {
    return null;
  }

  const sorted = [...freelancerApplications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <FreelancerShell
      title="Minhas candidaturas"
      description="Acompanhe todas as candidaturas que você enviou, com o status atualizado de cada processo."
    >
      {sorted.length === 0 ? (
        <div className="rounded-[32px] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-900">Nenhuma candidatura enviada ainda</p>
          <p className="mt-2 text-sm text-slate-500">
            Acesse <span className="font-semibold text-brand-700">Buscar Vagas</span> e candidate-se às oportunidades disponíveis.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((application) => {
            const job = jobs.find((j) => j.id === application.vagaId);
            const statusInfo = statusMap[application.status];

            return (
              <article
                key={application.id}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusInfo.classes}`}>
                        {statusInfo.label}
                      </span>
                      <span className="text-sm text-slate-500">
                        Enviada em {formatPublishedAt(application.createdAt)}
                      </span>
                    </div>

                    {job ? (
                      <>
                        <p className="mt-3 text-sm font-medium text-brand-700">{job.empresa.nome}</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-950">{job.titulo}</h3>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="rounded-xl bg-slate-50 px-3 py-1.5">
                            {job.cidade}, {job.estado}
                          </span>
                          <span className="rounded-xl bg-slate-50 px-3 py-1.5">{job.horario}</span>
                        </div>
                      </>
                    ) : (
                      <p className="mt-3 text-sm text-slate-500 italic">Vaga não encontrada</p>
                    )}

                    <div className="mt-4 rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                        Sua mensagem
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{application.mensagem}</p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {application.status === "pendente" && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
                        <p className="text-xs font-semibold text-amber-700">Aguardando</p>
                        <p className="mt-1 text-xs text-amber-600">resposta</p>
                      </div>
                    )}
                    {application.status === "aceita" && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center">
                        <p className="text-xs font-semibold text-emerald-700">Parabéns!</p>
                        <p className="mt-1 text-xs text-emerald-600">selecionado</p>
                      </div>
                    )}
                    {application.status === "recusada" && (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center">
                        <p className="text-xs font-semibold text-red-700">Não</p>
                        <p className="mt-1 text-xs text-red-600">selecionado</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </FreelancerShell>
  );
}
