"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  mockApplications,
  mockCompanies,
  mockFreelancers,
  mockJobs,
  type CandidaturaStatus,
  type MockApplication,
  type MockCompany,
  type MockFreelancer,
  type MockJob,
} from "@/lib/mock-data";
import { getPlanById, getDefaultPlan } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import { paymentGateway } from "@/lib/payment";
import type {
  CandidateView,
  CompanyProfileFormValues,
  DashboardStoreContextValue,
  DashboardStoreState,
  FreelancerProfileFormValues,
  JobFormValues,
  MockSession,
} from "@/types/dashboard";
import type { Database } from "@/types/database";

// ─── Detecção de modo ──────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_KEY);

const STORAGE_KEY = "freelamatch.dashboard-store";
const DEFAULT_COMPANY_ID = "empresa-1";
const DEFAULT_FREELANCER_ID = "freelancer-1";

// ─── Tipos da DB ───────────────────────────────────────────────────────────

type EmpresaRow = Database["public"]["Tables"]["empresas"]["Row"];
type FreelancerRow = Database["public"]["Tables"]["freelancers"]["Row"];
type VagaRow = Database["public"]["Tables"]["vagas"]["Row"];
type CandidaturaRow = Database["public"]["Tables"]["candidaturas"]["Row"];
type SupabaseClient = ReturnType<typeof createClient>;

// ─── Mappers DB → Mock ─────────────────────────────────────────────────────

function mapEmpresa(row: EmpresaRow): MockCompany {
  return {
    id: row.id,
    nome: row.nome,
    descricao: row.descricao ?? "",
    logoUrl: row.logo_url ?? null,
    cnpj: row.cnpj,
    cep: row.cep ?? "",
    endereco: row.endereco ?? "",
    bairro: row.bairro ?? "",
    numero: row.numero ?? "",
    whatsapp: row.whatsapp ?? "",
    planoAtivo: null,
    assinaturaAtivadaEm: null,
  };
}

function mapFreelancer(row: FreelancerRow): MockFreelancer {
  return {
    id: row.id,
    nome: row.nome_completo,
    cidade: row.cidade,
    estado: row.estado,
    telefone: row.telefone ?? "",
    habilidades: row.habilidades ?? [],
    bio: row.bio ?? "",
  };
}

function mapVaga(row: VagaRow, empresa: MockCompany): MockJob {
  const requisitos = row.requisitos
    ? row.requisitos
        .split(/\n|,/)
        .map((r) => r.trim())
        .filter(Boolean)
    : [];
  return {
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    requisitos,
    valor: Number(row.valor) || 0,
    tipoValor: row.tipo_valor ?? "dia",
    horario: row.horario ?? "",
    cidade: row.cidade,
    estado: row.estado,
    bairro: row.bairro ?? "",
    endereco: `${row.bairro ?? ""}, ${row.cidade}`,
    createdAt: row.created_at,
    ativa: row.ativa,
    empresaId: row.empresa_id,
    empresa,
  };
}

function mapCandidatura(row: CandidaturaRow): MockApplication {
  return {
    id: row.id,
    vagaId: row.vaga_id,
    freelancerId: row.freelancer_id,
    mensagem: row.mensagem ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

// ─── Estado inicial ────────────────────────────────────────────────────────

const initialState: DashboardStoreState = {
  session: {
    isAuthenticated: false,
    role: "empresa",
    companyId: DEFAULT_COMPANY_ID,
    companyName: mockCompanies[0].nome,
    freelancerId: DEFAULT_FREELANCER_ID,
    freelancerName: mockFreelancers[0].nome,
  },
  companies: mockCompanies,
  jobs: mockJobs,
  freelancers: mockFreelancers,
  applications: mockApplications,
};

const DashboardStoreContext = createContext<DashboardStoreContextValue | null>(null);

function syncSessionCookie(session: MockSession) {
  if (typeof document === "undefined") return;
  if (session.isAuthenticated) {
    document.cookie = `freelamatch_mock_auth=${session.role}; path=/; max-age=2592000; samesite=lax`;
  } else {
    document.cookie = "freelamatch_mock_auth=; path=/; max-age=0; samesite=lax";
  }
}

function buildJob(values: JobFormValues, company: MockCompany, previousJob?: MockJob, idOverride?: string): MockJob {
  const requisitos = values.requisitos
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id: previousJob?.id ?? idOverride ?? `vaga-${Date.now()}`,
    titulo: values.titulo.trim(),
    descricao: values.descricao.trim(),
    requisitos,
    valor: Number(values.valor),
    tipoValor: values.tipoValor,
    horario: values.horario.trim(),
    cidade: values.cidade.trim(),
    estado: values.estado.trim().toUpperCase(),
    bairro: values.bairro.trim(),
    endereco: previousJob?.endereco ?? `${values.bairro.trim()}, ${values.cidade.trim()}`,
    createdAt: previousJob?.createdAt ?? new Date().toISOString(),
    ativa: previousJob?.ativa ?? true,
    empresaId: company.id,
    empresa: company,
  };
}

// ─── Carregamento de dados do Supabase ────────────────────────────────────

async function loadEmpresaData(supabase: any, userId: string): Promise<Partial<DashboardStoreState>> {
  const { data: empresaRowData } = await supabase.from("empresas").select("*").eq("id", userId).single();
  const empresaRow = empresaRowData as EmpresaRow | null;
  const { data: vagasRowsData } = await supabase
    .from("vagas")
    .select("*")
    .eq("empresa_id", userId)
    .order("created_at", { ascending: false });
  const vagasRows = (vagasRowsData ?? []) as VagaRow[];

  const empresa: MockCompany = empresaRow ? mapEmpresa(empresaRow) : { ...mockCompanies[0], id: userId };
  const jobs: MockJob[] = (vagasRows ?? []).map((v) => mapVaga(v, empresa));

  const vagaIds = jobs.map((j) => j.id);
  let candidaturas: CandidaturaRow[] = [];
  const freelancerMap: Record<string, MockFreelancer> = {};

  if (vagaIds.length > 0) {
    const { data: candsRaw } = await (supabase as any)
      .from("candidaturas")
      .select("*, freelancers(*)")
      .in("vaga_id", vagaIds);

    if (candsRaw) {
      candidaturas = candsRaw.map((c: any) => ({
        id: c.id,
        vaga_id: c.vaga_id,
        freelancer_id: c.freelancer_id,
        mensagem: c.mensagem,
        status: c.status,
        created_at: c.created_at,
      }));
      candsRaw.forEach((c: any) => {
        if (c.freelancers) {
          freelancerMap[c.freelancers.id] = mapFreelancer(c.freelancers as FreelancerRow);
        }
      });
    }
  }

  const session: MockSession = {
    isAuthenticated: true,
    role: "empresa",
    companyId: userId,
    companyName: empresa.nome,
    freelancerId: DEFAULT_FREELANCER_ID,
    freelancerName: "",
  };

  return {
    session,
    companies: [empresa],
    jobs,
    freelancers: Object.values(freelancerMap),
    applications: candidaturas.map(mapCandidatura),
  };
}

async function loadFreelancerData(supabase: any, userId: string): Promise<Partial<DashboardStoreState>> {
  const { data: freelancerRowData } = await supabase.from("freelancers").select("*").eq("id", userId).single();
  const freelancerRow = freelancerRowData as FreelancerRow | null;

  const { data: candsRaw } = await (supabase as any)
    .from("candidaturas")
    .select("*, vagas(*, empresas(*))")
    .eq("freelancer_id", userId)
    .order("created_at", { ascending: false });

  const freelancer: MockFreelancer = freelancerRow
    ? mapFreelancer(freelancerRow)
    : { ...mockFreelancers[0], id: userId };

  const candidaturas: CandidaturaRow[] = [];
  const jobsMap: Record<string, MockJob> = {};
  const companiesMap: Record<string, MockCompany> = {};

  (candsRaw ?? []).forEach((c: any) => {
    candidaturas.push({
      id: c.id,
      vaga_id: c.vaga_id,
      freelancer_id: c.freelancer_id,
      mensagem: c.mensagem,
      status: c.status,
      created_at: c.created_at,
    });

    if (c.vagas) {
      const empresaRow: EmpresaRow | null = c.vagas.empresas ?? null;
      const empresa: MockCompany = empresaRow
        ? mapEmpresa(empresaRow)
        : {
            id: c.vagas.empresa_id,
            nome: "Empresa",
            descricao: "",
            logoUrl: null,
            cnpj: "",
            cep: "",
            endereco: "",
            bairro: "",
            numero: "",
            whatsapp: "",
            planoAtivo: null,
            assinaturaAtivadaEm: null,
          };
      if (!companiesMap[empresa.id]) companiesMap[empresa.id] = empresa;
      if (!jobsMap[c.vagas.id]) jobsMap[c.vagas.id] = mapVaga(c.vagas as VagaRow, empresa);
    }
  });

  const session: MockSession = {
    isAuthenticated: true,
    role: "freelancer",
    companyId: DEFAULT_COMPANY_ID,
    companyName: "",
    freelancerId: userId,
    freelancerName: freelancer.nome,
  };

  return {
    session,
    companies: Object.values(companiesMap),
    jobs: Object.values(jobsMap),
    freelancers: [freelancer],
    applications: candidaturas.map(mapCandidatura),
  };
}

// ─── Provider ──────────────────────────────────────────────────────────────

export function DashboardStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardStoreState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);
  const initRan = useRef(false);

  // ── Init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initRan.current) return;
    initRan.current = true;

    if (USE_SUPABASE) {
      const supabase = createClient();

      supabase.auth
        .getSession()
        .then(async ({ data: { session: sbSession } }) => {
          if (!sbSession?.user) return;

          const user = sbSession.user;
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (!profile) return;

          let nextData: Partial<DashboardStoreState> = {};
          if (profile.role === "empresa") {
            nextData = await loadEmpresaData(supabase, user.id);
          } else if (profile.role === "freelancer") {
            nextData = await loadFreelancerData(supabase, user.id);
          }

          if (nextData.session) {
            setState((s) => ({ ...s, ...nextData }));
          }
        })
        .catch((err) => {
          console.error("[supabase] init error:", err);
        })
        .finally(() => {
          setIsHydrated(true);
        });
    } else {
      // Modo mock: hidrata do localStorage
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as DashboardStoreState;
          const rawSession = parsed.session as Partial<MockSession>;
          const migratedSession: MockSession = {
            ...parsed.session,
            freelancerId: rawSession.freelancerId ?? DEFAULT_FREELANCER_ID,
            freelancerName: rawSession.freelancerName ?? mockFreelancers[0].nome,
          };
          setState({ ...parsed, session: migratedSession });
          syncSessionCookie(migratedSession);
        } else {
          syncSessionCookie(initialState.session);
        }
      } catch {
        syncSessionCookie(initialState.session);
      } finally {
        setIsHydrated(true);
      }
    }
  }, []);

  // ── Persistir no localStorage (modo mock apenas) ──────────────────────
  useEffect(() => {
    if (!isHydrated || USE_SUPABASE) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncSessionCookie(state.session);
  }, [isHydrated, state]);

  // ── Valores derivados ─────────────────────────────────────────────────
  const currentCompany = state.companies.find((c) => c.id === state.session.companyId) ?? null;
  const currentFreelancer = state.freelancers.find((f) => f.id === state.session.freelancerId) ?? null;

  const companyJobs = useMemo(
    () =>
      state.jobs
        .filter((j) => j.empresaId === state.session.companyId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [state.jobs, state.session.companyId],
  );

  const stats = useMemo(
    () => ({
      totalVagas: companyJobs.length,
      vagasAtivas: companyJobs.filter((j) => j.ativa).length,
      candidaturasRecebidas: state.applications.filter((app) =>
        companyJobs.some((j) => j.id === app.vagaId),
      ).length,
    }),
    [companyJobs, state.applications],
  );

  const freelancerApplications = useMemo(
    () => state.applications.filter((app) => app.freelancerId === state.session.freelancerId),
    [state.applications, state.session.freelancerId],
  );

  const freelancerStats = useMemo(() => {
    const activeJobs = state.jobs.filter((j) => j.ativa);
    const appliedIds = new Set(freelancerApplications.map((a) => a.vagaId));
    return {
      vagasDisponiveis: activeJobs.filter((j) => !appliedIds.has(j.id)).length,
      candidaturasEnviadas: freelancerApplications.length,
      candidaturasAceitas: freelancerApplications.filter((a) => a.status === "aceita").length,
    };
  }, [state.jobs, freelancerApplications]);

  const currentPlan = useMemo(
    () => getPlanById(currentCompany?.planoAtivo ?? null) ?? getDefaultPlan(),
    [currentCompany?.planoAtivo],
  );

  const canPublishJob = useMemo(() => {
    if (currentPlan.maxVagasAtivas === null) return true;
    return stats.vagasAtivas < currentPlan.maxVagasAtivas;
  }, [currentPlan, stats.vagasAtivas]);

  // ── Helper para atualizar empresa e jobs relacionados ─────────────────
  function updateCompanies(nextCompanies: MockCompany[]) {
    setState((s) => ({
      ...s,
      companies: nextCompanies,
      jobs: s.jobs.map((j) => {
        const nc = nextCompanies.find((c) => c.id === j.empresaId);
        return nc ? { ...j, empresa: nc } : j;
      }),
      session: {
        ...s.session,
        companyName:
          nextCompanies.find((c) => c.id === s.session.companyId)?.nome ?? s.session.companyName,
      },
    }));
  }

  // ─── Valor do contexto ────────────────────────────────────────────────
  const value = useMemo<DashboardStoreContextValue>(
    () => ({
      ...state,
      isLoading: !isHydrated,
      currentCompany,
      companyJobs,
      stats,
      currentFreelancer,
      freelancerApplications,
      freelancerStats,
      currentPlan,
      canPublishJob,

      createJob: (values: JobFormValues): MockJob => {
        const company = currentCompany ?? state.companies[0];
        const newId = USE_SUPABASE ? crypto.randomUUID() : undefined;
        const nextJob = buildJob(values, company, undefined, newId);
        setState((s) => ({ ...s, jobs: [nextJob, ...s.jobs] }));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("vagas")
            .insert({
              id: nextJob.id,
              empresa_id: company.id,
              titulo: nextJob.titulo,
              descricao: nextJob.descricao,
              valor: nextJob.valor || null,
              tipo_valor: nextJob.tipoValor,
              horario: nextJob.horario || null,
              cidade: nextJob.cidade,
              estado: nextJob.estado,
              bairro: nextJob.bairro || null,
              requisitos: nextJob.requisitos.join("\n") || null,
              ativa: nextJob.ativa,
            })
            .then(({ error }) => {
              if (error) console.error("[supabase] createJob:", error.message);
            });
        }

        return nextJob;
      },

      updateJob: (jobId: string, values: JobFormValues): MockJob | null => {
        const currentJob = state.jobs.find((j) => j.id === jobId) ?? null;
        if (!currentJob) return null;
        const company = currentCompany ?? currentJob.empresa ?? state.companies[0];
        const nextJob = buildJob(values, company, currentJob);
        setState((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === jobId ? nextJob : j)) }));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("vagas")
            .update({
              titulo: nextJob.titulo,
              descricao: nextJob.descricao,
              valor: nextJob.valor || null,
              tipo_valor: nextJob.tipoValor,
              horario: nextJob.horario || null,
              cidade: nextJob.cidade,
              estado: nextJob.estado,
              bairro: nextJob.bairro || null,
              requisitos: nextJob.requisitos.join("\n") || null,
            })
            .eq("id", jobId)
            .then(({ error }) => {
              if (error) console.error("[supabase] updateJob:", error.message);
            });
        }

        return nextJob;
      },

      toggleJobStatus: (jobId: string) => {
        const job = state.jobs.find((j) => j.id === jobId);
        if (!job) return;
        setState((s) => ({
          ...s,
          jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, ativa: !j.ativa } : j)),
        }));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("vagas")
            .update({ ativa: !job.ativa })
            .eq("id", jobId)
            .then(({ error }) => {
              if (error) console.error("[supabase] toggleJobStatus:", error.message);
            });
        }
      },

      updateApplicationStatus: (applicationId: string, status: CandidaturaStatus) => {
        setState((s) => ({
          ...s,
          applications: s.applications.map((a) => (a.id === applicationId ? { ...a, status } : a)),
        }));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("candidaturas")
            .update({ status })
            .eq("id", applicationId)
            .then(({ error }) => {
              if (error) console.error("[supabase] updateApplicationStatus:", error.message);
            });
        }
      },

      updateCompanyProfile: (values: CompanyProfileFormValues) => {
        if (!currentCompany) return;
        const nextCompany: MockCompany = {
          ...currentCompany,
          nome: values.nome.trim(),
          cnpj: values.cnpj.trim(),
          cep: values.cep.trim(),
          endereco: values.endereco.trim(),
          bairro: values.bairro.trim(),
          numero: values.numero.trim(),
          whatsapp: values.whatsapp.trim(),
          descricao: values.descricao.trim(),
          logoUrl: values.logoUrl.trim() || null,
        };
        updateCompanies(state.companies.map((c) => (c.id === currentCompany.id ? nextCompany : c)));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("empresas")
            .update({
              nome: nextCompany.nome,
              cnpj: nextCompany.cnpj,
              cep: nextCompany.cep || null,
              endereco: nextCompany.endereco || null,
              bairro: nextCompany.bairro || null,
              numero: nextCompany.numero || null,
              whatsapp: nextCompany.whatsapp || null,
              descricao: nextCompany.descricao || null,
              logo_url: nextCompany.logoUrl || null,
            })
            .eq("id", currentCompany.id)
            .then(({ error }) => {
              if (error) console.error("[supabase] updateCompanyProfile:", error.message);
            });
        }
      },

      updateFreelancerProfile: (values: FreelancerProfileFormValues) => {
        if (!currentFreelancer) return;
        const habilidades = values.habilidades
          .split(/\r?\n|,/)
          .map((h) => h.trim())
          .filter(Boolean);
        const nextFreelancer: MockFreelancer = {
          ...currentFreelancer,
          nome: values.nome.trim(),
          cidade: values.cidade.trim(),
          estado: values.estado.trim().toUpperCase(),
          telefone: values.telefone.trim(),
          habilidades,
          bio: values.bio.trim(),
        };
        setState((s) => ({
          ...s,
          freelancers: s.freelancers.map((f) => (f.id === currentFreelancer.id ? nextFreelancer : f)),
          session: { ...s.session, freelancerName: nextFreelancer.nome },
        }));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("freelancers")
            .update({
              nome_completo: nextFreelancer.nome,
              cidade: nextFreelancer.cidade,
              estado: nextFreelancer.estado,
              telefone: nextFreelancer.telefone || null,
              habilidades: habilidades.length ? habilidades : null,
              bio: nextFreelancer.bio || null,
            })
            .eq("id", currentFreelancer.id)
            .then(({ error }) => {
              if (error) console.error("[supabase] updateFreelancerProfile:", error.message);
            });
        }
      },

      applyToJob: (vagaId: string, mensagem: string): MockApplication | null => {
        const alreadyApplied = state.applications.some(
          (a) => a.vagaId === vagaId && a.freelancerId === state.session.freelancerId,
        );
        if (alreadyApplied) return null;

        const newId = USE_SUPABASE ? crypto.randomUUID() : `candidatura-${Date.now()}`;
        const newApplication: MockApplication = {
          id: newId,
          vagaId,
          freelancerId: state.session.freelancerId,
          mensagem: mensagem.trim(),
          status: "pendente",
          createdAt: new Date().toISOString(),
        };
        setState((s) => ({ ...s, applications: [newApplication, ...s.applications] }));

        if (USE_SUPABASE) {
          const sb = createClient();
          sb.from("candidaturas")
            .insert({
              id: newId,
              vaga_id: vagaId,
              freelancer_id: state.session.freelancerId,
              mensagem: mensagem.trim(),
            })
            .then(({ error }) => {
              if (error) console.error("[supabase] applyToJob:", error.message);
            });
        }

        return newApplication;
      },

      loginAsCompany: () => {
        const company = state.companies.find((c) => c.id === DEFAULT_COMPANY_ID) ?? state.companies[0];
        setState((s) => ({
          ...s,
          session: {
            ...s.session,
            isAuthenticated: true,
            role: "empresa",
            companyId: company.id,
            companyName: company.nome,
          },
        }));
      },

      loginAsFreelancer: () => {
        const freelancer =
          state.freelancers.find((f) => f.id === DEFAULT_FREELANCER_ID) ?? state.freelancers[0];
        setState((s) => ({
          ...s,
          session: {
            ...s.session,
            isAuthenticated: true,
            role: "freelancer",
            freelancerId: freelancer.id,
            freelancerName: freelancer.nome,
          },
        }));
      },

      logout: async () => {
        if (USE_SUPABASE) {
          const sb = createClient();
          await sb.auth.signOut();
        }
        setState((s) => ({ ...s, session: { ...s.session, isAuthenticated: false } }));
        if (!USE_SUPABASE) {
          syncSessionCookie({ ...state.session, isAuthenticated: false });
        }
      },

      getJobById: (jobId: string) => state.jobs.find((j) => j.id === jobId) ?? null,

      getApplicationsByJobId: (jobId: string): CandidateView[] =>
        state.applications
          .filter((a) => a.vagaId === jobId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((application) => ({
            application,
            freelancer: state.freelancers.find((f) => f.id === application.freelancerId) ?? null,
          })),

      activateSubscription: async (planId: PlanId) => {
        const result = await paymentGateway.createSubscription(planId, state.session.companyId);
        if (result.success && currentCompany) {
          const nextCompany: MockCompany = {
            ...currentCompany,
            planoAtivo: planId,
            assinaturaAtivadaEm: new Date().toISOString(),
          };
          updateCompanies(state.companies.map((c) => (c.id === currentCompany.id ? nextCompany : c)));
        }
      },

      cancelSubscription: async () => {
        if (!currentCompany) return;
        await paymentGateway.cancelSubscription(`mock-sub-${currentCompany.id}`);
        const nextCompany: MockCompany = {
          ...currentCompany,
          planoAtivo: null,
          assinaturaAtivadaEm: null,
        };
        updateCompanies(state.companies.map((c) => (c.id === currentCompany.id ? nextCompany : c)));
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      canPublishJob,
      companyJobs,
      currentCompany,
      currentFreelancer,
      currentPlan,
      freelancerApplications,
      freelancerStats,
      isHydrated,
      state,
      stats,
    ],
  );

  return <DashboardStoreContext.Provider value={value}>{children}</DashboardStoreContext.Provider>;
}

export function useDashboardStore() {
  const ctx = useContext(DashboardStoreContext);
  if (!ctx) {
    throw new Error("useDashboardStore deve ser usado dentro de DashboardStoreProvider.");
  }
  return ctx;
}
