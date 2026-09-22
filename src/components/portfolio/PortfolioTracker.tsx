import { useEffect, useMemo, useRef, useState } from "react";

import PortfolioInput from "./PortfolioInput";
import PortfolioSummary from "./PortfolioSummary";
import PortfolioTable from "./PortfolioTable";
import PortfolioChart from "./PortfolioChart";
import PerformanceSummaryCard from "./PerformanceSummaryCard";

import {
  calculateInvestmentResult,
  calculatePortfolioMetrics,
  calculatePortfolioSummary,
  type PortfolioInvestment,
} from "../../utils/portfolioCalculator";
import {
  appendPortfolioHistory,
  loadUserPortfolio,
  saveUserPortfolio,
} from "../../utils/userDataStorage";
import { generatePortfolioReport } from "../../utils/reportGenerator";
import {
  getMutualFundNav,
  getNavValue,
} from "../../utils/mutualFundApi";
import {
  delay,
  getStockPricesBatch,
  StockApiError,
} from "../../utils/stockApi";
import type { IndianExchange } from "../../types/marketData";

interface PortfolioTrackerProps {
  userId: string;
}

function formatUpdatedAt(iso: string | null): string {
  if (!iso) {
    return "Not refreshed yet";
  }

  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PortfolioTracker({ userId }: PortfolioTrackerProps) {
  const [investments, setInvestments] = useState<PortfolioInvestment[]>(() =>
    loadUserPortfolio(userId)
  );
  const [hydrated, setHydrated] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);
  const historySnapshotTaken = useRef(false);

  useEffect(() => {
    const loaded = loadUserPortfolio(userId);
    setInvestments(loaded);
    setHydrated(true);
    historySnapshotTaken.current = false;

    const latest = loaded
      .map((item) => item.lastPriceUpdated)
      .filter((value): value is string => Boolean(value))
      .sort()
      .at(-1);

    setLastRefreshedAt(latest ?? null);
  }, [userId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveUserPortfolio(userId, investments);
  }, [userId, investments, hydrated]);

  const results = useMemo(
    () => investments.map(calculateInvestmentResult),
    [investments]
  );

  const summary = useMemo(
    () => calculatePortfolioSummary(investments),
    [investments]
  );

  const performanceMetrics = useMemo(
    () => calculatePortfolioMetrics(investments),
    [investments]
  );

  useEffect(() => {
    if (!hydrated || investments.length === 0 || historySnapshotTaken.current) {
      return;
    }

    historySnapshotTaken.current = true;
    appendPortfolioHistory(userId, {
      date: new Date().toISOString(),
      totalValue: summary.currentValue,
      totalInvested: summary.totalInvested,
    });
  }, [
    hydrated,
    userId,
    investments.length,
    summary.currentValue,
    summary.totalInvested,
  ]);

  const refreshableCount = useMemo(
    () =>
      investments.filter(
        (item) => item.symbolOrCode && item.liveAssetKind
      ).length,
    [investments]
  );

  function handleAddInvestment(investment: PortfolioInvestment) {
    setInvestments((current) => [...current, investment]);
    if (investment.lastPriceUpdated) {
      setLastRefreshedAt(investment.lastPriceUpdated);
    }
  }

  function handleDeleteInvestment(id: string) {
    setInvestments((current) =>
      current.filter((investment) => investment.id !== id)
    );
  }

  function handleClearPortfolio() {
    const confirmed = window.confirm(
      "Are you sure you want to remove all investments?"
    );

    if (!confirmed) {
      return;
    }

    setInvestments([]);
    setLastRefreshedAt(null);
    setRefreshError(null);
  }

  async function handleRefreshPrices() {
    if (refreshableCount === 0) {
      setRefreshError(
        "No live-linked holdings to refresh. Add stocks or mutual funds via search."
      );
      return;
    }

    setRefreshing(true);
    setRefreshError(null);

    const errors: string[] = [];
    const now = new Date().toISOString();
    const next = [...investments];

    const stockHoldings = next
      .map((investment, index) => ({ investment, index }))
      .filter(
        ({ investment }) =>
          investment.liveAssetKind === "stock" &&
          investment.symbolOrCode &&
          (investment.exchange === "NSE" || investment.exchange === "BSE")
      );

    const stocksByExchange: Record<IndianExchange, number[]> = {
      NSE: [],
      BSE: [],
    };

    stockHoldings.forEach(({ investment, index }) => {
      const exchange = investment.exchange as IndianExchange;
      stocksByExchange[exchange].push(index);
    });

    for (const exchange of ["NSE", "BSE"] as IndianExchange[]) {
      const indexes = stocksByExchange[exchange];
      if (indexes.length === 0) {
        continue;
      }

      const symbols = indexes.map(
        (index) => next[index].symbolOrCode as string
      );

      try {
        const prices = await getStockPricesBatch(symbols, exchange);

        indexes.forEach((index) => {
          const symbol = (next[index].symbolOrCode || "").toUpperCase();
          const price = prices[symbol];

          if (typeof price === "number" && price > 0) {
            next[index] = {
              ...next[index],
              currentPrice: price,
              lastPriceUpdated: now,
            };
          } else {
            errors.push(`${next[index].name}: live price unavailable`);
          }
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "stock refresh failed";
        errors.push(`${exchange} stocks: ${message}`);

        if (
          err instanceof StockApiError &&
          message.toLowerCase().includes("rate limit")
        ) {
          break;
        }
      }

      // Small gap between exchange batches to stay within free-tier limits
      await delay(900);
    }

    for (let index = 0; index < next.length; index += 1) {
      const investment = next[index];

      if (
        investment.liveAssetKind !== "mutual_fund" ||
        !investment.symbolOrCode
      ) {
        continue;
      }

      try {
        const nav = await getMutualFundNav(investment.symbolOrCode);
        next[index] = {
          ...investment,
          currentPrice: getNavValue(nav),
          lastPriceUpdated: now,
        };
      } catch (err: unknown) {
        errors.push(
          `${investment.name}: ${
            err instanceof Error ? err.message : "NAV refresh failed"
          }`
        );
      }

      await delay(250);
    }

    // Stocks without exchange (legacy rows) cannot be refreshed via Twelve Data
    next.forEach((investment) => {
      if (
        investment.liveAssetKind === "stock" &&
        investment.symbolOrCode &&
        investment.exchange !== "NSE" &&
        investment.exchange !== "BSE"
      ) {
        errors.push(
          `${investment.name}: missing NSE/BSE exchange — re-add via search`
        );
      }
    });

    setInvestments(next);
    setLastRefreshedAt(now);
    setRefreshing(false);

    if (errors.length > 0) {
      setRefreshError(
        `Some prices could not be updated. ${errors.slice(0, 2).join("; ")}`
      );
    }
  }

  return (
    <div className="investment-comparison portfolio-tracker">
      <PortfolioInput onAddInvestment={handleAddInvestment} />

      <PortfolioSummary summary={summary} />

      {investments.length > 0 && (
        <PerformanceSummaryCard metrics={performanceMetrics} />
      )}

      <div className="portfolio-holdings-header">
        <div>
          <p className="eyebrow">Holdings</p>

          <h2>My investments</h2>

          <p>
            Live prices for stocks and mutual funds, saved only to your account.
          </p>

          <p className="portfolio-last-updated">
            Last updated: {formatUpdatedAt(lastRefreshedAt)}
          </p>
        </div>

        <div className="portfolio-holdings-actions">
          {investments.length > 0 && (
            <button
              type="button"
              className="portfolio-refresh-button"
              onClick={handleRefreshPrices}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing…" : "Refresh Prices"}
            </button>
          )}

          {investments.length > 0 && (
            <button
              type="button"
              className="portfolio-refresh-button"
              onClick={() =>
                generatePortfolioReport(investments, performanceMetrics)
              }
            >
              Download Report
            </button>
          )}

          {investments.length > 0 && (
            <button
              type="button"
              className="portfolio-clear-button"
              onClick={handleClearPortfolio}
            >
              Clear Portfolio
            </button>
          )}
        </div>
      </div>

      {refreshError && (
        <p className="portfolio-refresh-error">{refreshError}</p>
      )}

      <PortfolioTable
        investments={results}
        onDelete={handleDeleteInvestment}
      />

      <PortfolioChart investments={results} />

      <div className="comparison-note">
        <strong>Important:</strong>

        <p>
          Current values use live NSE/BSE prices (Twelve Data when available,
          with Yahoo Finance fallback on the free plan) and mutual fund NAVs
          from mfapi.in. Free API tiers are rate-limited — wait a moment
          between refreshes if you hit the limit.
        </p>
      </div>
    </div>
  );
}

export default PortfolioTracker;
