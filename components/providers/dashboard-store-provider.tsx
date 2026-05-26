"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

const STORAGE_KEY = "freelamatch.dashboard-store";
const DEFAULT_COMPANY_ID = "empresa-1";
const DEFAULT_FREELANCER_ID = "freelancer-1";

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
  if (typeof document === "undefined") {
    return;
  }

  if (session.isAuthenticated) {
    document.cookie = `freelamatch_mock_auth=${session.role}; path=/; max-age=2592000; samesite=lax`;
  } else {
    document.cookie = "freelamatch_mock_auth=; path=/; max-age=0; samesite=lax";
  }
}

function buildJob(values: JobFormValues, company: MockCompany, previousJob?: MockJob): MockJob {
  const requisitos = values.requisitos
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    id: previousJob?.id ?? `vaga-${Date.now()}`,
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

export function DashboardStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DashboardStoreState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as DashboardStoreState;

        // Migrar sessoes antigas que nao tinham freelancerId/freelancerName
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
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncSessionCookie(state.session);
  }, [isHydrated, state]);

  const currentCompany = state.companies.find((company) => company.id === state.session.companyId) ?? null;
  const currentFreelancer = state.freelancers.find((f) => f.id === state.session.freelancerId) ?? null;

  const companyJobs = useMemo(() => {
    return state.jobs
      .filter((job) => job.empresaId === state.session.companyId)
      .sort((firstJob, secondJob) => {
        return new Date(secondJob.createdAt).getTime() - new Date(firstJob.createdAt).getTime();
      });
  }, [state.jobs, state.session.companyId]);

  const stats = useMemo(() => {
    return {
      totalVagas: companyJobs.length,
      vagasAtivas: companyJobs.filter((job) => job.ativa).length,
      candidaturasRecebidas: state.applications.filter((application) =>
        companyJobs.some((job) => job.id === application.vagaId),
      ).length,
    };
  }, [companyJobs, state.applications]);

  const freelancerApplications = useMemo(() => {
    return state.applications.filter((app) => app.freelancerId === state.session.freelancerId);
  }, [state.applications, state.session.freelancerId]);

  const freelancerStats = useMemo(() => {
    const activeJobs = state.jobs.filter((job) => job.ativa);
    const appliedJobIds = new Set(freelancerApplications.map((app) => app.vagaId));

    return {
      vagasDisponiveis: activeJobs.filter((job) => !appliedJobIds.has(job.id)).length,
      candidaturasEnviadas: freelancerApplications.length,
      candidaturasAceitas: freelancerApplications.filter((app) => app.status === "aceita").length,
    };
  }, [state.jobs, freelancerApplications]);

  const currentPlan = useMemo(() => {
    return getPlanById(currentCompany?.planoAtivo ?? null) ?? getDefaultPlan();
  }, [currentCompany?.planoAtivo]);

  const canPublishJob = useMemo(() => {
    if (currentPlan.maxVagasAtivas === null) return true;
    return stats.vagasAtivas < currentPlan.maxVagasAtivas;
  }, [currentPlan, stats.vagasAtivas]);

  function updateCompanies(nextCompanies: MockCompany[]) {
    setState((currentState) => ({
      ...currentState,
      companies: nextCompanies,
      jobs: currentState.jobs.map((job) => {
        const nextCompany = nextCompanies.find((company) => company.id === job.empresaId);
        return nextCompany ? { ...job, empresa: nextCompany } : job;
      }),
      session: {
        ...currentState.session,
        companyName:
          nextCompanies.find((company) => company.id === currentState.session.companyId)?.nome ??
          currentState.session.companyName,
      },
    }));
  }

  const value = useMemo<DashboardStoreContextValue>(() => {
    return {
      ...state,
      currentCompany,
      companyJobs,
      stats,
      currentFreelancer,
      freelancerApplications,
      freelancerStats,
      currentPlan,
      canPublishJob,
      createJob: (values: JobFormValues) => {
        const company = currentCompany ?? state.companies[0];
        const nextJob = buildJob(values, company);

        setState((currentState) => ({
          ...currentState,
          jobs: [nextJob, ...currentState.jobs],
        }));

        return nextJob;
      },
      updateJob: (jobId: string, values: JobFormValues) => {
        const currentJob = state.jobs.find((job) => job.id === jobId) ?? null;
        const company = currentCompany ?? currentJob?.empresa ?? state.companies[0];

        if (!currentJob) {
          return null;
        }

        const nextJob = buildJob(values, company, currentJob);

        setState((currentState) => ({
          ...currentState,
          jobs: currentState.jobs.map((job) => (job.id === jobId ? nextJob : job)),
        }));

        return nextJob;
      },
      toggleJobStatus: (jobId: string) => {
        setState((currentState) => ({
          ...currentState,
          jobs: currentState.jobs.map((job) => (job.id === jobId ? { ...job, ativa: !job.ativa } : job)),
        }));
      },
      updateApplicationStatus: (applicationId: string, status: CandidaturaStatus) => {
        setState((currentState) => ({
          ...currentState,
          applications: currentState.applications.map((application) =>
            application.id === applicationId ? { ...application, status } : application,
          ),
        }));
      },
      updateCompanyProfile: (values: CompanyProfileFormValues) => {
        if (!currentCompany) {
          return;
        }

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

        updateCompanies(state.companies.map((company) => (company.id === currentCompany.id ? nextCompany : company)));
      },
      updateFreelancerProfile: (values: FreelancerProfileFormValues) => {
        if (!currentFreelancer) {
          return;
        }

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

        setState((currentState) => ({
          ...currentState,
          freelancers: currentState.freelancers.map((f) =>
            f.id === currentFreelancer.id ? nextFreelancer : f,
          ),
          session: {
            ...currentState.session,
            freelancerName: nextFreelancer.nome,
          },
        }));
      },
      applyToJob: (vagaId: string, mensagem: string) => {
        const alreadyApplied = state.applications.some(
          (app) => app.vagaId === vagaId && app.freelancerId === state.session.freelancerId,
        );

        if (alreadyApplied) {
          return null;
        }

        const newApplication: MockApplication = {
          id: `candidatura-${Date.now()}`,
          vagaId,
          freelancerId: state.session.freelancerId,
          mensagem: mensagem.trim(),
          status: "pendente",
          createdAt: new Date().toISOString(),
        };

        setState((currentState) => ({
          ...currentState,
          applications: [newApplication, ...currentState.applications],
        }));

        return newApplication;
      },
      loginAsCompany: () => {
        const company = state.companies.find((item) => item.id === DEFAULT_COMPANY_ID) ?? state.companies[0];

        setState((currentState) => ({
          ...currentState,
          session: {
            ...currentState.session,
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

        setState((currentState) => ({
          ...currentState,
          session: {
            ...currentState.session,
            isAuthenticated: true,
            role: "freelancer",
            freelancerId: freelancer.id,
            freelancerName: freelancer.nome,
          },
        }));
      },
      logout: () => {
        setState((currentState) => ({
          ...currentState,
          session: {
            ...currentState.session,
            isAuthenticated: false,
          },
        }));
      },
      getJobById: (jobId: string) => state.jobs.find((job) => job.id === jobId) ?? null,
      getApplicationsByJobId: (jobId: string): CandidateView[] =>
        state.applications
          .filter((application) => application.vagaId === jobId)
          .sort((firstApplication: MockApplication, secondApplication: MockApplication) => {
            return new Date(secondApplication.createdAt).getTime() - new Date(firstApplication.createdAt).getTime();
          })
          .map((application) => ({
            application,
            freelancer: state.freelancers.find((freelancer) => freelancer.id === application.freelancerId) ?? null,
          })),
      activateSubscription: async (planId: PlanId) => {
        const result = await paymentGateway.createSubscription(planId, state.session.companyId);

        if (result.success && currentCompany) {
          const nextCompany: MockCompany = {
            ...currentCompany,
            planoAtivo: planId,
            assinaturaAtivadaEm: new Date().toISOString(),
          };

          updateCompanies(
            state.companies.map((company) => (company.id === currentCompany.id ? nextCompany : company)),
          );
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

        updateCompanies(
          state.companies.map((company) => (company.id === currentCompany.id ? nextCompany : company)),
        );
      },
    };
  }, [canPublishJob, companyJobs, currentCompany, currentFreelancer, currentPlan, freelancerApplications, freelancerStats, state, stats]);

  return <DashboardStoreContext.Provider value={value}>{children}</DashboardStoreContext.Provider>;
}

export function useDashboardStore() {
  const context = useContext(DashboardStoreContext);

  if (!context) {
    throw new Error("useDashboardStore deve ser usado dentro de DashboardStoreProvider.");
  }

  return context;
}
