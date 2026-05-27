import { createClient } from "@/lib/supabase/server";
import { slugifyCity, type JobFilters, type PublicJob } from "@/lib/jobs";

// =====================================================
// INTERNAL TYPES
// =====================================================

type SupabaseVagaRow = {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string;
  requisitos: string | null;
  valor: number | null;
  tipo_valor: "dia" | "hora" | "projeto" | null;
  horario: string | null;
  cidade: string;
  estado: string;
  bairro: string | null;
  ativa: boolean;
  created_at: string;
  empresas: {
    id: string;
    nome: string;
    descricao: string | null;
    logo_url: string | null;
    plano_ativo: boolean;
    endereco: string | null;
  } | null;
};

// =====================================================
// HELPERS
// =====================================================

function parseRequisitos(req: string | null): string[] {
  if (!req) return [];
  const lines = req.split("\n").map((r) => r.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  return req.split(",").map((r) => r.trim()).filter(Boolean);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function mapRowToPublicJob(row: SupabaseVagaRow): PublicJob {
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    requisitos: parseRequisitos(row.requisitos),
    valor: row.valor ?? 0,
    tipoValor: row.tipo_valor ?? "projeto",
    horario: row.horario ?? "",
    cidade: row.cidade,
    estado: row.estado,
    bairro: row.bairro ?? "",
    endereco: row.empresas?.endereco ?? "",
    createdAt: row.created_at,
    ativa: row.ativa,
    empresaId: row.empresa_id,
    empresa: {
      id: row.empresas?.id ?? "",
      nome: row.empresas?.nome ?? "Empresa",
      descricao: row.empresas?.descricao ?? "",
      logoUrl: row.empresas?.logo_url ?? null,
      planoAtivo: row.empresas?.plano_ativo ?? false,
    },
  };
}

const EMPRESA_SELECT = "*, empresas(id, nome, descricao, logo_url, plano_ativo, endereco)";

// =====================================================
// ASYNC SUPABASE FUNCTIONS (server-only — public pages)
// =====================================================

export async function fetchPublicJobs(filters: JobFilters = {}): Promise<PublicJob[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vagas")
      .select(EMPRESA_SELECT)
      .eq("ativa", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    const jobs = data.map((row) => mapRowToPublicJob(row as unknown as SupabaseVagaRow));

    const cidade = filters.cidade ? normalizeText(filters.cidade) : "";
    const estado = filters.estado ? filters.estado.trim().toLowerCase() : "";
    const tipoValor = filters.tipoValor ?? "";

    return jobs.filter((job) => {
      const matchesCity = cidade ? normalizeText(job.cidade).includes(cidade) : true;
      const matchesState = estado ? job.estado.toLowerCase() === estado : true;
      const matchesType = tipoValor ? job.tipoValor === tipoValor : true;
      return matchesCity && matchesState && matchesType;
    });
  } catch {
    return [];
  }
}

export async function fetchRecentJobs(limit = 6): Promise<PublicJob[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vagas")
      .select(EMPRESA_SELECT)
      .eq("ativa", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map((row) => mapRowToPublicJob(row as unknown as SupabaseVagaRow));
  } catch {
    return [];
  }
}

export async function fetchJobById(id: string): Promise<PublicJob | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vagas")
      .select(EMPRESA_SELECT)
      .eq("id", id)
      .eq("ativa", true)
      .maybeSingle();

    if (error || !data) return null;
    return mapRowToPublicJob(data as unknown as SupabaseVagaRow);
  } catch {
    return null;
  }
}

export async function fetchCityBySlug(
  slug: string,
): Promise<{ nome: string; estado: string } | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vagas")
      .select("cidade, estado")
      .eq("ativa", true);

    if (error || !data) return null;
    const match = data.find((row) => slugifyCity(row.cidade) === slug);
    return match ? { nome: match.cidade, estado: match.estado } : null;
  } catch {
    return null;
  }
}

export async function fetchJobsBySlug(slug: string): Promise<PublicJob[]> {
  try {
    const city = await fetchCityBySlug(slug);
    if (!city) return [];

    const supabase = createClient();
    const { data, error } = await supabase
      .from("vagas")
      .select(EMPRESA_SELECT)
      .eq("ativa", true)
      .eq("cidade", city.nome)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map((row) => mapRowToPublicJob(row as unknown as SupabaseVagaRow));
  } catch {
    return [];
  }
}

export async function fetchAvailableCities(): Promise<
  { slug: string; nome: string; estado: string }[]
> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vagas")
      .select("cidade, estado")
      .eq("ativa", true);

    if (error || !data) return [];

    const seen = new Set<string>();
    const cities: { slug: string; nome: string; estado: string }[] = [];
    for (const row of data) {
      const slug = slugifyCity(row.cidade);
      if (!seen.has(slug)) {
        seen.add(slug);
        cities.push({ slug, nome: row.cidade, estado: row.estado });
      }
    }
    return cities.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  } catch {
    return [];
  }
}
