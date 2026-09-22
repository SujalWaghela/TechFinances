import type { PortfolioInvestment } from "./portfolioCalculator";

const PORTFOLIO_PREFIX = "techfinance-portfolio:";
const LEGACY_PORTFOLIO_KEY = "techfinance-portfolio";

export function getPortfolioStorageKey(userId: string): string {
  return `${PORTFOLIO_PREFIX}${userId}`;
}

export function loadUserPortfolio(userId: string): PortfolioInvestment[] {
  if (!userId) {
    return [];
  }

  try {
    const saved = localStorage.getItem(getPortfolioStorageKey(userId));

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved) as PortfolioInvestment[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveUserPortfolio(
  userId: string,
  investments: PortfolioInvestment[]
): void {
  if (!userId) {
    return;
  }

  localStorage.setItem(
    getPortfolioStorageKey(userId),
    JSON.stringify(investments)
  );

  // Clear shared legacy key so old global data cannot leak across accounts.
  if (localStorage.getItem(LEGACY_PORTFOLIO_KEY)) {
    localStorage.removeItem(LEGACY_PORTFOLIO_KEY);
  }
}
