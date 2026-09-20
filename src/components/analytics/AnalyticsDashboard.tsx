import { useEffect, useMemo, useState } from "react";

import AnalyticsSummary from "./AnalyticsSummary";
import GrowthChart from "./GrowthChart";
import AllocationChart from "./AllocationChart";
import PerformanceReport from "./PerformanceReport";
import AnalyticsInsights from "./AnalyticsInsights";

import {
  calculateInvestmentResult,
  calculatePortfolioSummary,
  type PortfolioInvestment,
  type PortfolioSnapshot,
} from "../../utils/portfolioCalculator";

import {
  calculateAllocation,
  calculateGrowth,
} from "../../utils/analyticsCalculator";

const PORTFOLIO_KEY =
  "techfinance-portfolio";

const SNAPSHOT_KEY =
  "techfinance-portfolio-snapshots";

function AnalyticsDashboard() {
  const [investments] =
    useState<PortfolioInvestment[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            PORTFOLIO_KEY
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const [snapshots] =
    useState<PortfolioSnapshot[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            SNAPSHOT_KEY
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const results = useMemo(
    () =>
      investments.map(
        calculateInvestmentResult
      ),
    [investments]
  );

  const summary = useMemo(
    () =>
      calculatePortfolioSummary(
        investments
      ),
    [investments]
  );

  const allocation = useMemo(
    () =>
      calculateAllocation(results),
    [results]
  );

  const growth = useMemo(
    () =>
      calculateGrowth(snapshots),
    [snapshots]
  );

  useEffect(() => {
    // Re-render whenever the analytics
    // page becomes visible again after
    // changes on the portfolio page.
  }, []);

  if (investments.length === 0) {
    return (
      <div className="analytics-empty-page">
        <div className="analytics-empty-icon">
          📊
        </div>

        <h2>
          No Portfolio Data Yet
        </h2>

        <p>
          Add investments to your Portfolio
          Tracker first. Your investment data
          will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <AnalyticsSummary
        totalInvested={
          summary.totalInvested
        }
        currentValue={
          summary.currentValue
        }
        totalGain={summary.totalGain}
        returnPercentage={
          summary.returnPercentage
        }
        investmentCount={
          investments.length
        }
      />

      <GrowthChart
        snapshots={growth}
      />

      <AllocationChart
        allocation={allocation}
      />

      <PerformanceReport
        investments={results}
      />

      <AnalyticsInsights
        investments={results}
        allocation={allocation}
      />

      <div className="comparison-note">
        <strong>Important:</strong>

        <p>
          Analytical reports are calculated
          from the investment values and
          portfolio snapshots entered by the
          user. They are intended for tracking
          and evaluation, not as investment
          recommendations.
        </p>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;