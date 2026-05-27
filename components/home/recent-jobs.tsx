import Link from "next/link";
import { JobCard } from "@/components/jobs/job-card";
import { ButtonLink } from "@/components/ui/button-link";
import { fetchRecentJobs } from "@/lib/jobs-server";

export async function RecentJobs() {
  const jobs = await fetchRecentJobs(3);

  if (jobs.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-[32px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Seja o primeiro a publicar uma vaga
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
            A plataforma está pronta para conectar empresas e freelancers locais. Cadastre sua empresa e publique vagas
            gratuitamente.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/cadastro/empresa"
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Publicar vaga gratuitamente
            </Link>
            <Link
              href="/cadastro/freelancer"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Sou freelancer
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
            Vagas recentes
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Oportunidades novas entrando todos os dias
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Explore algumas vagas em destaque e encontre trabalhos por cidade, bairro e formato de pagamento.
          </p>
        </div>
        <ButtonLink href="/vagas" variant="secondary">
          Ver todas as vagas
        </ButtonLink>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
}
