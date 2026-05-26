"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CityAutocompleteField } from "@/components/dashboard/city-autocomplete-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { JobFormValues } from "@/types/dashboard";

type JobFormProps = {
  initialValues?: JobFormValues;
  submitLabel: string;
  successMessage: string;
  onSubmit: (values: JobFormValues) => void;
  cancelHref?: string;
};

const defaultValues: JobFormValues = {
  titulo: "",
  descricao: "",
  requisitos: "",
  valor: "",
  tipoValor: "dia",
  horario: "",
  cidade: "",
  estado: "",
  bairro: "",
};

export function JobForm({ initialValues, submitLabel, successMessage, onSubmit, cancelHref }: JobFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(initialValues ?? defaultValues);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormValues, string>>>({});
  const [feedback, setFeedback] = useState("");

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function updateField<K extends keyof JobFormValues>(field: K, value: JobFormValues[K]) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  function validate() {
    const nextErrors: Partial<Record<keyof JobFormValues, string>> = {};

    if (!values.titulo.trim()) nextErrors.titulo = "Informe o título da vaga.";
    if (values.descricao.trim().length < 30) nextErrors.descricao = "Descreva a vaga com pelo menos 30 caracteres.";
    if (!values.requisitos.trim()) nextErrors.requisitos = "Informe os requisitos.";
    if (!values.valor.trim() || Number(values.valor) <= 0) nextErrors.valor = "Informe um valor válido.";
    if (!values.horario.trim()) nextErrors.horario = "Informe o horário.";
    if (!values.cidade.trim()) nextErrors.cidade = "Selecione a cidade.";
    if (!values.estado.trim()) nextErrors.estado = "Informe o estado.";
    if (!values.bairro.trim()) nextErrors.bairro = "Informe o bairro.";

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      setFeedback("");
      return;
    }

    onSubmit(values);
    setFeedback(successMessage);
  }

  return (
    <form className="space-y-6 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-2">
        <label className="block space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Título da vaga</span>
          <Input value={values.titulo} onChange={(event) => updateField("titulo", event.target.value)} />
          {errors.titulo ? <p className="text-sm text-rose-600">{errors.titulo}</p> : null}
        </label>

        <label className="block space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Descrição</span>
          <Textarea value={values.descricao} onChange={(event) => updateField("descricao", event.target.value)} />
          {errors.descricao ? <p className="text-sm text-rose-600">{errors.descricao}</p> : null}
        </label>

        <label className="block space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Requisitos</span>
          <Textarea
            value={values.requisitos}
            onChange={(event) => updateField("requisitos", event.target.value)}
            placeholder="Separe por vírgula ou uma linha por requisito"
          />
          {errors.requisitos ? <p className="text-sm text-rose-600">{errors.requisitos}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Valor</span>
          <Input
            inputMode="decimal"
            value={values.valor}
            onChange={(event) => updateField("valor", event.target.value)}
            placeholder="Ex.: 650"
          />
          {errors.valor ? <p className="text-sm text-rose-600">{errors.valor}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Tipo de valor</span>
          <select
            className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            value={values.tipoValor}
            onChange={(event) => updateField("tipoValor", event.target.value as JobFormValues["tipoValor"])}
          >
            <option value="dia">Por dia</option>
            <option value="hora">Por hora</option>
            <option value="projeto">Por projeto</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Horário</span>
          <Input value={values.horario} onChange={(event) => updateField("horario", event.target.value)} />
          {errors.horario ? <p className="text-sm text-rose-600">{errors.horario}</p> : null}
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Cidade</span>
          <CityAutocompleteField
            value={values.cidade}
            stateValue={values.estado}
            onCityChange={(value) => updateField("cidade", value)}
            onStateChange={(value) => updateField("estado", value)}
          />
          {errors.cidade ? <p className="text-sm text-rose-600">{errors.cidade}</p> : null}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Estado</span>
          <Input
            maxLength={2}
            value={values.estado}
            onChange={(event) => updateField("estado", event.target.value.toUpperCase())}
          />
          {errors.estado ? <p className="text-sm text-rose-600">{errors.estado}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Bairro</span>
          <Input value={values.bairro} onChange={(event) => updateField("bairro", event.target.value)} />
          {errors.bairro ? <p className="text-sm text-rose-600">{errors.bairro}</p> : null}
        </label>
      </div>

      {feedback ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {feedback}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button className="sm:w-auto" type="submit">
          {submitLabel}
        </Button>
        {cancelHref ? (
          <Button
            className="border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 sm:w-auto"
            onClick={() => router.push(cancelHref)}
            type="button"
          >
            Cancelar
          </Button>
        ) : null}
      </div>

      {hasErrors ? <p className="text-sm text-slate-500">Revise os campos destacados antes de salvar.</p> : null}
    </form>
  );
}