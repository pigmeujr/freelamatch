import type { Metadata } from "next";
import { PlansPage } from "@/components/plans/plans-page";

export const metadata: Metadata = {
  title: "Planos para Empresas",
  description:
    "Compare os planos do FreelaMatch: Gratuito, Starter e Pro. Publique vagas, acesse WhatsApp dos candidatos e destaque sua empresa nas buscas.",
  openGraph: {
    title: "Planos para Empresas — FreelaMatch",
    description:
      "Compare os planos do FreelaMatch: Gratuito, Starter e Pro. Publique vagas freelancer e contrate profissionais locais.",
  },
  alternates: {
    canonical: "/planos",
  },
};

export default function PlanosPage() {
  return <PlansPage />;
}
