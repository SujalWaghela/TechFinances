import { useEffect, useMemo, useState } from "react";

import AnalyticsSummary from "./AnalyticsSummary";
import AllocationChart from "./AllocationChart";
import PerformanceReport from "./PerformanceReport";
import AnalyticsInsights from "./AnalyticsInsights";
import PortfolioTrendChart from "./PortfolioTrendChart";
import PerformanceSummaryCard from "../portfolio/PerformanceSummaryCard";

import {
  calculateInvestmentResult,
  calculatePortfolioMetrics,
  calculatePortfolioSummary,
  type PortfolioInvestment,
} from "../../utils/portfolioCalculator";
import { calculateAllocation } from "../../utils/analyticsCalculator";
import {
  loadPortfolioHistory,
  loadUserPortfolio,
  type PortfolioHistoryPoint,
} from "../../utils/userDataStorage";
import { generatePortfolioReport } from "../../utils/reportGenerator";

interface AnalyticsDashboardProps {
  userId: string;
}

function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [investments, setInvestments] = useState<PortfolioInvestment[]>(() =>
    loadUserPortfolio(userId)
  );
  const [history, setHistory] = useState<PortfolioHistoryPoint[]>(() =>
    loadPortfolioHistory(userId)
  );

  useEffect(() => {
    function refresh() {
      setInvestments(loadUserPortfolio(userId));
      setHistory(loadPortfolioHistory(userId));
    }

    refresh();

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [userId]);

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

  const allocation = useMemo(
    () => calculateAllocation(results),
    [results]
  );

  if (investments.length === 0) {
    return (
      <div className="analytics-empty-page">
        <div className="analytics-empty-icon">TF</div>

        <h2>Nothing to analyse yet</h2>

        <p>
          Add holdings in Portfolio Tracker first. Your numbers will show up
          here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="analytics-report-actions">
        <button
          type="button"
          className="portfolio-refresh-button"
          onClick={() =>
            generatePortfolioReport(investments, performanceMetrics)
          }
        >
          Download Report
        </button>
      </div>

      <AnalyticsSummary
        totalInvested={summary.totalInvested}
        currentValue={summary.currentValue}
        totalGain={summary.totalGain}
        returnPercentage={summary.returnPercentage}
        investmentCount={investments.length}
      />

      <PerformanceSummaryCard metrics={performanceMetrics} />

      <PortfolioTrendChart history={history} />

      <AllocationChart allocation={allocation} />

      <PerformanceReport investments={results} />

      <AnalyticsInsights
        investments={results}
        allocation={allocation}
      />

      <div className="comparison-note">
        <strong>Important:</strong>

        <p>
          Analytical reports are calculated from the investment values saved to
          your account. They are intended for tracking and evaluation, not as
          investment recommendations.
        </p>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
