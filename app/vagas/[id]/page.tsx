import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ButtonLink } from "@/components/ui/button-link";
import { fetchJobById } from "@/lib/jobs-server";
import { formatCurrency, formatPublishedAt } from "@/lib/jobs";

type VagaDetalhePageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({ params }: VagaDetalhePageProps): Promise<Metadata> {
  const job = await fetchJobById(params.id);

  if (!job) {
    return { title: "Vaga não encontrada" };
  }

  const title = `${job.titulo} em ${job.cidade}, ${job.estado}`;
  const description = `${job.empresa.nome} está contratando ${job.titulo} em ${job.cidade}. ${job.descricao.slice(0, 120)}...`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} — FreelaMatch`,
      description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} — FreelaMatch`,
      description,
    },
    alternates: {
      canonical: `/vagas/${job.id}`,
    },
  };
}

function getCompanyInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function VagaDetalhePage({ params }: VagaDetalhePageProps) {
  const job = await fetchJobById(params.id);

  if (!job) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.titulo,
    description: job.descricao,
    datePosted: job.createdAt,
    validThrough: new Date(new Date(job.createdAt).getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    employmentType: "CONTRACTOR",
    hiringOrganization: {
      "@type": "Organization",
      name: job.empresa.nome,
      description: job.empresa.descricao,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: job.endereco,
        addressLocality: job.cidade,
        addressRegion: job.estado,
        addressCountry: "BR",
      },
    },
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "BRL",
      value: {
        "@type": "QuantitativeValue",
        value: job.valor,
        unitText: job.tipoValor === "hora" ? "HOUR" : job.tipoValor === "dia" ? "DAY" : "MONTH",
      },
    },
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
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-16">
              <div>
                <Link className="text-sm font-medium text-brand-700 hover:text-brand-800" href="/vagas">
                  ← Voltar para vagas
                </Link>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
                    Publicada em {formatPublishedAt(job.createdAt)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700">
                    {job.tipoValor}
                  </span>
                </div>
                <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{job.titulo}</h1>
                <p className="mt-5 text-lg leading-8 text-slate-600">{job.descricao}</p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Valor</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(job.valor, job.tipoValor)}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.horario}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Local</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">
                      {job.cidade}, {job.estado}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {job.bairro}{job.endereco ? ` • ${job.endereco}` : ""}
                    </p>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-slate-900 text-lg font-bold text-white">
                      {getCompanyInitials(job.empresa.nome)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-brand-700">Empresa contratante</p>
                      <h2 className="mt-1 text-xl font-semibold text-slate-900">{job.empresa.nome}</h2>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">{job.empresa.descricao}</p>
                  <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Faça login para continuar com a candidatura e acompanhar o status desta vaga.
                  </div>
                  <div className="mt-6">
                    <ButtonLink href={`/login?next=/vagas/${job.id}`}>Candidatar-se</ButtonLink>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Descrição da oportunidade</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">{job.descricao}</p>

              {job.requisitos.length > 0 && (
                <>
                  <h3 className="mt-8 text-xl font-semibold text-slate-900">Requisitos</h3>
                  <ul className="mt-4 space-y-3">
                    {job.requisitos.map((requirement) => (
                      <li key={requirement} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-900 p-6 text-white shadow-soft">
              <p className="text-sm uppercase tracking-[0.16em] text-brand-200">Resumo rápido</p>
              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm text-brand-200">Horário</p>
                  <p className="mt-1 text-lg font-semibold">{job.horario}</p>
                </div>
                {(job.endereco || job.bairro) && (
                  <div>
                    <p className="text-sm text-brand-200">Endereço</p>
                    {job.endereco && <p className="mt-1 text-lg font-semibold">{job.endereco}</p>}
                    <p className="text-sm text-slate-300">
                      {job.bairro ? `${job.bairro} • ` : ""}{job.cidade}, {job.estado}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-brand-200">Empresa</p>
                  <p className="mt-1 text-lg font-semibold">{job.empresa.nome}</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
