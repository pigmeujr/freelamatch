import type { PlanId } from "./plans";

export type ValorType = "dia" | "hora" | "projeto";

export type MockCompany = {
  id: string;
  nome: string;
  descricao: string;
  logoUrl: string | null;
  cnpj?: string;
  cep?: string;
  endereco?: string;
  bairro?: string;
  numero?: string;
  whatsapp?: string;
  planoAtivo?: PlanId | null;
  assinaturaAtivadaEm?: string | null;
};

export type MockJob = {
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
  empresa: MockCompany;
};

export type MockFreelancer = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  telefone?: string;
  habilidades?: string[];
  bio?: string;
  mensagemPadrao?: string;
};

export type CandidaturaStatus = "pendente" | "aceita" | "recusada";

export type MockApplication = {
  id: string;
  vagaId: string;
  freelancerId: string;
  mensagem: string;
  status: CandidaturaStatus;
  createdAt: string;
};

export const mockCompanies: MockCompany[] = [
  {
    id: "empresa-1",
    nome: "Studio Aurora",
    descricao: "Agência criativa focada em eventos, ativações e experiências de marca.",
    logoUrl: null,
    cnpj: "12.345.678/0001-10",
    cep: "04548-001",
    endereco: "Rua Olimpíadas",
    bairro: "Vila Olímpia",
    numero: "205",
    whatsapp: "(11) 98765-4321",
    planoAtivo: "gratuito",
    assinaturaAtivadaEm: null,
  },
  {
    id: "empresa-2",
    nome: "Conecta Saúde",
    descricao: "Startup de operações em saúde que contrata profissionais locais para suporte e campo.",
    logoUrl: null,
    cnpj: "23.456.789/0001-20",
    cep: "20510-020",
    endereco: "Rua Conde de Bonfim",
    bairro: "Tijuca",
    numero: "488",
    whatsapp: "(21) 97654-3210",
    planoAtivo: "starter",
    assinaturaAtivadaEm: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "empresa-3",
    nome: "Mercado Veloz",
    descricao: "Rede de varejo com demandas rápidas em lojas, estoque e ações promocionais.",
    logoUrl: null,
    cnpj: "34.567.891/0001-30",
    cep: "41810-205",
    endereco: "Av. Paulo VI",
    bairro: "Pituba",
    numero: "1410",
    whatsapp: "(71) 96543-2109",
    planoAtivo: "pro",
    assinaturaAtivadaEm: "2026-04-15T10:00:00.000Z",
  },
  {
    id: "empresa-4",
    nome: "Pixel House",
    descricao: "Estúdio digital com projetos para social media, vídeo e design sob demanda.",
    logoUrl: null,
    cnpj: "45.678.912/0001-40",
    cep: "51020-001",
    endereco: "Av. Conselheiro Aguiar",
    bairro: "Boa Viagem",
    numero: "4020",
    whatsapp: "(81) 95432-1098",
    planoAtivo: "pro",
    assinaturaAtivadaEm: "2026-05-10T10:00:00.000Z",
  },
  {
    id: "empresa-5",
    nome: "Obra Certa",
    descricao: "Empresa de apoio operacional para obras, manutenção e serviços externos.",
    logoUrl: null,
    cnpj: "56.789.123/0001-50",
    cep: "60170-001",
    endereco: "Rua Barbosa de Freitas",
    bairro: "Aldeota",
    numero: "1190",
    whatsapp: "(85) 94321-0987",
  },
];

export const mockFreelancers: MockFreelancer[] = [
  {
    id: "freelancer-1",
    nome: "Mariana Costa",
    cidade: "São Paulo",
    estado: "SP",
    telefone: "(11) 99123-4567",
    habilidades: ["Design Gráfico", "Canva", "Photoshop", "Redes Sociais", "Cobertura de Eventos"],
    bio: "Designer e produtora de conteúdo com 4 anos de experiência em eventos corporativos e ações de marca. Trabalho bem em equipe e tenho agilidade para entregas rápidas no local.",
    mensagemPadrao: "Tenho experiência com cobertura de eventos e entregas rápidas para redes sociais.",
  },
  {
    id: "freelancer-2",
    nome: "Lucas Ferreira",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    telefone: "(21) 98765-3210",
    habilidades: ["Merchandising", "PDV", "Fotografia", "Organização", "Logística"],
    bio: "Promotor com experiência em merchandising em rota, organização de gôndolas e registro de ativações. Celular sempre em mão para fotos e relatórios.",
    mensagemPadrao: "Atuo com merchandising em rota e registro fotográfico das ativações.",
  },
  {
    id: "freelancer-3",
    nome: "Camila Souza",
    cidade: "Curitiba",
    estado: "PR",
    telefone: "(41) 97654-2109",
    habilidades: ["Produção de Eventos", "Credenciamento", "Recepção", "Logística", "Atendimento ao Público"],
    bio: "Profissional organizada e pontual, com vivência em produções presenciais de médio e grande porte. Já atuei em feiras, congressos e eventos corporativos.",
    mensagemPadrao: "Sou organizada, pontual e tenho vivência em produção de eventos presenciais.",
  },
  {
    id: "freelancer-4",
    nome: "Rafael Martins",
    cidade: "Recife",
    estado: "PE",
    telefone: "(81) 96543-1098",
    habilidades: ["Social Media", "Edição de Vídeo", "Captação Mobile", "Copywriting", "TikTok"],
    bio: "Criador de conteúdo com foco em vídeo curto e social media local. Tenho mobilidade pela cidade e consigo gravar, editar e publicar no mesmo dia.",
    mensagemPadrao: "Posso apoiar conteúdo, gravações e edições com mobilidade pela cidade.",
  },
  {
    id: "freelancer-5",
    nome: "Beatriz Lima",
    cidade: "Porto Alegre",
    estado: "RS",
    telefone: "(51) 95432-0987",
    habilidades: ["Recepção", "Atendimento ao Público", "Eventos Corporativos", "Comunicação", "Crachás e Credenciamento"],
    bio: "Recepcionista e hostess com experiência em congressos médicos, eventos corporativos e feiras. Boa postura, fluente em inglês básico e disponibilidade para turnos integrais.",
    mensagemPadrao: "Tenho facilidade com atendimento, recepção e operações em eventos corporativos.",
  },
];

export const mockJobs: MockJob[] = [
  {
    id: "vaga-1",
    titulo: "Designer para cobertura de evento corporativo",
    descricao:
      "Buscamos freelancer para criar peças rápidas de social media durante um evento corporativo presencial. A atuação será ao lado da equipe de conteúdo para entregar posts, stories e ajustes visuais em tempo real.",
    requisitos: ["Domínio de Canva ou Photoshop", "Agilidade em entregas", "Disponibilidade presencial"],
    valor: 650,
    tipoValor: "dia",
    horario: "08:00 às 18:00",
    cidade: "São Paulo",
    estado: "SP",
    bairro: "Vila Olímpia",
    endereco: "Rua Olimpíadas, 205",
    createdAt: "2026-05-25T09:30:00.000Z",
    ativa: true,
    empresaId: "empresa-1",
    empresa: mockCompanies[0],
  },
  {
    id: "vaga-2",
    titulo: "Promotor de merchandising para farmácias",
    descricao:
      "Atuação em rota visitando farmácias para organização de gôndolas, reposição leve e registro fotográfico das ações executadas.",
    requisitos: ["Experiência com PDV", "Boa comunicação", "Celular com câmera"],
    valor: 28,
    tipoValor: "hora",
    horario: "Segunda a sexta, 09:00 às 16:00",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    bairro: "Tijuca",
    endereco: "Grande Tijuca",
    createdAt: "2026-05-24T14:10:00.000Z",
    ativa: true,
    empresaId: "empresa-2",
    empresa: mockCompanies[1],
  },
  {
    id: "vaga-3",
    titulo: "Fotógrafo freelancer para catálogo local",
    descricao:
      "Projeto para fotografar linha de produtos de uma loja de bairro, com entrega de imagens tratadas para e-commerce e redes sociais.",
    requisitos: ["Portfólio atualizado", "Equipamento próprio", "Noções de tratamento"],
    valor: 1800,
    tipoValor: "projeto",
    horario: "Agenda flexível nesta semana",
    cidade: "Belo Horizonte",
    estado: "MG",
    bairro: "Savassi",
    endereco: "Rua Pernambuco, 950",
    createdAt: "2026-05-23T11:00:00.000Z",
    ativa: false,
    empresaId: "empresa-4",
    empresa: mockCompanies[3],
  },
  {
    id: "vaga-4",
    titulo: "Assistente de produção para feira gastronômica",
    descricao:
      "Precisamos de apoio operacional para montagem, credenciamento de expositores e suporte durante a feira. Trabalho presencial com equipe dinâmica.",
    requisitos: ["Perfil proativo", "Organização", "Facilidade com atendimento"],
    valor: 420,
    tipoValor: "dia",
    horario: "07:00 às 17:00",
    cidade: "Curitiba",
    estado: "PR",
    bairro: "Batel",
    endereco: "Alameda Dom Pedro II, 255",
    createdAt: "2026-05-22T08:15:00.000Z",
    ativa: true,
    empresaId: "empresa-1",
    empresa: mockCompanies[0],
  },
  {
    id: "vaga-5",
    titulo: "Social media para restaurante regional",
    descricao:
      "Freelancer para planejar calendário de conteúdo, gravar vídeos curtos no local e publicar ofertas semanais em Instagram e TikTok.",
    requisitos: ["Captação mobile", "Edição rápida de vídeo", "Planejamento editorial"],
    valor: 1400,
    tipoValor: "projeto",
    horario: "2 visitas presenciais por semana",
    cidade: "Recife",
    estado: "PE",
    bairro: "Boa Viagem",
    endereco: "Av. Conselheiro Aguiar, 4020",
    createdAt: "2026-05-21T16:20:00.000Z",
    ativa: true,
    empresaId: "empresa-4",
    empresa: mockCompanies[3],
  },
  {
    id: "vaga-6",
    titulo: "Repositor freelancer para virada promocional",
    descricao:
      "Demanda pontual para reforço em loja durante campanha promocional, com foco em reposição, organização e apoio ao time de vendas.",
    requisitos: ["Experiência em loja", "Resistência física leve", "Pontualidade"],
    valor: 32,
    tipoValor: "hora",
    horario: "18:00 às 23:00",
    cidade: "Salvador",
    estado: "BA",
    bairro: "Pituba",
    endereco: "Av. Paulo VI, 1410",
    createdAt: "2026-05-20T19:40:00.000Z",
    ativa: true,
    empresaId: "empresa-3",
    empresa: mockCompanies[2],
  },
  {
    id: "vaga-7",
    titulo: "Técnico de apoio em instalação comercial",
    descricao:
      "Projeto curto para apoio em instalação de equipamentos e acabamento leve em ponto comercial. Supervisão no local e checklist digital.",
    requisitos: ["Vivência em campo", "Ferramentas básicas", "Disponibilidade imediata"],
    valor: 900,
    tipoValor: "projeto",
    horario: "Execução em 2 dias úteis",
    cidade: "Fortaleza",
    estado: "CE",
    bairro: "Aldeota",
    endereco: "Rua Barbosa de Freitas, 1190",
    createdAt: "2026-05-19T13:55:00.000Z",
    ativa: true,
    empresaId: "empresa-5",
    empresa: mockCompanies[4],
  },
  {
    id: "vaga-8",
    titulo: "Recepcionista para evento médico",
    descricao:
      "Atendimento a participantes, entrega de crachás, orientação de salas e suporte à equipe organizadora durante congresso presencial.",
    requisitos: ["Boa postura", "Atendimento ao público", "Disponibilidade integral"],
    valor: 380,
    tipoValor: "dia",
    horario: "06:30 às 16:30",
    cidade: "Porto Alegre",
    estado: "RS",
    bairro: "Moinhos de Vento",
    endereco: "Rua Padre Chagas, 79",
    createdAt: "2026-05-18T10:05:00.000Z",
    ativa: false,
    empresaId: "empresa-2",
    empresa: mockCompanies[1],
  },
  {
    id: "vaga-9",
    titulo: "Editor de vídeo para campanha local",
    descricao:
      "Edição de vídeos curtos para campanha de lançamento regional com entregas em formatos verticais e horizontais.",
    requisitos: ["After Effects ou Premiere", "Noção de motion", "Entrega organizada"],
    valor: 75,
    tipoValor: "hora",
    horario: "Até 20 horas nesta quinzena",
    cidade: "São Paulo",
    estado: "SP",
    bairro: "Pinheiros",
    endereco: "Rua dos Pinheiros, 870",
    createdAt: "2026-05-17T17:25:00.000Z",
    ativa: true,
    empresaId: "empresa-4",
    empresa: mockCompanies[3],
  },
];

export const mockApplications: MockApplication[] = [
  {
    id: "candidatura-1",
    vagaId: "vaga-1",
    freelancerId: "freelancer-1",
    mensagem: "Posso atuar presencialmente e tenho experiência em cobertura ao vivo de eventos corporativos.",
    status: "pendente",
    createdAt: "2026-05-25T13:20:00.000Z",
  },
  {
    id: "candidatura-2",
    vagaId: "vaga-1",
    freelancerId: "freelancer-3",
    mensagem: "Já apoiei produções grandes e consigo trabalhar com prazos curtos no local.",
    status: "aceita",
    createdAt: "2026-05-25T15:00:00.000Z",
  },
  {
    id: "candidatura-3",
    vagaId: "vaga-4",
    freelancerId: "freelancer-3",
    mensagem: "Tenho disponibilidade total para montagem, credenciamento e suporte operacional no evento.",
    status: "pendente",
    createdAt: "2026-05-22T12:30:00.000Z",
  },
  {
    id: "candidatura-4",
    vagaId: "vaga-5",
    freelancerId: "freelancer-4",
    mensagem: "Posso gravar, editar e organizar um calendário simples com foco em conversão local.",
    status: "pendente",
    createdAt: "2026-05-21T18:10:00.000Z",
  },
  {
    id: "candidatura-5",
    vagaId: "vaga-8",
    freelancerId: "freelancer-5",
    mensagem: "Tenho vivência em congressos e atendimento de participantes durante eventos médicos.",
    status: "recusada",
    createdAt: "2026-05-18T12:50:00.000Z",
  },
];