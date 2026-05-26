"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard/empresa", label: "Visão Geral" },
  { href: "/dashboard/empresa/vagas", label: "Minhas Vagas" },
  { href: "/dashboard/empresa/nova-vaga", label: "Nova Vaga" },
  { href: "/dashboard/empresa/perfil", label: "Perfil" },
  { href: "/dashboard/empresa/assinatura", label: "Assinatura" },
];

type DashboardShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function DashboardShell({ title, description, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentCompany, currentPlan, logout } = useDashboardStore();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#f3f4f8] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-[280px] border-r border-slate-200 bg-slate-950 px-5 py-6 text-white transition-transform lg:sticky lg:translate-x-0",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between">
            <Link className="flex items-center gap-3" href="/dashboard/empresa">
              <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-brand-500 text-base font-bold text-white">
                FM
              </span>
              <div>
                <p className="font-semibold">FreelaMatch</p>
                <p className="text-xs text-slate-400">Painel da empresa</p>
              </div>
            </Link>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-slate-300 lg:hidden"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-300">Empresa</p>
            <p className="mt-3 text-lg font-semibold">{currentCompany?.nome ?? "Empresa"}</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{currentCompany?.descricao}</p>
            <div className="mt-3">
              {currentPlan && currentPlan.id !== "gratuito" ? (
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-300">
                  Plano {currentPlan.nome}
                </span>
              ) : (
                <Link
                  className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-400 hover:bg-white/20 transition"
                  href="/planos"
                  onClick={() => setIsOpen(false)}
                >
                  Plano Gratuito — fazer upgrade
                </Link>
              )}
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard/empresa" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                    isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white",
                  )}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className={cn("text-xs", isActive ? "text-brand-600" : "text-slate-500")}>→</span>
                </Link>
              );
            })}
          </nav>

          <button
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:bg-white/10"
            onClick={handleLogout}
            type="button"
          >
            Sair
          </button>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f3f4f8]/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm lg:hidden"
                  onClick={() => setIsOpen(true)}
                  type="button"
                >
                  ☰
                </button>
                <div>
                  <p className="text-sm font-medium text-brand-700">Área da empresa</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
                </div>
              </div>
              <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 text-right shadow-sm sm:block">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Conta ativa</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{currentCompany?.nome ?? "Empresa"}</p>
              </div>
            </div>
          </header>

          {isOpen ? (
            <button
              aria-label="Fechar menu"
              className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
              onClick={() => setIsOpen(false)}
              type="button"
            />
          ) : null}

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div className="mb-8 rounded-[32px] bg-white px-6 py-6 shadow-sm sm:px-8">
              <p className="text-sm leading-7 text-slate-600">{description}</p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}