"use client";

import { notFound, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { JobForm } from "@/components/dashboard/job-form";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import type { MockJob } from "@/lib/mock-data";
import type { JobFormValues } from "@/types/dashboard";

function toInitialValues(job: MockJob | null): JobFormValues | null {
  if (!job) {
    return null;
  }

  return {
    titulo: job.titulo,
    descricao: job.descricao,
    requisitos: job.requisitos.join(", "),
    valor: String(job.valor),
    tipoValor: job.tipoValor,
    horario: job.horario,
    cidade: job.cidade,
    estado: job.estado,
    bairro: job.bairro,
  };
}

export function EditJobPage({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { isAuthenticated } = useDashboardGuard();
  const store = useDashboardStore();
  const job = store.getJobById(jobId);
  const initialValues = toInitialValues(job);

  if (!isAuthenticated) {
    return null;
  }

  if (!initialValues) {
    notFound();
  }

  return (
    <DashboardShell
      title="Editar vaga"
      description="Atualize detalhes da oportunidade, mantendo o mesmo formulário usado na criação para facilitar a futura integração com Supabase."
    >
      <JobForm
        cancelHref="/dashboard/empresa"
        initialValues={initialValues}
        submitLabel="Salvar alterações"
        successMessage="Vaga atualizada com sucesso."
        onSubmit={(values) => {
          store.updateJob(jobId, values);
          window.setTimeout(() => {
            router.push("/dashboard/empresa");
          }, 600);
        }}
      />
    </DashboardShell>
  );
}