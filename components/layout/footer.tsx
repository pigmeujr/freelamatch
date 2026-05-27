import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
                FM
              </span>
              <p className="font-semibold text-slate-900">FreelaMatch</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Conectando empresas e freelancers por cidade em todo o Brasil.
            </p>
            <a
              href="mailto:contato@freelamatch.com.br"
              className="mt-3 block text-sm text-brand-700 hover:text-brand-800"
            >
              contato@freelamatch.com.br
            </a>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Plataforma</p>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/vagas", label: "Ver vagas" },
                { href: "/planos", label: "Planos" },
                { href: "/cadastro/empresa", label: "Sou empresa" },
                { href: "/cadastro/freelancer", label: "Sou freelancer" },
                { href: "/login", label: "Entrar" },
              ].map((item) => (
                <li key={item.href}>
                  <Link className="text-sm text-slate-600 transition hover:text-slate-900" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Vagas por cidade</p>
            <p className="mt-4 text-sm text-slate-500">
              Encontre vagas freelancer na sua cidade em todo o Brasil.{" "}
              <Link href="/vagas" className="font-medium text-brand-700 hover:text-brand-800">
                Explorar vagas →
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 FreelaMatch. Todos os direitos reservados.</p>
          <a href="#topo" className="hover:text-slate-600">
            Voltar ao topo ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
