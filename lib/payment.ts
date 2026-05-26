import type { PlanId } from "./plans";

// ============================================================
// Interface abstrata do gateway de pagamento.
//
// Para integrar o Mercado Pago real:
//   1. Adicione MERCADO_PAGO_ACCESS_TOKEN ao .env
//   2. Instale o SDK: npm install mercadopago
//   3. Implemente MercadoPagoGateway abaixo usando a API de
//      Assinaturas (Pre-approval):
//      https://www.mercadopago.com.br/developers/pt/docs/subscriptions/landing
//   4. Troque `export const paymentGateway = mockPaymentGateway`
//      por    `export const paymentGateway = mercadoPagoGateway`
// ============================================================

export type SubscriptionResult = {
  success: boolean;
  subscriptionId?: string;
  error?: string;
};

export type SubscriptionStatusResult = {
  active: boolean;
  planId: PlanId | null;
};

export interface PaymentGateway {
  /** Cria uma nova assinatura recorrente para a empresa. */
  createSubscription(planId: PlanId, companyId: string): Promise<SubscriptionResult>;

  /** Cancela uma assinatura ativa pelo ID externo. */
  cancelSubscription(subscriptionId: string): Promise<SubscriptionResult>;

  /** Consulta o status atual de uma assinatura externa. */
  getSubscriptionStatus(subscriptionId: string): Promise<SubscriptionStatusResult>;
}

// TODO: Descomentar e completar quando MERCADO_PAGO_ACCESS_TOKEN estiver disponível
//
// import { MercadoPagoConfig, PreApproval } from "mercadopago";
//
// const client = new MercadoPagoConfig({
//   accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
// });
//
// const mercadoPagoGateway: PaymentGateway = {
//   async createSubscription(planId, companyId) {
//     const preapproval = new PreApproval(client);
//     const response = await preapproval.create({
//       body: {
//         reason: `FreelaMatch Plano ${planId}`,
//         external_reference: companyId,
//         payer_email: "...",
//         auto_recurring: { frequency: 1, frequency_type: "months", ... },
//       },
//     });
//     return { success: true, subscriptionId: response.id };
//   },
//   async cancelSubscription(subscriptionId) {
//     const preapproval = new PreApproval(client);
//     await preapproval.update({ id: subscriptionId, body: { status: "cancelled" } });
//     return { success: true };
//   },
//   async getSubscriptionStatus(subscriptionId) {
//     const preapproval = new PreApproval(client);
//     const response = await preapproval.get({ id: subscriptionId });
//     return { active: response.status === "authorized", planId: null };
//   },
// };

/** Implementação mock — retorna sucesso imediato sem cobrar nada. */
export const mockPaymentGateway: PaymentGateway = {
  async createSubscription(_planId, _companyId) {
    // Simula latência de rede (~1,2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return {
      success: true,
      subscriptionId: `mock-sub-${Date.now()}`,
    };
  },

  async cancelSubscription(_subscriptionId) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { success: true };
  },

  async getSubscriptionStatus(_subscriptionId) {
    return { active: true, planId: null };
  },
};

/** Gateway ativo — troque por mercadoPagoGateway em produção. */
export const paymentGateway: PaymentGateway = mockPaymentGateway;
