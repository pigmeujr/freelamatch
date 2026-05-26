import { ButtonLink } from "@/components/ui/button-link";
import { SearchCityForm } from "@/components/home/search-city-form";

const highlights = [
  "Busca rápida por cidade e bairro",
  "Cadastro separado para empresas e freelancers",
  "Base pronta para monetização futura",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden" id="topo">
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[size:24px_24px]" />
      <div className="mx-auto grid max-w-6xl gap-16 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-brand-100 bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
            Plataforma de vagas freelancer por cidade no Brasil
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Encontre freelancers locais ou descubra vagas perto de você.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            O FreelaMatch conecta empresas que precisam contratar rápido com freelancers disponíveis em cidades de todo o Brasil.
          </p>
          <div className="mt-8">
            <SearchCityForm />
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/vagas" variant="secondary">
              Ver vagas abertas
            </ButtonLink>
            <ButtonLink href="/cadastro/empresa">Sou empresa</ButtonLink>
            <ButtonLink href="/cadastro/freelancer" variant="ghost">
              Sou freelancer
            </ButtonLink>
          </div>
          <ul className="mt-10 grid gap-3 text-sm text-slate-600 sm:grid-cols-3" id="para-empresas">
            {highlights.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft" id="como-funciona">
          <div className="rounded-3xl bg-slate-900 p-6 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Como funciona</p>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm text-brand-200">01</p>
                <h2 className="mt-2 text-xl font-semibold">Empresa publica a vaga</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Informe cidade, bairro, formato de pagamento e requisitos para atrair profissionais certos.
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-200">02</p>
                <h2 className="mt-2 text-xl font-semibold">Freelancer encontra oportunidades</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Perfis gratuitos com foco em localização ajudam na contratação rápida e regional.
                </p>
              </div>
              <div>
                <p className="text-sm text-brand-200">03</p>
                <h2 className="mt-2 text-xl font-semibold">Candidatura simplificada</h2>
                <p className="mt-2 text-sm text-slate-300">
                  A base desta fase já prepara autenticação, perfis e vagas para crescimento da plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}