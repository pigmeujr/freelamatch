"use client";

import { useState } from "react";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { formatCurrency } from "@/lib/jobs";
import type { MockJob } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ApplyJobModalProps = {
  job: MockJob;
  onClose: () => void;
};

export function ApplyJobModal({ job, onClose }: ApplyJobModalProps) {
  const { currentFreelancer, applyToJob, freelancerApplications } = useDashboardStore();
  const [message, setMessage] = useState(currentFreelancer?.mensagemPadrao ?? "");
  const [submitted, setSubmitted] = useState(false);

  const alreadyApplied = freelancerApplications.some((app) => app.vagaId === job.id);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    const result = applyToJob(job.id, message.trim());
    if (result) setSubmitted(true);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {submitted ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
              ✓
            </div>
            <h2 className="text-xl font-semibold text-slate-950">Candidatura enviada!</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Sua candidatura para <strong>{job.titulo}</strong> foi enviada com sucesso. Acompanhe o status em{" "}
              <span className="font-semibold text-brand-700">Minhas candidaturas</span>.
            </p>
            <Button className="mt-6 w-full" onClick={onClose} type="button">
              Fechar
            </Button>
          </div>
        ) : alreadyApplied ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
              !
            </div>
            <h2 className="text-xl font-semibold text-slate-950">Já candidatado</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Você já se candidatou à vaga <strong>{job.titulo}</strong>. Acompanhe o status em Minhas candidaturas.
            </p>
            <button
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              onClick={onClose}
              type="button"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 pb-5">
              <p className="text-sm font-medium text-brand-700">{job.empresa.nome}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950">{job.titulo}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                  {job.cidade}, {job.estado}
                </span>
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-600">
                  {formatCurrency(job.valor, job.tipoValor)}
                </span>
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs text-slate-600">{job.horario}</span>
              </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Mensagem para a empresa</span>
                <Textarea
                  maxLength={500}
                  minLength={10}
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Apresente-se e destaque sua experiência relevante para esta vaga..."
                  required
                  rows={4}
                  value={message}
                />
                <p className="text-right text-xs text-slate-400">{message.length}/500</p>
              </label>

              <div className="flex gap-3">
                <button
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  onClick={onClose}
                  type="button"
                >
                  Cancelar
                </button>
                <Button className="flex-1" disabled={message.trim().length < 10} type="submit">
                  Enviar candidatura
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
