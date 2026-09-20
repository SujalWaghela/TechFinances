import type {
  PortfolioInvestmentResult,
  PortfolioSnapshot,
} from "./portfolioCalculator";

export interface AllocationResult {
  type: string;
  value: number;
  percentage: number;
}

export function calculateAllocation(
  investments: PortfolioInvestmentResult[]
): AllocationResult[] {
  const totalValue = investments.reduce(
    (total, investment) =>
      total + investment.currentValue,
    0
  );

  const grouped: Record<string, number> =
    {};

  investments.forEach((investment) => {
    grouped[investment.type] =
      (grouped[investment.type] || 0) +
      investment.currentValue;
  });

  return Object.entries(grouped)
    .map(([type, value]) => ({
      type,
      value,
      percentage:
        totalValue > 0
          ? (value / totalValue) * 100
          : 0,
    }))
    .sort(
      (a, b) => b.value - a.value
    );
}

export function calculateGrowth(
  snapshots: PortfolioSnapshot[]
): PortfolioSnapshot[] {
  return [...snapshots].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime()
  );
}

export function getBestInvestment(
  investments: PortfolioInvestmentResult[]
): PortfolioInvestmentResult | null {
  if (investments.length === 0) {
    return null;
  }

  return [...investments].sort(
    (a, b) =>
      b.returnPercentage -
      a.returnPercentage
  )[0];
}

export function getLargestInvestment(
  investments: PortfolioInvestmentResult[]
): PortfolioInvestmentResult | null {
  if (investments.length === 0) {
    return null;
  }

  return [...investments].sort(
    (a, b) =>
      b.currentValue -
      a.currentValue
  )[0];
}