import type { LiveAssetKind } from "../types/marketData";
import type {
  BenchmarkComparison,
  CashFlow,
  PortfolioPerformanceMetrics,
} from "../types/portfolioPerformance";

export type PortfolioType =
  | "Stock"
  | "Mutual Fund"
  | "Fixed Deposit"
  | "Recurring Deposit"
  | "PPF"
  | "Gold"
  | "Other";

export type { LiveAssetKind };

/** Illustrative reference rates — not live market data. */
export const BENCHMARK_RATES = {
  fdAverage: 7,
  niftyHistoricalCAGR: 12,
} as const;

export interface PortfolioInvestment {
  id: string;
  name: string;
  type: PortfolioType;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  /** Twelve Data symbol or mfapi scheme code — used for live refresh */
  symbolOrCode?: string;
  /** NSE / BSE for stocks */
  exchange?: string;
  liveAssetKind?: LiveAssetKind;
  lastPriceUpdated?: string;
  /** ISO date when the holding was added / invested */
  investedAt?: string;
}

export interface PortfolioInvestmentResult
  extends PortfolioInvestment {
  investedAmount: number;
  currentValue: number;
  gain: number;
  returnPercentage: number;
}

export interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalGain: number;
  returnPercentage: number;
}

export function calculateInvestmentResult(
  investment: PortfolioInvestment
): PortfolioInvestmentResult {
  const investedAmount =
    investment.quantity * investment.buyPrice;

  const currentValue =
    investment.quantity * investment.currentPrice;

  const gain = currentValue - investedAmount;

  const returnPercentage =
    investedAmount > 0
      ? (gain / investedAmount) * 100
      : 0;

  return {
    ...investment,
    investedAmount,
    currentValue,
    gain,
    returnPercentage,
  };
}

export function calculatePortfolioSummary(
  investments: PortfolioInvestment[]
): PortfolioSummary {
  const results = investments.map(
    calculateInvestmentResult
  );

  const totalInvested = results.reduce(
    (total, investment) =>
      total + investment.investedAmount,
    0
  );

  const currentValue = results.reduce(
    (total, investment) =>
      total + investment.currentValue,
    0
  );

  const totalGain =
    currentValue - totalInvested;

  const returnPercentage =
    totalInvested > 0
      ? (totalGain / totalInvested) * 100
      : 0;

  return {
    totalInvested,
    currentValue,
    totalGain,
    returnPercentage,
  };
}
export function calculateAbsoluteReturn(
  investedAmount: number,
  currentValue: number
): number {
  if (!Number.isFinite(investedAmount) || investedAmount <= 0) {
    return 0;
  }

  if (!Number.isFinite(currentValue)) {
    return 0;
  }

  return ((currentValue - investedAmount) / investedAmount) * 100;
}

export function calculateCAGR(
  investedAmount: number,
  currentValue: number,
  investmentDurationYears: number
): number {
  if (
    !Number.isFinite(investedAmount) ||
    !Number.isFinite(currentValue) ||
    !Number.isFinite(investmentDurationYears) ||
    investedAmount <= 0 ||
    currentValue <= 0 ||
    investmentDurationYears <= 0
  ) {
    return 0;
  }

  return (
    (Math.pow(currentValue / investedAmount, 1 / investmentDurationYears) - 1) *
    100
  );
}

function yearFraction(start: Date, end: Date): number {
  return (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
}

/**
 * XIRR via Newton-Raphson. Cash flows: negative = money invested,
 * positive = value received / current portfolio value.
 */
export function calculateXIRR(cashFlows: CashFlow[]): number {
  if (cashFlows.length < 2) {
    return 0;
  }

  const sorted = [...cashFlows].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  const hasPositive = sorted.some((flow) => flow.amount > 0);
  const hasNegative = sorted.some((flow) => flow.amount < 0);

  if (!hasPositive || !hasNegative) {
    return 0;
  }

  const origin = sorted[0].date;

  function npv(rate: number): number {
    return sorted.reduce((total, flow) => {
      const years = yearFraction(origin, flow.date);
      return total + flow.amount / Math.pow(1 + rate, years);
    }, 0);
  }

  function dNpv(rate: number): number {
    return sorted.reduce((total, flow) => {
      const years = yearFraction(origin, flow.date);
      if (years === 0) {
        return total;
      }

      return total - (years * flow.amount) / Math.pow(1 + rate, years + 1);
    }, 0);
  }

  let rate = 0.1;

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const value = npv(rate);
    const derivative = dNpv(rate);

    if (Math.abs(derivative) < 1e-12) {
      break;
    }

    const next = rate - value / derivative;

    if (!Number.isFinite(next) || next <= -0.99) {
      break;
    }

    if (Math.abs(next - rate) < 1e-8) {
      rate = next;
      break;
    }

    rate = next;
  }

  if (!Number.isFinite(rate)) {
    return 0;
  }

  return rate * 100;
}

function resolveInvestedAt(investment: PortfolioInvestment): Date {
  if (investment.investedAt) {
    const parsed = new Date(investment.investedAt);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() - 1);
  return fallback;
}

export function calculatePortfolioMetrics(
  holdings: PortfolioInvestment[]
): PortfolioPerformanceMetrics {
  const summary = calculatePortfolioSummary(holdings);
  const absoluteReturn = calculateAbsoluteReturn(
    summary.totalInvested,
    summary.currentValue
  );

  if (holdings.length === 0 || summary.totalInvested <= 0) {
    return {
      cagr: 0,
      absoluteReturn: 0,
      xirr: 0,
      totalInvested: 0,
      currentValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
    };
  }

  const now = new Date();
  const investedDates = holdings.map(resolveInvestedAt);
  const earliest = new Date(
    Math.min(...investedDates.map((date) => date.getTime()))
  );
  const durationYears = Math.max(yearFraction(earliest, now), 1 / 365);

  const cagr = calculateCAGR(
    summary.totalInvested,
    summary.currentValue,
    durationYears
  );

  const cashFlows: CashFlow[] = holdings.map((holding, index) => {
    const result = calculateInvestmentResult(holding);
    return {
      date: investedDates[index],
      amount: -result.investedAmount,
    };
  });

  cashFlows.push({
    date: now,
    amount: summary.currentValue,
  });

  let xirr = calculateXIRR(cashFlows);

  if (holdings.length === 1) {
    xirr = cagr;
  }

  return {
    cagr,
    absoluteReturn,
    xirr,
    totalInvested: summary.totalInvested,
    currentValue: summary.currentValue,
    totalGainLoss: summary.totalGain,
    totalGainLossPercent: summary.returnPercentage,
  };
}

export function compareToBenchmarks(portfolioCAGR: number): BenchmarkComparison {
  return {
    vsFD: portfolioCAGR - BENCHMARK_RATES.fdAverage,
    vsNifty: portfolioCAGR - BENCHMARK_RATES.niftyHistoricalCAGR,
  };
}
