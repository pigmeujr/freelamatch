"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CompanyProfileFormValues } from "@/types/dashboard";

type CompanyProfileFormProps = {
  initialValues: CompanyProfileFormValues;
  onSubmit: (values: CompanyProfileFormValues) => void;
};

export function CompanyProfileForm({ initialValues, onSubmit }: CompanyProfileFormProps) {
  const [values, setValues] = useState<CompanyProfileFormValues>(initialValues);
  const [feedback, setFeedback] = useState("");

  function updateField<K extends keyof CompanyProfileFormValues>(field: K, value: CompanyProfileFormValues[K]) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
    setFeedback("Perfil atualizado com sucesso.");
  }

  return (
    <form className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Nome da empresa</span>
          <Input value={values.nome} onChange={(event) => updateField("nome", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">CNPJ</span>
          <Input value={values.cnpj} onChange={(event) => updateField("cnpj", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">CEP</span>
          <Input value={values.cep} onChange={(event) => updateField("cep", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Endereço</span>
          <Input value={values.endereco} onChange={(event) => updateField("endereco", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Bairro</span>
          <Input value={values.bairro} onChange={(event) => updateField("bairro", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Número</span>
          <Input value={values.numero} onChange={(event) => updateField("numero", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">WhatsApp</span>
          <Input value={values.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Logo (URL)</span>
          <Input value={values.logoUrl} onChange={(event) => updateField("logoUrl", event.target.value)} />
        </label>

        <label className="block space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Descrição</span>
          <Textarea value={values.descricao} onChange={(event) => updateField("descricao", event.target.value)} />
        </label>
      </div>

      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {feedback}
        </div>
      ) : null}

      <Button className="sm:w-auto" type="submit">
        Salvar alterações
      </Button>
    </form>
  );
}