export type PlanId = "gratuito" | "starter" | "pro";

export type SubscriptionPlan = {
  id: PlanId;
  nome: string;
  preco: number;
  descricao: string;
  features: string[];
  maxVagasAtivas: number | null; // null = ilimitado
  diasVagaNoAr: number;
  acessoWhatsApp: boolean;
  destaque: boolean; // badge "Destaque" nas listagens de vagas
  verificada: boolean; // badge "Verificada" no perfil da empresa
  recomendado: boolean; // destaque visual no card de planos
  gratuito: boolean;
};

export const plans: SubscriptionPlan[] = [
  {
    id: "gratuito",
    nome: "Gratuito",
    preco: 0,
    descricao: "Comece a contratar sem gastar nada. Ideal para testar a plataforma.",
    features: [
      "1 vaga ativa por vez",
      "Visualizar candidatos",
      "Contato via mensagem interna",
      "Vaga fica no ar por 7 dias",
      "Suporte básico",
    ],
    maxVagasAtivas: 1,
    diasVagaNoAr: 7,
    acessoWhatsApp: false,
    destaque: false,
    verificada: false,
    recomendado: false,
    gratuito: true,
  },
  {
    id: "starter",
    nome: "Starter",
    preco: 29,
    descricao: "Para empresas que contratam com regularidade e precisam de mais alcance.",
    features: [
      "Até 5 vagas ativas",
      "Visualizar candidatos",
      "Acesso ao WhatsApp do candidato",
      "Vaga fica no ar por 30 dias",
      "Suporte por e-mail",
    ],
    maxVagasAtivas: 5,
    diasVagaNoAr: 30,
    acessoWhatsApp: true,
    destaque: false,
    verificada: false,
    recomendado: false,
    gratuito: false,
  },
  {
    id: "pro",
    nome: "Pro",
    preco: 59,
    descricao: "A solução completa para contratações frequentes e máxima visibilidade.",
    features: [
      "Vagas ilimitadas",
      "Visualizar candidatos",
      "Acesso ao WhatsApp do candidato",
      "Vaga fica no ar por 60 dias",
      "Destaque na busca (vagas aparecem primeiro)",
      "Badge Verificada no perfil da empresa",
      "Suporte prioritário",
    ],
    maxVagasAtivas: null,
    diasVagaNoAr: 60,
    acessoWhatsApp: true,
    destaque: true,
    verificada: true,
    recomendado: true,
    gratuito: false,
  },
];

export function getPlanById(planId: PlanId | null | undefined): SubscriptionPlan | null {
  if (!planId) return null;
  return plans.find((p) => p.id === planId) ?? null;
}

/** Retorna o plano padrão (gratuito) caso a empresa nao tenha nenhum definido. */
export function getDefaultPlan(): SubscriptionPlan {
  return plans[0];
}
