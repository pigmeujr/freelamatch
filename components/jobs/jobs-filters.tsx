"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchCityForm } from "@/components/home/search-city-form";

type JobsFiltersProps = {
  initialCity: string;
  initialState: string;
  initialType: string;
  states: string[];
};

export function JobsFilters({ initialCity, initialState, initialType, states }: JobsFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedState, setSelectedState] = useState(initialState);

  const hiddenFields = useMemo(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("cidade");
    currentParams.delete("estado");
    currentParams.delete("tipo");

    return Array.from(currentParams.entries()).map(([name, value]) => ({ name, value }));
  }, [searchParams]);

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.push(params.toString() ? `${pathname}?${params.toString()}` : pathname);
  }

  return (
    <div className="space-y-4">
      <SearchCityForm
        action="/vagas"
        initialCity={initialCity}
        hiddenFields={hiddenFields}
        submitLabel="Atualizar vagas"
        submitOnSelect
        stateFilter={selectedState}
      >
        <div className="grid gap-3 md:grid-cols-[180px_180px]">
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Estado
            <select
              className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-normal text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              defaultValue={initialState}
              name="estado"
              onChange={(event) => {
                setSelectedState(event.target.value);
                updateParam("estado", event.target.value);
              }}
            >
              <option value="">Todos os estados</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            Tipo de valor
            <select
              className="h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm font-normal text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              defaultValue={initialType}
              name="tipo"
              onChange={(event) => updateParam("tipo", event.target.value)}
            >
              <option value="">Todos os formatos</option>
              <option value="dia">Por dia</option>
              <option value="hora">Por hora</option>
              <option value="projeto">Por projeto</option>
            </select>
          </label>
        </div>
      </SearchCityForm>
    </div>
  );
}
