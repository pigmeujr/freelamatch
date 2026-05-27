import { mockJobs, type MockJob, type ValorType } from "@/lib/mock-data";
import { estados } from "@/lib/estados";

export type { MockJob, ValorType };

export type JobFilters = {
  cidade?: string;
  estado?: string;
  tipoValor?: ValorType | "";
};

// =====================================================
// PUBLIC JOB TYPE (from Supabase)
// =====================================================

export type PublicJobEmpresa = {
  id: string;
  nome: string;
  descricao: string;
  logoUrl: string | null;
  planoAtivo: boolean;
};

export type PublicJob = {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  valor: number;
  tipoValor: ValorType;
  horario: string;
  cidade: string;
  estado: string;
  bairro: string;
  endereco: string;
  createdAt: string;
  ativa: boolean;
  empresaId: string;
  empresa: PublicJobEmpresa;
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export function slugifyCity(city: string): string {
  return city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

// Returns all 27 Brazilian states (siglas)
export function getAvailableStates(): string[] {
  return estados.map((e) => e.sigla);
}

// =====================================================
// LEGACY SYNC FUNCTIONS (dashboard / mock mode)
// =====================================================

function sortByRecent(jobs: MockJob[]) {
  return [...jobs].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getAvailableCities(): { slug: string; nome: string; estado: string }[] {
  const seen = new Set<string>();
  const result: { slug: string; nome: string; estado: string }[] = [];

  for (const job of mockJobs) {
    if (!job.ativa) continue;
    const slug = slugifyCity(job.cidade);
    if (!seen.has(slug)) {
      seen.add(slug);
      result.push({ slug, nome: job.cidade, estado: job.estado });
    }
  }

  return result.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function getCityBySlug(slug: string): { nome: string; estado: string } | null {
  const job = mockJobs.find((j) => j.ativa && slugifyCity(j.cidade) === slug);
  return job ? { nome: job.cidade, estado: job.estado } : null;
}

export function getJobsByCitySlug(slug: string): MockJob[] {
  return sortByRecent(mockJobs.filter((job) => job.ativa && slugifyCity(job.cidade) === slug));
}

export function getPublicJobs(filters: JobFilters = {}): MockJob[] {
  const cidade = filters.cidade ? normalizeText(filters.cidade) : "";
  const estado = filters.estado ? filters.estado.trim().toLowerCase() : "";
  const tipoValor = filters.tipoValor ?? "";

  return sortByRecent(mockJobs).filter((job) => {
    if (!job.ativa) return false;
    const matchesCity = cidade ? normalizeText(job.cidade).includes(cidade) : true;
    const matchesState = estado ? job.estado.toLowerCase() === estado : true;
    const matchesType = tipoValor ? job.tipoValor === tipoValor : true;
    return matchesCity && matchesState && matchesType;
  });
}

export function getRecentJobs(limit = 6): MockJob[] {
  return sortByRecent(mockJobs.filter((job) => job.ativa)).slice(0, limit);
}

export function getJobById(id: string): MockJob | null {
  return mockJobs.find((job) => job.id === id) ?? null;
}

// =====================================================
// FORMAT UTILITIES (used by public + dashboard)
// =====================================================

export function formatCurrency(value: number, tipoValor: ValorType) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

  return `${formattedValue} / ${tipoValor}`;
}

export function formatPublishedAt(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
