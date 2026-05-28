"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const justSelectedRef = useRef(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [cities, setCities] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function searchCities() {
      // Ignorar execução logo após seleção para evitar reabrir o dropdown
      if (justSelectedRef.current) {
        justSelectedRef.current = false;
        return;
      }

      if (value.trim().length < 2) {
        setCities([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      setLoadError(false);

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
  }, [value]);

  const helperText = useMemo(() => {
    if (isLoading) return "Buscando cidades no IBGE...";
    if (loadError) return "Erro ao carregar cidades. Verifique sua conexão.";
    if (value.trim().length < 2) return "Digite pelo menos 2 letras para sugerir cidade e UF.";
    if (!isOpen && cities.length === 0) return "Nenhuma cidade encontrada.";
    return null;
  }, [cities.length, isLoading, loadError, value, isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Input
        autoComplete="off"
        name="cidade"
        onChange={(event) => {
          setDisplayValue(event.target.value);
          onCityChange(event.target.value);
          onStateChange("");
        }}
        onFocus={() => {
          if (cities.length > 0) {
            setIsOpen(true);
          }
        }}
        placeholder="Ex.: São Paulo"
        value={displayValue}
      />
      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
          <ul className="max-h-72 overflow-y-auto py-2">
            {cities.map((city) => (
              <li key={city.id}>
                <button
                  className="w-full px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                  onClick={(event) => {
                    event.preventDefault();
                    justSelectedRef.current = true;
                    setDisplayValue(`${city.name} - ${city.state}`);
                    onCityChange(city.name);
                    onStateChange(city.state);
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  {city.name} - {city.state}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {helperText && (
        <p className="mt-2 px-1 text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  );
}
