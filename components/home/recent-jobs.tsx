import { JobCard } from "@/components/jobs/job-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getRecentJobs } from "@/lib/jobs";

export function RecentJobs() {
  const jobs = getRecentJobs(3);

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