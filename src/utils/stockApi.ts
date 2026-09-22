import type {
  IndianExchange,
  StockQuote,
  StockSearchResult,
} from "../types/marketData";

const TWELVE_DATA_BASE = "https://api.twelvedata.com";

function getApiKey(): string {
  const raw = import.meta.env.VITE_TWELVEDATA_API_KEY;
  if (typeof raw !== "string") {
    return "";
  }

  // Strip accidental quotes/spaces from .env values like KEY="abc"
  return raw.trim().replace(/^['"]|['"]$/g, "");
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

interface YahooChartResponse {
  chart?: {
    result?: Array<{
      meta?: {
        regularMarketPrice?: number;
        previousClose?: number;
        symbol?: string;
      };
    }>;
    error?: { description?: string } | null;
  };
}

function isIndianExchange(value: string): value is IndianExchange {
  return value === "NSE" || value === "BSE";
}

function toYahooSymbol(symbol: string, exchange: IndianExchange): string {
  const clean = symbol.trim().toUpperCase().replace(/\.(NS|BO)$/i, "");
  return exchange === "BSE" ? `${clean}.BO` : `${clean}.NS`;
}

function throwIfApiError(data: TwelveDataErrorBody, fallback: string): void {
  const code = typeof data.code === "string" ? Number(data.code) : data.code;
  const message = (data.message || "").toLowerCase();

  if (code === 429 || message.includes("api credits")) {
    throw new StockApiError(
      "Twelve Data rate limit reached. Please wait a moment and try again."
    );
  }

  if (data.status === "error" || (typeof code === "number" && code >= 400)) {
    throw new StockApiError(data.message || fallback);
  }
}

function isPlanRestrictedError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();
  return (
    message.includes("grow or venture") ||
    message.includes("consider upgrading") ||
    message.includes("available starting with")
  );
}

async function twelveDataFetch(
  path: string,
  params: Record<string, string>
): Promise<unknown> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new StockApiError(
      "Twelve Data API key missing. Add VITE_TWELVEDATA_API_KEY to your .env file (not .env.example), then restart npm run dev."
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
    throw new StockApiError(
      `Twelve Data returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    const body = data as TwelveDataErrorBody;
    throwIfApiError(body, `Twelve Data request failed (${response.status}).`);
    throw new StockApiError(`Twelve Data request failed (${response.status}).`);
  }

  throwIfApiError(data as TwelveDataErrorBody, "Twelve Data request failed.");
  return data;
}

async function getYahooQuote(
  symbol: string,
  exchange: IndianExchange
): Promise<StockQuote> {
  const yahooSymbol = toYahooSymbol(symbol, exchange);
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    yahooSymbol
  )}?interval=1d&range=1d`;

  let response: Response;

  try {
    response = await fetch(url);
  } catch {
    throw new StockApiError(
      `Unable to fetch live price for ${symbol} (${exchange}).`
    );
  }

  if (!response.ok) {
    throw new StockApiError(
      `Live price unavailable for ${symbol} (${exchange}).`
    );
  }

  const data = (await response.json()) as YahooChartResponse;
  const meta = data.chart?.result?.[0]?.meta;
  const price = Number(meta?.regularMarketPrice ?? meta?.previousClose);

  if (!Number.isFinite(price) || price <= 0) {
    throw new StockApiError(
      `No live price available for ${symbol} (${exchange}).`
    );
  }

  return {
    c: price,
    symbol: symbol.trim().toUpperCase(),
    exchange,
  };
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return [];
  }

  // Prefer the full query; also try the first word (e.g. "Jio" from "Jio Financial").
  const candidates = [trimmed];
  const firstWord = trimmed.split(/\s+/)[0];
  if (
    firstWord &&
    firstWord.toLowerCase() !== trimmed.toLowerCase() &&
    firstWord.length >= 2
  ) {
    candidates.push(firstWord);
  }

  const seen = new Set<string>();
  const results: StockSearchResult[] = [];

  for (const candidate of candidates) {
    const data = (await twelveDataFetch("/symbol_search", {
      symbol: candidate,
    })) as TwelveDataSearchResponse;

    const rows = Array.isArray(data.data) ? data.data : [];

    rows
      .filter(
        (item): item is TwelveDataSearchItem & { exchange: IndianExchange } =>
          isIndianExchange(item.exchange) && Boolean(item.symbol)
      )
      .forEach((item) => {
        const key = `${item.symbol}|${item.exchange}`;
        if (seen.has(key)) {
          return;
        }
        seen.add(key);
        results.push({
          symbol: item.symbol,
          instrumentName: item.instrument_name || item.symbol,
          exchange: item.exchange,
          instrumentType: item.instrument_type || "Equity",
          currency: item.currency || "INR",
        });
      });

    if (results.length >= 8) {
      break;
    }
  }

  return results.slice(0, 8);
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

  try {
    const data = (await twelveDataFetch("/price", {
      symbol: cleanSymbol,
      exchange: cleanExchange,
    })) as TwelveDataPriceResponse;

    const price = Number(data.price);

    if (Number.isFinite(price) && price > 0) {
      return {
        c: price,
        symbol: cleanSymbol,
        exchange: cleanExchange,
      };
    }
  } catch (error: unknown) {
    // Free Twelve Data plans omit many NSE/BSE symbols — fall back below.
    if (
      error instanceof StockApiError &&
      !isPlanRestrictedError(error) &&
      !error.message.toLowerCase().includes("no live price") &&
      !error.message.toLowerCase().includes("request failed")
    ) {
      // Still try Yahoo for most quote failures except missing API key / auth.
      if (
        error.message.includes("API key missing") ||
        error.message.includes("rejected the API key")
      ) {
        throw error;
      }
    }
  }

  return getYahooQuote(cleanSymbol, cleanExchange);
}

/**
 * Fetch live prices for multiple symbols on the same exchange.
 * Uses Twelve Data batch when possible, then fills gaps via Yahoo Finance.
 */
export async function getStockPricesBatch(
  symbols: string[],
  exchange: IndianExchange
): Promise<Record<string, number>> {
  const unique = [
    ...new Set(
      symbols.map((symbol) => symbol.trim().toUpperCase()).filter(Boolean)
    ),
  ];

  if (unique.length === 0) {
    return {};
  }

  const prices: Record<string, number> = {};

  try {
    if (unique.length === 1) {
      const quote = await getStockQuote(unique[0], exchange);
      prices[unique[0]] = quote.c;
      return prices;
    }

    const data = await twelveDataFetch("/price", {
      symbol: unique.join(","),
      exchange,
    });

    if (
      data &&
      typeof data === "object" &&
      "price" in data &&
      !unique.some((symbol) => symbol in (data as Record<string, unknown>))
    ) {
      const price = Number((data as TwelveDataPriceResponse).price);
      if (Number.isFinite(price) && price > 0) {
        prices[unique[0]] = price;
      }
    } else {
      const payload = data as Record<string, TwelveDataPriceResponse>;

      unique.forEach((symbol) => {
        const entry = payload[symbol];
        if (!entry || entry.status === "error") {
          return;
        }

        const price = Number(entry.price);
        if (Number.isFinite(price) && price > 0) {
          prices[symbol] = price;
        }
      });
    }
  } catch {
    // Fall through to Yahoo fill below.
  }

  for (const symbol of unique) {
    if (prices[symbol]) {
      continue;
    }

    try {
      const quote = await getYahooQuote(symbol, exchange);
      prices[symbol] = quote.c;
    } catch {
      // Leave missing; caller reports partial failures.
    }

    await delay(200);
  }

  return prices;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
