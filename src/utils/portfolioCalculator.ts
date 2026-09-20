export type PortfolioType =
  | "Stock"
  | "Mutual Fund"
  | "Fixed Deposit"
  | "Recurring Deposit"
  | "PPF"
  | "Gold"
  | "Other";

export interface PortfolioInvestment {
  id: string;
  name: string;
  type: PortfolioType;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
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

export interface PortfolioSnapshot {
  id: string;
  date: string;
  totalInvested: number;
  currentValue: number;
  totalGain: number;
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