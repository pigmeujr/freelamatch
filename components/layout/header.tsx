"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/vagas", label: "Vagas" },
  { href: "/planos", label: "Planos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#cidades", label: "Cidades" },
  { href: "/#para-empresas", label: "Para empresas" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-3" href="/" onClick={() => setIsOpen(false)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 font-bold text-white">
              FM
            </span>
            <div>
              <p className="text-lg font-semibold text-slate-900">FreelaMatch</p>
              <p className="hidden text-xs text-slate-500 sm:block">Vagas freelancer por cidade</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={cn(
                  "text-sm font-medium transition hover:text-slate-900",
                  pathname === item.href ? "text-brand-700" : "text-slate-600",
                )}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro/freelancer"
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Cadastrar
              </Link>
            </div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
              onClick={() => setIsOpen(true)}
              type="button"
              aria-label="Abrir menu de navegacao"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
            type="button"
          />
          <nav className="absolute right-0 top-0 flex h-full w-72 max-w-[85vw] flex-col bg-white px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link className="flex items-center gap-2" href="/" onClick={() => setIsOpen(false)}>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                  FM
                </span>
                <p className="font-semibold text-slate-900">FreelaMatch</p>
              </Link>
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
                type="button"
                aria-label="Fechar menu"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <ul className="mt-8 flex-1 space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    className={cn(
                      "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition",
                      pathname === item.href
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                    )}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-slate-100 pt-6">
              <Link
                href="/login"
                className="flex h-11 w-full items-center justify-center rounded-2xl border border-slate-300 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                onClick={() => setIsOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/cadastro/freelancer"
                className="flex h-11 w-full items-center justify-center rounded-2xl bg-brand-600 text-sm font-semibold text-white transition hover:bg-brand-700"
                onClick={() => setIsOpen(false)}
              >
                Cadastrar-se gratis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
