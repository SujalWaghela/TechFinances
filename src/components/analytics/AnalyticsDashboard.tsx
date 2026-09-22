import { useEffect, useMemo, useState } from "react";

import AnalyticsSummary from "./AnalyticsSummary";
import AllocationChart from "./AllocationChart";
import PerformanceReport from "./PerformanceReport";
import AnalyticsInsights from "./AnalyticsInsights";

import {
  calculateInvestmentResult,
  calculatePortfolioSummary,
  type PortfolioInvestment,
} from "../../utils/portfolioCalculator";
import { calculateAllocation } from "../../utils/analyticsCalculator";
import { loadUserPortfolio } from "../../utils/userDataStorage";

interface AnalyticsDashboardProps {
  userId: string;
}

function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [investments, setInvestments] = useState<PortfolioInvestment[]>(() =>
    loadUserPortfolio(userId)
  );

  useEffect(() => {
    function refresh() {
      setInvestments(loadUserPortfolio(userId));
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

  const allocation = useMemo(
    () => calculateAllocation(results),
    [results]
  );

  if (investments.length === 0) {
    return (
      <div className="analytics-empty-page">
        <div className="analytics-empty-icon">TF</div>

        <h2>No Portfolio Data Yet</h2>

        <p>
          Add investments to your Portfolio Tracker first. Your account&apos;s
          investment data will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      <AnalyticsSummary
        totalInvested={summary.totalInvested}
        currentValue={summary.currentValue}
        totalGain={summary.totalGain}
        returnPercentage={summary.returnPercentage}
        investmentCount={investments.length}
      />

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
