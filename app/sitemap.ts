import type { MetadataRoute } from "next";
import { fetchAvailableCities, fetchRecentJobs } from "@/lib/jobs-server";

const BASE_URL = "https://www.freelamatch.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [jobs, cities] = await Promise.all([
    fetchRecentJobs(100),
    fetchAvailableCities(),
  ]);

  const jobEntries: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${BASE_URL}/vagas/${job.id}`,
    lastModified: new Date(job.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityEntries: MetadataRoute.Sitemap = cities.map(({ slug }) => ({
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
