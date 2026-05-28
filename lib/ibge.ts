import citiesData from "./cities.json";

export type CitySuggestion = {
  id: number;
  name: string;
  state: string;
};

const citiesCache: CitySuggestion[] = citiesData as CitySuggestion[];

export async function loadCities(): Promise<CitySuggestion[]> {
  return citiesCache;
}

export function normalizeName(name: string): string {
  return name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
