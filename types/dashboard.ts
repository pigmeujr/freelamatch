import type {
  CandidaturaStatus,
  MockApplication,
  MockCompany,
  MockFreelancer,
  MockJob,
  ValorType,
} from "@/lib/mock-data";
import type { PlanId, SubscriptionPlan } from "@/lib/plans";

export type JobFormValues = {
  titulo: string;
  descricao: string;
  requisitos: string;
  valor: string;
  tipoValor: ValorType;
  horario: string;
  cidade: string;
  estado: string;
  bairro: string;
};

export type CompanyProfileFormValues = {
  nome: string;
  cnpj: string;
  cep: string;
  endereco: string;
  bairro: string;
  numero: string;
  whatsapp: string;
  descricao: string;
  logoUrl: string;
};

export type FreelancerProfileFormValues = {
  nome: string;
  cidade: string;
  estado: string;
  telefone: string;
  habilidades: string;
  bio: string;
};

export type MockSession = {
  isAuthenticated: boolean;
  role: "empresa" | "freelancer";
  companyId: string;
  companyName: string;
  freelancerId: string;
  freelancerName: string;
};

export type DashboardStoreState = {
  session: MockSession;
  companies: MockCompany[];
  jobs: MockJob[];
  freelancers: MockFreelancer[];
  applications: MockApplication[];
};

export type DashboardStats = {
  totalVagas: number;
  vagasAtivas: number;
  candidaturasRecebidas: number;
};

export type FreelancerStats = {
  vagasDisponiveis: number;
  candidaturasEnviadas: number;
  candidaturasAceitas: number;
};

export type CandidateView = {
  application: MockApplication;
  freelancer: MockFreelancer | null;
};

export type FreelancerApplicationView = {
  application: MockApplication;
  job: MockJob | null;
};

export type DashboardStoreContextValue = DashboardStoreState & {
  isLoading: boolean;
  currentCompany: MockCompany | null;
  companyJobs: MockJob[];
  stats: DashboardStats;
  currentFreelancer: MockFreelancer | null;
  freelancerApplications: MockApplication[];
  freelancerStats: FreelancerStats;
  currentPlan: SubscriptionPlan;
  canPublishJob: boolean;
  createJob: (values: JobFormValues) => MockJob;
  updateJob: (jobId: string, values: JobFormValues) => MockJob | null;
  toggleJobStatus: (jobId: string) => void;
  updateApplicationStatus: (applicationId: string, status: CandidaturaStatus) => void;
  updateCompanyProfile: (values: CompanyProfileFormValues) => void;
  updateFreelancerProfile: (values: FreelancerProfileFormValues) => void;
  applyToJob: (vagaId: string, mensagem: string) => MockApplication | null;
  loginAsCompany: () => void;
  loginAsFreelancer: () => void;
  logout: () => Promise<void>;
  getJobById: (jobId: string) => MockJob | null;
  getApplicationsByJobId: (jobId: string) => CandidateView[];
  activateSubscription: (planId: PlanId) => Promise<void>;
  cancelSubscription: () => Promise<void>;
};
