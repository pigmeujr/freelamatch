import type { MetadataRoute } from "next";
import { mockJobs } from "@/lib/mock-data";
import { getAvailableCities } from "@/lib/jobs";

const BASE_URL = "https://www.freelamatch.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const jobEntries: MetadataRoute.Sitemap = mockJobs
    .filter((job) => job.ativa)
    .map((job) => ({
      url: `${BASE_URL}/vagas/${job.id}`,
      lastModified: new Date(job.createdAt),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const cityEntries: MetadataRoute.Sitemap = getAvailableCities().map(({ slug }) => ({
    url: `${BASE_URL}/vagas/cidade/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/vagas`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/planos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/cadastro/empresa`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/cadastro/freelancer`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...jobEntries,
    ...cityEntries,
  ];
}
