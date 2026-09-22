import type {
  IndianExchange,
  StockQuote,
  StockSearchResult,
} from "../types/marketData";

const TWELVE_DATA_BASE = "https://api.twelvedata.com";

function getApiKey(): string {
  const key = import.meta.env.VITE_TWELVEDATA_API_KEY;
  return typeof key === "string" ? key.trim() : "";
}

export class StockApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockApiError";
  }
}

interface TwelveDataErrorBody {
  code?: number | string;
  message?: string;
  status?: string;
}

interface TwelveDataSearchItem {
  symbol: string;
  instrument_name: string;
  exchange: string;
  instrument_type?: string;
  currency?: string;
  country?: string;
}

interface TwelveDataSearchResponse extends TwelveDataErrorBody {
  data?: TwelveDataSearchItem[];
  status?: string;
}

interface TwelveDataPriceResponse extends TwelveDataErrorBody {
  price?: string | number;
}

function isIndianExchange(value: string): value is IndianExchange {
  return value === "NSE" || value === "BSE";
}

function throwIfApiError(data: TwelveDataErrorBody, fallback: string): void {
  const code = typeof data.code === "string" ? Number(data.code) : data.code;

  if (code === 429 || data.message?.toLowerCase().includes("api credits")) {
    throw new StockApiError(
      "Twelve Data rate limit reached. Please wait a moment and try again."
    );
  }

  if (data.status === "error" || (typeof code === "number" && code >= 400)) {
    throw new StockApiError(data.message || fallback);
  }
}

async function twelveDataFetch(
  path: string,
  params: Record<string, string>
): Promise<unknown> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new StockApiError(
      "Twelve Data API key missing. Add VITE_TWELVEDATA_API_KEY to your .env file."
    );
  }

  const url = new URL(`${TWELVE_DATA_BASE}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set("apikey", apiKey);

  let response: Response;

  try {
    response = await fetch(url.toString());
  } catch {
    throw new StockApiError(
      "Unable to reach Twelve Data. Check your internet connection and try again."
    );
  }

  if (response.status === 401 || response.status === 403) {
    throw new StockApiError(
      "Twelve Data rejected the API key. Verify VITE_TWELVEDATA_API_KEY."
    );
  }

  if (response.status === 429) {
    throw new StockApiError(
      "Twelve Data rate limit reached. Please wait a moment and try again."
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new StockApiError(`Twelve Data returned an invalid response (${response.status}).`);
  }

  if (!response.ok) {
    const body = data as TwelveDataErrorBody;
    throwIfApiError(body, `Twelve Data request failed (${response.status}).`);
    throw new StockApiError(`Twelve Data request failed (${response.status}).`);
  }

  throwIfApiError(data as TwelveDataErrorBody, "Twelve Data request failed.");
  return data;
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return [];
  }

  const data = (await twelveDataFetch("/symbol_search", {
    symbol: trimmed,
  })) as TwelveDataSearchResponse;

  const rows = Array.isArray(data.data) ? data.data : [];

  return rows
    .filter(
      (item): item is TwelveDataSearchItem & { exchange: IndianExchange } =>
        isIndianExchange(item.exchange) && Boolean(item.symbol)
    )
    .map((item) => ({
      symbol: item.symbol,
      instrumentName: item.instrument_name || item.symbol,
      exchange: item.exchange,
      instrumentType: item.instrument_type || "Equity",
      currency: item.currency || "INR",
    }))
    .slice(0, 8);
}

export async function getStockQuote(
  symbol: string,
  exchange: string
): Promise<StockQuote> {
  const cleanSymbol = symbol.trim().toUpperCase();
  const cleanExchange = exchange.trim().toUpperCase();

  if (!isIndianExchange(cleanExchange)) {
    throw new StockApiError("Only NSE and BSE stocks are supported.");
  }

  const data = (await twelveDataFetch("/price", {
    symbol: cleanSymbol,
    exchange: cleanExchange,
  })) as TwelveDataPriceResponse;

  const price = Number(data.price);

  if (!Number.isFinite(price) || price <= 0) {
    throw new StockApiError(
      `No live price available for ${cleanSymbol} (${cleanExchange}).`
    );
  }

  return {
    c: price,
    symbol: cleanSymbol,
    exchange: cleanExchange,
  };
}

/**
 * Fetch live prices for multiple symbols on the same exchange in one request.
 * Returns a map of SYMBOL → price. Missing/failed symbols are omitted.
 */
export async function getStockPricesBatch(
  symbols: string[],
  exchange: IndianExchange
): Promise<Record<string, number>> {
  const unique = [
    ...new Set(
      symbols
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean)
    ),
  ];

  if (unique.length === 0) {
    return {};
  }

  if (unique.length === 1) {
    const quote = await getStockQuote(unique[0], exchange);
    return { [unique[0]]: quote.c };
  }

  const data = await twelveDataFetch("/price", {
    symbol: unique.join(","),
    exchange,
  });

  // Single-shape fallback (some plans may still return { price } for 1 item)
  if (
    data &&
    typeof data === "object" &&
    "price" in data &&
    !unique.some((symbol) => symbol in (data as Record<string, unknown>))
  ) {
    const price = Number((data as TwelveDataPriceResponse).price);
    if (Number.isFinite(price) && price > 0) {
      return { [unique[0]]: price };
    }
    return {};
  }

  const prices: Record<string, number> = {};
  const payload = data as Record<string, TwelveDataPriceResponse>;

  unique.forEach((symbol) => {
    const entry = payload[symbol];
    if (!entry) {
      return;
    }

    const code =
      typeof entry.code === "string" ? Number(entry.code) : entry.code;

    if (code === 429) {
      throw new StockApiError(
        "Twelve Data rate limit reached. Please wait a moment and try again."
      );
    }

    if (entry.status === "error") {
      return;
    }

    const price = Number(entry.price);
    if (Number.isFinite(price) && price > 0) {
      prices[symbol] = price;
    }
  });

  return prices;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
