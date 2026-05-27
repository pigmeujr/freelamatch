"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadCities, normalizeName, type CitySuggestion } from "@/lib/ibge";

type HiddenField = {
  name: string;
  value: string;
};

type SearchCityFormProps = {
  action?: string;
  initialCity?: string;
  submitLabel?: string;
  submitOnSelect?: boolean;
  hiddenFields?: HiddenField[];
  /** Quando fornecido, filtra apenas cidades desse estado (sigla, ex.: "SP"). Vazio = todos os estados. */
  stateFilter?: string;
  children?: React.ReactNode;
};

export function SearchCityForm({
  action = "/vagas",
  initialCity = "",
  submitLabel = "Buscar vagas",
  submitOnSelect = false,
  hiddenFields = [],
  stateFilter = "",
  children,
}: SearchCityFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [cityInput, setCityInput] = useState(initialCity);
  const [cities, setCities] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function searchCities() {
      if (cityInput.trim().length < 2) {
        setCities([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setLoadError(false);

      try {
        const allCities = await loadCities();
        const normalizedInput = normalizeName(cityInput);

        const filteredCities = allCities
          .filter((city) => {
            const matchesName = normalizeName(city.name).includes(normalizedInput);
            const matchesState = stateFilter
              ? city.state.toUpperCase() === stateFilter.toUpperCase()
              : true;
            return matchesName && matchesState;
          })
          .slice(0, 8);

        if (isMounted) {
          setCities(filteredCities);
          setIsOpen(filteredCities.length > 0);
        }
      } catch {
        if (isMounted) {
          setCities([]);
          setIsOpen(false);
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    const timeout = window.setTimeout(searchCities, 180);

    return () => {
      isMounted = false;
      window.clearTimeout(timeout);
    };
  }, [cityInput, stateFilter]);

  const helperText = useMemo(() => {
    if (isLoading) {
      return "Buscando cidades...";
    }

    if (loadError) {
      return "Erro ao carregar cidades. Verifique sua conexão.";
    }

    if (cityInput.trim().length < 2) {
      return "Digite pelo menos 2 letras para ver sugestões.";
    }

    if (!isOpen && cities.length === 0) {
      return stateFilter
        ? `Nenhuma cidade encontrada em ${stateFilter}. Tente outro nome.`
        : "Nenhuma cidade encontrada. Verifique o nome digitado.";
    }

    return null;
  }, [cities.length, cityInput, isLoading, loadError, isOpen, stateFilter]);

  function navigateWithParams(city: string) {
    const params = new URLSearchParams();

    hiddenFields.forEach((field) => {
      if (field.value) {
        params.set(field.name, field.value);
      }
    });

    const formData = formRef.current ? new FormData(formRef.current) : null;

    if (formData) {
      Array.from(formData.entries()).forEach(([name, value]) => {
        if (typeof value === "string" && value.trim()) {
          params.set(name, value);
        }
      });
    }

    if (city.trim()) {
      params.set("cidade", city.trim());
    } else {
      params.delete("cidade");
    }

    router.push(params.toString() ? `${action}?${params.toString()}` : action);
  }

  function handleSuggestionSelect(city: CitySuggestion) {
    setCityInput(city.name);
    setIsOpen(false);

    if (submitOnSelect) {
      navigateWithParams(city.name);
    }
  }

  return (
    <form
      action={action}
      className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-soft"
      method="GET"
      ref={formRef}
    >
      {hiddenFields.map((field) => (
        <input key={`${field.name}-${field.value}`} name={field.name} type="hidden" value={field.value} />
      ))}

      <div className="flex flex-col gap-3 xl:flex-row xl:items-start">
        <div className="relative flex-1">
          <Input
            autoComplete="off"
            name="cidade"
            onChange={(event) => {
              setCityInput(event.target.value);
            }}
            onFocus={() => {
              if (cities.length > 0) {
                setIsOpen(true);
              }
            }}
            placeholder="Digite a cidade, ex.: Recife"
            value={cityInput}
          />

          {isOpen ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
              <ul className="max-h-72 overflow-y-auto py-2">
                {cities.map((city) => (
                  <li key={city.id}>
                    <button
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                      onClick={(event) => {
                        event.preventDefault();
                        handleSuggestionSelect(city);
                      }}
                      type="button"
                    >
                      <span>{city.name}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-500">
                        {city.state}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {helperText ? <p className="mt-2 px-1 text-xs text-slate-500">{helperText}</p> : null}
        </div>

        {children}

        <Button className="xl:w-auto" type="submit">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
