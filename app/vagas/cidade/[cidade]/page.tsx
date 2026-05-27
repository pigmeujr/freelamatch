import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JobCard } from "@/components/jobs/job-card";
import { fetchCityBySlug, fetchJobsBySlug } from "@/lib/jobs-server";

type CidadePageProps = {
  params: {
    cidade: string;
  };
};

export async function generateMetadata({ params }: CidadePageProps): Promise<Metadata> {
  const city = await fetchCityBySlug(params.cidade);

  if (!city) {
    return { title: "Cidade não encontrada" };
  }

  const title = `Vagas Freelancer em ${city.nome}`;
  const description = `Encontre vagas freelancer em ${city.nome}, ${city.estado}. Trabalhos pagos por dia, hora ou projeto para profissionais autônomos locais.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — FreelaMatch`,
      description,
    },
    alternates: {
      canonical: `/vagas/cidade/${params.cidade}`,
    },
  };
}

export default async function CidadePage({ params }: CidadePageProps) {
  const city = await fetchCityBySlug(params.cidade);

  if (!city) {
    notFound();
  }

  const jobs = await fetchJobsBySlug(params.cidade);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Vagas Freelancer em ${city.nome}`,
    description: `Lista de vagas freelancer disponíveis em ${city.nome}, ${city.estado}`,
    numberOfItems: jobs.length,
    itemListElement: jobs.map((job, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "JobPosting",
        title: job.titulo,
        description: job.descricao,
        datePosted: job.createdAt,
        hiringOrganization: { "@type": "Organization", name: job.empresa.nome },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.cidade,
            addressRegion: job.estado,
            addressCountry: "BR",
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <section className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
              <Link className="text-sm font-medium text-brand-700 hover:text-brand-800" href="/vagas">
                ← Todas as vagas
              </Link>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
                  {city.estado}
                </span>
                <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-1 text-sm font-medium text-slate-600">
                  {jobs.length} vaga{jobs.length === 1 ? "" : "s"} ativa{jobs.length === 1 ? "" : "s"}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Vagas freelancer em{" "}
                <span className="text-brand-600">{city.nome}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Oportunidades para profissionais autônomos em {city.nome}, {city.estado}. Trabalhos pagos por dia, hora
                ou projeto.
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {jobs.length > 0 ? (
              <>
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-slate-900">Mais recentes primeiro</h2>
                  <Link
                    href="/vagas"
                    className="text-sm font-medium text-brand-700 hover:text-brand-800"
                  >
                    Ver todas as vagas →
                  </Link>
                </div>
                <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-3xl">
                  🏙️
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Nenhuma vaga em {city.nome} ainda
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                  Seja o primeiro a publicar uma oportunidade em {city.nome}! Empresas que publicam
                  vagas locais encontram ótimos profissionais autônomos rapidamente.
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/cadastro/empresa"
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Publicar vaga agora
                  </Link>
                  <Link
                    href="/vagas"
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Ver vagas em outras cidades
                  </Link>
                </div>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
