"use client";

import { useState } from "react";
import { FreelancerShell } from "@/components/dashboard/freelancer-shell";
import { useDashboardGuard } from "@/components/dashboard/use-dashboard-guard";
import { useDashboardStore } from "@/components/providers/dashboard-store-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FreelancerProfileFormValues } from "@/types/dashboard";

export function FreelancerProfilePage() {
  const { isAuthenticated } = useDashboardGuard("freelancer");
  const { currentFreelancer, updateFreelancerProfile } = useDashboardStore();
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated || !currentFreelancer) {
    return null;
  }

  const initialValues: FreelancerProfileFormValues = {
    nome: currentFreelancer.nome,
    cidade: currentFreelancer.cidade,
    estado: currentFreelancer.estado,
    telefone: currentFreelancer.telefone ?? "",
    habilidades: currentFreelancer.habilidades?.join(", ") ?? "",
    bio: currentFreelancer.bio ?? "",
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const values: FreelancerProfileFormValues = {
      nome: String(data.get("nome") ?? ""),
      cidade: String(data.get("cidade") ?? ""),
      estado: String(data.get("estado") ?? ""),
      telefone: String(data.get("telefone") ?? ""),
      habilidades: String(data.get("habilidades") ?? ""),
      bio: String(data.get("bio") ?? ""),
    };

    updateFreelancerProfile(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <FreelancerShell
      title="Meu perfil"
      description="Mantenha suas informações atualizadas para que as empresas possam conhecer melhor seu perfil e habilidades."
    >
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="border-b border-slate-100 pb-6">
          <p className="text-sm font-medium text-brand-700">Dados do freelancer</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Editar perfil
          </h2>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Nome completo</span>
              <Input defaultValue={initialValues.nome} name="nome" required type="text" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Cidade</span>
              <Input defaultValue={initialValues.cidade} name="cidade" required type="text" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Estado (UF)</span>
              <Input
                defaultValue={initialValues.estado}
                maxLength={2}
                name="estado"
                placeholder="SP"
                required
                type="text"
              />
            </label>

            <label className="block space-y-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Telefone / WhatsApp</span>
              <Input
                defaultValue={initialValues.telefone}
                name="telefone"
                placeholder="(11) 99999-9999"
                type="tel"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Habilidades
              <span className="ml-2 font-normal text-slate-500">(separadas por vírgula)</span>
            </span>
            <Input
              defaultValue={initialValues.habilidades}
              name="habilidades"
              placeholder="Ex: Design Gráfico, Canva, Fotografia, Atendimento ao Público"
              type="text"
            />
            {/* Preview de chips */}
            {initialValues.habilidades && (
              <div className="mt-2 flex flex-wrap gap-2">
                {initialValues.habilidades
                  .split(",")
                  .map((h) => h.trim())
                  .filter(Boolean)
                  .map((skill) => (
                    <span
                      key={skill}
                      className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Bio profissional</span>
            <Textarea
              defaultValue={initialValues.bio}
              name="bio"
              placeholder="Conte sobre sua experiência, diferenciais e o tipo de trabalho que você busca…"
              rows={4}
            />
          </label>

          <div className="flex items-center gap-4 pt-2">
            <Button className="sm:w-auto" type="submit">
              Salvar perfil
            </Button>
            {saved && (
              <p className="text-sm font-semibold text-emerald-600">
                Perfil salvo com sucesso!
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Habilidades salvas (preview) */}
      {currentFreelancer.habilidades && currentFreelancer.habilidades.length > 0 && (
        <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-brand-700">Habilidades cadastradas</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Seu conjunto de skills</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {currentFreelancer.habilidades.map((skill) => (
              <span
                key={skill}
                className="rounded-2xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </FreelancerShell>
  );
}
