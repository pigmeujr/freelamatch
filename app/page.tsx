import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/home/hero";
import { RecentJobs } from "@/components/home/recent-jobs";

export const metadata: Metadata = {
  title: "FreelaMatch — Vagas Freelancer por Cidade no Brasil",
  description:
    "Encontre vagas freelancer por cidade no Brasil ou contrate profissionais locais. Plataforma gratuita para freelancers e empresas de todo o pais.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FreelaMatch — Vagas Freelancer por Cidade no Brasil",
    description:
      "Encontre vagas freelancer por cidade no Brasil ou contrate profissionais locais. Plataforma gratuita.",
    url: "/",
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <div id="cidades">
          <RecentJobs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
