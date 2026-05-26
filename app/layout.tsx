import type { Metadata } from "next";
import { DashboardStoreProvider } from "@/components/providers/dashboard-store-provider";
import "./globals.css";

const BASE_URL = "https://www.freelamatch.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "FreelaMatch — Vagas Freelancer por Cidade no Brasil",
    template: "%s | FreelaMatch",
  },
  description:
    "Encontre vagas freelancer por cidade no Brasil ou contrate profissionais locais. Plataforma gratuita para freelancers e empresas de todo o país.",
  keywords: [
    "vagas freelancer",
    "trabalho freelancer",
    "freelancer brasil",
    "vagas por cidade",
    "contratar freelancer",
    "plataforma freelancer",
    "trabalho autonomo",
    "vagas temporarias",
  ],
  authors: [{ name: "FreelaMatch", url: BASE_URL }],
  creator: "FreelaMatch",
  publisher: "FreelaMatch",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "FreelaMatch",
    title: "FreelaMatch — Vagas Freelancer por Cidade no Brasil",
    description:
      "Encontre vagas freelancer por cidade no Brasil ou contrate profissionais locais. Plataforma gratuita para freelancers e empresas.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "FreelaMatch — Vagas Freelancer por Cidade no Brasil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelaMatch — Vagas Freelancer por Cidade no Brasil",
    description:
      "Encontre vagas freelancer por cidade no Brasil ou contrate profissionais locais.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans">
        <DashboardStoreProvider>{children}</DashboardStoreProvider>
      </body>
    </html>
  );
}
