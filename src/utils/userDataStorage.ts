import type { PortfolioInvestment } from "./portfolioCalculator";

const PORTFOLIO_PREFIX = "techfinance-portfolio:";
const HISTORY_PREFIX = "techfinance-portfolio-history:";
const LEGACY_PORTFOLIO_KEY = "techfinance-portfolio";
const HISTORY_LIMIT = 50;

export interface PortfolioHistoryPoint {
  date: string;
  totalValue: number;
  totalInvested: number;
}

export function getPortfolioStorageKey(userId: string): string {
  return `${PORTFOLIO_PREFIX}${userId}`;
}

function getHistoryStorageKey(userId: string): string {
  return `${HISTORY_PREFIX}${userId}`;
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

export function loadPortfolioHistory(userId: string): PortfolioHistoryPoint[] {
  if (!userId) {
    return [];
  }

  try {
    const raw = localStorage.getItem(getHistoryStorageKey(userId));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as PortfolioHistoryPoint[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendPortfolioHistory(
  userId: string,
  point: PortfolioHistoryPoint
): PortfolioHistoryPoint[] {
  if (!userId) {
    return [];
  }

  const current = loadPortfolioHistory(userId);
  const next = [...current, point].slice(-HISTORY_LIMIT);
  localStorage.setItem(getHistoryStorageKey(userId), JSON.stringify(next));
  return next;
}
