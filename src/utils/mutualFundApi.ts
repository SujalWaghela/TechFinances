import type {
  MutualFundNav,
  MutualFundSearchResult,
} from "../types/marketData";

const MF_BASE = "https://api.mfapi.in";

let schemeCache: MutualFundSearchResult[] | null = null;
let schemeCachePromise: Promise<MutualFundSearchResult[]> | null = null;

export class MutualFundApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MutualFundApiError";
  }
}

async function mfFetch<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${MF_BASE}${path}`);
  } catch {
    throw new MutualFundApiError(
      "Unable to reach mfapi.in. Check your internet connection and try again."
    );
  }

  if (response.status === 429) {
    throw new MutualFundApiError(
      "Mutual fund API rate limit reached. Please wait and retry."
    );
  }

  if (!response.ok) {
    throw new MutualFundApiError(`Mutual fund request failed (${response.status}).`);
  }

  return (await response.json()) as T;
}

async function loadAllSchemes(): Promise<MutualFundSearchResult[]> {
  if (schemeCache) {
    return schemeCache;
  }

  if (schemeCachePromise) {
    return schemeCachePromise;
  }

  schemeCachePromise = mfFetch<MutualFundSearchResult[]>("/mf")
    .then((data) => {
      const list = Array.isArray(data)
        ? data.filter(
            (item) =>
              typeof item.schemeCode === "number" &&
              typeof item.schemeName === "string" &&
              item.schemeName.length > 0
          )
        : [];

      schemeCache = list;
      return list;
    })
    .catch((error: unknown) => {
      schemeCachePromise = null;
      throw error;
    });

  return schemeCachePromise;
}

export async function searchMutualFunds(
  query: string
): Promise<MutualFundSearchResult[]> {
  const trimmed = query.trim().toLowerCase();

  if (trimmed.length < 2) {
    return [];
  }

  const schemes = await loadAllSchemes();

  return schemes
    .filter((scheme) => scheme.schemeName.toLowerCase().includes(trimmed))
    .slice(0, 8);
}

export async function getMutualFundNav(schemeCode: string): Promise<MutualFundNav> {
  const data = await mfFetch<MutualFundNav>(`/mf/${schemeCode}/latest`);

  const latest = data?.data?.[0];
  const nav = latest ? Number(latest.nav) : NaN;

  if (!Number.isFinite(nav) || nav <= 0) {
    throw new MutualFundApiError(
      `No live NAV available for scheme ${schemeCode}. Try another fund.`
    );
  }

  return data;
}

export function getNavValue(navResponse: MutualFundNav): number {
  return Number(navResponse.data[0].nav);
}
