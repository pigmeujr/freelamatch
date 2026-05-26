import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-20 sm:px-6">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-50">
            <span className="text-4xl font-bold text-brand-600">404</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Pagina nao encontrada
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-base leading-7 text-slate-600">
            A pagina que voce procura nao existe ou foi movida. Explore as vagas disponiveis ou volte para o inicio.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/vagas"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Ver vagas abertas
            </Link>
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Voltar ao inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
