"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { plans } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { cn } from "@/lib/utils";

type FeatureRowProps = {
  label: string;
  gratuito: React.ReactNode;
  starter: React.ReactNode;
  pro: React.ReactNode;
};

function Yes() {
  return <span className="text-emerald-600 font-semibold">✓</span>;
}
function No() {
  return <span className="text-slate-300">—</span>;
}

function FeatureRow({ label, gratuito, starter, pro }: FeatureRowProps) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-3 pr-4 text-sm text-slate-700">{label}</td>
      <td className="py-3 px-4 text-center text-sm text-slate-700">{gratuito}</td>
      <td className="py-3 px-4 text-center text-sm text-slate-700">{starter}</td>
      <td className="py-3 px-4 text-center text-sm font-medium text-brand-700">{pro}</td>
    </tr>
  );
}

export function PlansPage() {
  const router = useRouter();
  const { session } = useDashboardStore();

  function handlePlanCta(planId: PlanId) {
    if (planId === "gratuito") {
      if (!session.isAuthenticated) {
        router.push("/login");
      } else {
        router.push("/dashboard/empresa");
      }
      return;
    }

    if (!session.isAuthenticated) {
      router.push(`/login?next=/dashboard/empresa/assinatura?plano=${planId}`);
      return;
    }

    if (session.role !== "empresa") return;

    router.push(`/dashboard/empresa/assinatura?plano=${planId}`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
              Planos para empresas
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Comece grátis.{" "}
              <span className="text-brand-600">Escale quando precisar.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Publique sua primeira vaga sem pagar nada. Faça upgrade para acessar o WhatsApp dos candidatos, mais vagas e destaque nas buscas.
            </p>
          </div>
        </section>

        {/* Plan cards */}
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative flex flex-col rounded-[32px] border p-8 shadow-sm transition",
                  plan.recomendado
                    ? "border-brand-500 bg-brand-600 text-white ring-2 ring-brand-500 ring-offset-2"
                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:shadow-md",
                )}
              >
                {plan.recomendado && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-amber-400 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-900">
                      Recomendado
                    </span>
                  </div>
                )}

                {/* Plan name & price */}
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.18em]",
                      plan.recomendado ? "text-brand-200" : "text-brand-700",
                    )}
                  >
                    {plan.nome}
                  </p>
                  <div className="mt-3 flex items-end gap-1">
                    {plan.gratuito ? (
                      <span
                        className={cn(
                          "text-5xl font-bold tracking-tight",
                          plan.recomendado ? "text-white" : "text-slate-900",
                        )}
                      >
                        Grátis
                      </span>
                    ) : (
                      <>
                        <span
                          className={cn(
                            "text-5xl font-bold tracking-tight",
                            plan.recomendado ? "text-white" : "text-slate-900",
                          )}
                        >
                          R${plan.preco}
                        </span>
                        <span
                          className={cn(
                            "mb-2 text-sm font-medium",
                            plan.recomendado ? "text-brand-200" : "text-slate-500",
                          )}
                        >
                          /mês
                        </span>
                      </>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-3 text-sm leading-6",
                      plan.recomendado ? "text-brand-100" : "text-slate-600",
                    )}
                  >
                    {plan.descricao}
                  </p>
                </div>

                {/* Features */}
                <ul className="mt-8 grow space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          plan.recomendado ? "bg-white/20" : "bg-brand-50",
                        )}
                      >
                        <svg
                          aria-hidden="true"
                          className={cn("h-3 w-3", plan.recomendado ? "text-white" : "text-brand-600")}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
                        </svg>
                      </span>
                      <span
                        className={cn(
                          "text-sm",
                          plan.recomendado ? "text-brand-50" : "text-slate-700",
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Badges info */}
                {(plan.destaque || plan.verificada) && (
                  <div
                    className={cn(
                      "mt-6 flex flex-wrap gap-2 border-t pt-5",
                      plan.recomendado ? "border-white/20" : "border-slate-100",
                    )}
                  >
                    {plan.destaque && (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          plan.recomendado
                            ? "bg-amber-400/20 text-amber-200"
                            : "bg-amber-50 text-amber-700",
                        )}
                      >
                        ★ Destaque nas buscas
                      </span>
                    )}
                    {plan.verificada && (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          plan.recomendado
                            ? "bg-emerald-400/20 text-emerald-200"
                            : "bg-emerald-50 text-emerald-700",
                        )}
                      >
                        ✓ Empresa verificada
                      </span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <button
                  className={cn(
                    "mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl text-sm font-semibold transition",
                    plan.recomendado
                      ? "bg-white text-brand-700 hover:bg-brand-50"
                      : plan.gratuito
                        ? "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                        : "bg-brand-600 text-white hover:bg-brand-700",
                  )}
                  onClick={() => handlePlanCta(plan.id)}
                  type="button"
                >
                  {plan.gratuito ? "Começar grátis" : `Assinar ${plan.nome}`}
                </button>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-16 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-semibold text-slate-900">Comparativo detalhado</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-3 pr-4 pl-6 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:pl-8">
                      Recurso
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Gratuito
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Starter
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody className="px-6 sm:px-8">
                  <tr className="border-t border-slate-100">
                    <td className="py-3 pr-4 pl-6 text-sm text-slate-700 sm:pl-8">Vagas ativas</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">1</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">5</td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-brand-700">Ilimitadas</td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 pr-4 pl-6 text-sm text-slate-700 sm:pl-8">Dias da vaga no ar</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">7 dias</td>
                    <td className="py-3 px-4 text-center text-sm text-slate-700">30 dias</td>
                    <td className="py-3 px-4 text-center text-sm font-medium text-brand-700">60 dias</td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 pr-4 pl-6 text-sm text-slate-700 sm:pl-8">Visualizar candidatos</td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                  </tr>
                  <tr className="border-t border-slate-100 bg-amber-50/40">
                    <td className="py-3 pr-4 pl-6 text-sm font-medium text-slate-800 sm:pl-8">
                      Acesso ao WhatsApp do candidato
                    </td>
                    <td className="py-3 px-4 text-center"><No /></td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 pr-4 pl-6 text-sm text-slate-700 sm:pl-8">Destaque nas buscas</td>
                    <td className="py-3 px-4 text-center"><No /></td>
                    <td className="py-3 px-4 text-center"><No /></td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 pr-4 pl-6 text-sm text-slate-700 sm:pl-8">Badge Verificada no perfil</td>
                    <td className="py-3 px-4 text-center"><No /></td>
                    <td className="py-3 px-4 text-center"><No /></td>
                    <td className="py-3 px-4 text-center"><Yes /></td>
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="py-3 pr-4 pl-6 pb-5 text-sm text-slate-700 sm:pl-8">Suporte</td>
                    <td className="py-3 px-4 pb-5 text-center text-sm text-slate-700">Básico</td>
                    <td className="py-3 px-4 pb-5 text-center text-sm text-slate-700">E-mail</td>
                    <td className="py-3 px-4 pb-5 text-center text-sm font-medium text-brand-700">Prioritário</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white px-6 py-8 text-center shadow-sm sm:px-10">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">Sem surpresas</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">Cancele quando quiser</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
              Planos pagos são mensais sem fidelidade. Vagas já publicadas permanecem ativas mesmo após cancelamento.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Sem taxa de setup
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Cancele a qualquer momento
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Suporte em português
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
