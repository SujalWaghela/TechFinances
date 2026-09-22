export interface StockSearchResult {
  symbol: string;
  instrumentName: string;
  exchange: "NSE" | "BSE";
  instrumentType: string;
  currency: string;
}

/** Normalized quote used by the portfolio UI (current price in `c`). */
export interface StockQuote {
  c: number;
  symbol: string;
  exchange: string;
}

export interface MutualFundSearchResult {
  schemeCode: number;
  schemeName: string;
}

export interface MutualFundNavDataPoint {
  date: string;
  nav: string;
}

export interface MutualFundNavMeta {
  fund_house?: string;
  scheme_type?: string;
  scheme_category?: string;
  scheme_code: number;
  scheme_name: string;
}

export interface MutualFundNav {
  meta: MutualFundNavMeta;
  data: MutualFundNavDataPoint[];
}

export type LiveAssetKind = "stock" | "mutual_fund";

export type IndianExchange = "NSE" | "BSE";

export interface SelectedInvestmentOption {
  name: string;
  type: LiveAssetKind;
  symbolOrCode: string;
  /** Required for stocks (NSE/BSE). Unused for mutual funds. */
  exchange?: IndianExchange;
}
