import { SubscriptionPage } from "@/components/dashboard/subscription-page";

type AssinaturaPageProps = {
  searchParams?: Promise<{ plano?: string }> | { plano?: string };
};

export default async function AssinaturaPage({ searchParams }: AssinaturaPageProps) {
  const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams;
  const plano = resolvedParams?.plano ?? null;
  return <SubscriptionPage selectedPlanId={plano} />;
}
