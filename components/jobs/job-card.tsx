import Link from "next/link";
import { formatCurrency, formatPublishedAt } from "@/lib/jobs";
import type { PublicJob } from "@/lib/jobs";

type JobCardProps = {
  job: PublicJob;
};

export function JobCard({ job }: JobCardProps) {
  const isDestaque = !!job.empresa.planoAtivo;
  const isVerificada = !!job.empresa.planoAtivo;

  return (
    <Link
      className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft"
      href={`/vagas/${job.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-brand-700">{job.empresa.nome}</p>
            {isVerificada && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                ✓ Verificada
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 transition group-hover:text-brand-700">
            {job.titulo}
          </h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {isDestaque && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
              ★ Destaque
            </span>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
            {job.tipoValor}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Local</p>
          <p className="mt-1 font-medium text-slate-800">
            {job.cidade}, {job.estado}
          </p>
          <p className="text-slate-500">{job.bairro}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Valor</p>
          <p className="mt-1 font-medium text-slate-800">{formatCurrency(job.valor, job.tipoValor)}</p>
          <p className="text-slate-500">{job.horario}</p>
        </div>
      </div>

      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{job.descricao}</p>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5 text-sm text-slate-500">
        <span>Publicado em {formatPublishedAt(job.createdAt)}</span>
        <span className="font-semibold text-brand-700">Ver detalhes</span>
      </div>
    </Link>
  );
}
