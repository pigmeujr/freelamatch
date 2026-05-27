export type IbgeCity = {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  };
};

export type CitySuggestion = {
  id: number;
  name: string;
  state: string;
};

let citiesCache: CitySuggestion[] | null = null;

export async function loadCities(): Promise<CitySuggestion[]> {
  if (citiesCache) {
    return citiesCache;
  }

  const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/municipios");

  if (!response.ok) {
    throw new Error("Não foi possível carregar cidades do IBGE.");
  }

  const data = (await response.json()) as IbgeCity[];

  citiesCache = data.map((city) => ({
    id: city.id,
    name: city.nome,
    state: city.microrregiao.mesorregiao.UF.sigla,
  }));

  return citiesCache;
}

export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
