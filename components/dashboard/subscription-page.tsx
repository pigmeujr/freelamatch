"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { plans, getPlanById } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

type SubscriptionPageProps = {
  selectedPlanId: string | null;
};

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(dateStr));
}

function PlanBadge({ planId }: { planId: PlanId }) {
  const colors: Record<PlanId, string> = {
    gratuito: "bg-slate-100 text-slate-700",
    starter: "bg-brand-100 text-brand-700",
    pro: "bg-amber-100 text-amber-700",
  };
  const labels: Record<PlanId, string> = {
    gratuito: "Gratuito",
    starter: "Starter",
    pro: "Pro",
  };
  return (
    <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", colors[planId])}>
      {labels[planId]}
    </span>
  );
}

export function SubscriptionPage({ selectedPlanId }: SubscriptionPageProps) {
  const { isAuthenticated } = useDashboardGuard();
  const { currentCompany, currentPlan, activateSubscription, cancelSubscription } = useDashboardStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState<PlanId | null>(null);

  const planToCheckout = getPlanById(selectedPlanId as PlanId | null);

  if (!isAuthenticated) return null;

  // ── Success state after activation ──────────────────────────────
  if (success && activatedPlan) {
    const newPlan = getPlanById(activatedPlan);
    return (
      <DashboardShell
        title="Assinatura ativada"
        description="Seu plano foi ativado com sucesso. Agora você pode publicar vagas e aproveitar todos os benefícios."
      >
        <div className="rounded-[32px] border border-emerald-200 bg-emerald-50 p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✓
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-emerald-900">Plano {newPlan?.nome} ativado!</h2>
          <p className="mt-3 text-sm leading-6 text-emerald-700">
            Sua assinatura foi processada com sucesso. Você já pode publicar vagas e atrair freelancers qualificados.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
              href="/dashboard/empresa/nova-vaga"
            >
              Publicar primeira vaga
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              href="/dashboard/empresa"
            >
              Ir para o dashboard
            </Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // ── Already has a paid plan: management view ─────────────────────────
  if (currentPlan.id !== "gratuito" && !planToCheckout) {
    const activatedAt = currentCompany?.assinaturaAtivadaEm;

    return (
      <DashboardShell
        title="Assinatura"
        description="Gerencie seu plano atual, troque de plano ou cancele a assinatura."
      >
        <div className="space-y-6">
          {/* Current plan card */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Plano atual</p>
                <div className="mt-3 flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-slate-900">Plano {currentPlan.nome}</h2>
                  <PlanBadge planId={currentPlan.id} />
                </div>
                <p className="mt-2 text-slate-600">{currentPlan.descricao}</p>
                {activatedAt && (
                  <p className="mt-3 text-sm text-slate-500">
                    Ativo desde {formatDate(activatedAt)}
                  </p>
                )}
              </div>
              <div className="rounded-[20px] border border-slate-100 bg-slate-50 px-6 py-4 text-right">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Cobrança mensal</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">R${currentPlan.preco}</p>
                <p className="text-xs text-slate-400">/mês</p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-6 border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Incluído no seu plano</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {currentPlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Badges */}
            {(currentPlan.destaque || currentPlan.verificada) && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                {currentPlan.destaque && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    ★ Vagas com badge Destaque
                  </span>
                )}
                {currentPlan.verificada && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    ✓ Empresa verificada no perfil
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
              href="/planos"
            >
              Trocar plano
            </Link>

            {!showCancelConfirm ? (
              <button
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                onClick={() => setShowCancelConfirm(true)}
                type="button"
              >
                Cancelar assinatura
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-3">
                <p className="text-sm text-red-700">Confirma o cancelamento?</p>
                <button
                  className="inline-flex h-9 items-center justify-center rounded-xl bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  disabled={isCancelling}
                  onClick={async () => {
                    setIsCancelling(true);
                    await cancelSubscription();
                    setIsCancelling(false);
                    setShowCancelConfirm(false);
                  }}
                  type="button"
                >
                  {isCancelling ? "Cancelando..." : "Confirmar"}
                </button>
                <button
                  className="text-xs font-medium text-red-500 hover:text-red-700"
                  onClick={() => setShowCancelConfirm(false)}
                  type="button"
                >
                  Voltar
                </button>
              </div>
            )}
          </div>
        </div>
      </DashboardShell>
    );
  }

  // ── Checkout view: activate a plan ──────────────────────────────
  const checkoutPlan = planToCheckout ?? plans[1]; // Default to Pro

  async function handleConfirm() {
    setIsLoading(true);
    await activateSubscription(checkoutPlan.id);
    setActivatedPlan(checkoutPlan.id);
    setIsLoading(false);
    setSuccess(true);
  }

  return (
    <DashboardShell
      title="Assinar plano"
      description="Confirme seu plano e ative sua assinatura. Pagamento 100% simulado nesta versão — integração com Mercado Pago em breve."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Plan summary */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Resumo do plano</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Plano {checkoutPlan.nome}</h2>
              <p className="mt-1 text-sm text-slate-600">{checkoutPlan.descricao}</p>
            </div>
            <PlanBadge planId={checkoutPlan.id} />
          </div>

          <div className="mt-6 rounded-[20px] bg-slate-50 px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Plano {checkoutPlan.nome}</span>
              <span className="font-semibold text-slate-900">R${checkoutPlan.preco}/mês</span>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Total mensal</span>
              <span className="text-xl font-bold text-slate-900">R${checkoutPlan.preco}</span>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {checkoutPlan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 text-xs">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-slate-400">
            Cancele a qualquer momento. Sem multa, sem fidelidade.
          </p>
        </div>

        {/* Mock payment form */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Dados de pagamento</p>
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Modo simulação ativo — nenhum valor será cobrado. Integração com Mercado Pago em breve.
          </div>

          <form
            className="mt-6 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
          >
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Número do cartão</span>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 focus:outline-none"
                disabled
                placeholder="•••• •••• •••• ••••"
                type="text"
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">Validade</span>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 focus:outline-none"
                  disabled
                  placeholder="MM/AA"
                  type="text"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-700">CVV</span>
                <input
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 focus:outline-none"
                  disabled
                  placeholder="•••"
                  type="text"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Nome no cartão</span>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 focus:outline-none"
                disabled
                placeholder="Nome como aparece no cartão"
                type="text"
              />
            </label>

            <button
              className="inline-flex h-13 w-full items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Processando..." : `Confirmar assinatura — R$${checkoutPlan.preco}/mês`}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
            </svg>
            Pagamento seguro via Mercado Pago (em breve)
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
