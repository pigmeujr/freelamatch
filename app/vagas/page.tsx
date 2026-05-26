import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JobCard } from "@/components/jobs/job-card";
import { JobsFilters } from "@/components/jobs/jobs-filters";
import { getAvailableStates, getPublicJobs } from "@/lib/jobs";
import type { ValorType } from "@/lib/mock-data";

type VagasPageProps = {
  searchParams?: {
    cidade?: string;
    estado?: string;
    tipo?: ValorType;
  };
};

export function generateMetadata({ searchParams }: VagasPageProps): Metadata {
  const cidade = searchParams?.cidade;
  const estado = searchParams?.estado;

  if (cidade) {
    const locationStr = estado ? `${cidade}, ${estado}` : cidade;
    return {
      title: `Vagas Freelancer em ${locationStr}`,
      description: `Encontre vagas freelancer em ${locationStr}. Trabalhos pagos por dia, hora ou projeto para profissionais autônomos.`,
      alternates: { canonical: `/vagas?cidade=${encodeURIComponent(cidade)}` },
    };
  }

  return {
    title: "Vagas Freelancer",
    description:
      "Encontre vagas freelancer por cidade no Brasil. Trabalhos pagos por dia, hora ou projeto. Cadastro gratuito para freelancers.",
    alternates: { canonical: "/vagas" },
  };
}

export default function VagasPage({ searchParams }: VagasPageProps) {
  const cidade = searchParams?.cidade ?? "";
  const estado = searchParams?.estado ?? "";
  const tipo = searchParams?.tipo ?? "";
  const jobs = getPublicJobs({
    cidade,
    estado,
    tipoValor: tipo,
  });
  const availableStates = getAvailableStates();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
                Vagas abertas agora
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Encontre vagas freelancer por cidade, bairro e formato de pagamento.
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Filtre por cidade, estado e tipo de valor para encontrar a oportunidade certa. Novos projetos todos os
                dias.
              </p>
            </div>

            <div className="mt-8">
              <JobsFilters initialCity={cidade} initialState={estado} initialType={tipo} states={availableStates} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-brand-700">Ordenação automática</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">Mais recentes primeiro</h2>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              {jobs.length} vaga{jobs.length === 1 ? "" : "s"} encontrada{jobs.length === 1 ? "" : "s"}
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900">Nenhuma vaga encontrada</h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                Tente ajustar a cidade, o estado ou o tipo de valor para ampliar a busca.
              </p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
