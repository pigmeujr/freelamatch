"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { loadCities, normalizeName, type CitySuggestion } from "@/lib/ibge";

type CityAutocompleteFieldProps = {
  value: string;
  stateValue: string;
  onCityChange: (value: string) => void;
  onStateChange: (value: string) => void;
};

export function CityAutocompleteField({
  value,
  stateValue,
  onCityChange,
  onStateChange,
}: CityAutocompleteFieldProps) {
  const [cities, setCities] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function searchCities() {
      if (value.trim().length < 2) {
        setCities([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);

      try {
        const allCities = await loadCities();
        const normalizedInput = normalizeName(value);
        const filtered = allCities
          .filter((city) => normalizeName(city.name).includes(normalizedInput))
          .slice(0, 8);

        if (isMounted) {
          setCities(filtered);
          setIsOpen(filtered.length > 0);
        }
      } catch {
        if (isMounted) {
          setCities([]);
          setIsOpen(false);
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
  }, [value]);

  const helperText = useMemo(() => {
    if (isLoading) {
      return "Buscando cidades no IBGE...";
    }

    if (value.trim().length >= 2 && cities.length === 0) {
      return "Nenhuma cidade encontrada.";
    }

    return "Digite pelo menos 2 letras para sugerir cidade e UF.";
  }, [cities.length, isLoading, value]);

  return (
    <div className="relative">
      <Input
        autoComplete="off"
        name="cidade"
        onChange={(event) => onCityChange(event.target.value)}
        onFocus={() => {
          if (cities.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder="Ex.: São Paulo"
        value={value}
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
                    onCityChange(city.name);
                    onStateChange(city.state);
                    setIsOpen(false);
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
      <p className="mt-2 px-1 text-xs text-slate-500">
        {stateValue ? `${helperText} UF selecionada: ${stateValue}.` : helperText}
      </p>
    </div>
  );
}