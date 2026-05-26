import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/vagas", "/planos", "/cadastro/"],
        disallow: ["/dashboard/", "/login"],
      },
    ],
    sitemap: "https://www.freelamatch.com.br/sitemap.xml",
  };
}
