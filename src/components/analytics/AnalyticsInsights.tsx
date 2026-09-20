import type {
  AllocationResult,
} from "../../utils/analyticsCalculator";

import type {
  PortfolioInvestmentResult,
} from "../../utils/portfolioCalculator";

interface AnalyticsInsightsProps {
  investments: PortfolioInvestmentResult[];
  allocation: AllocationResult[];
}

function AnalyticsInsights({
  investments,
  allocation,
}: AnalyticsInsightsProps) {
  if (investments.length === 0) {
    return null;
  }

  const bestInvestment =
    [...investments].sort(
      (a, b) =>
        b.returnPercentage -
        a.returnPercentage
    )[0];

  const largestAllocation =
    allocation[0];

  const profitableInvestments =
    investments.filter(
      (investment) =>
        investment.gain > 0
    ).length;

  const lossInvestments =
    investments.filter(
      (investment) =>
        investment.gain < 0
    ).length;

  return (
    <div className="analytics-insights">
      <div className="analytics-section-heading">
        <p className="eyebrow">
          ANALYTICAL INSIGHTS
        </p>

        <h2>Portfolio Insights</h2>

        <p>
          Automatically generated observations
          based on your portfolio data.
        </p>
      </div>

      <div className="analytics-insight-grid">
        <div className="analytics-insight">
          <span>Top Performing Investment</span>

          <strong>
            {bestInvestment.name}
          </strong>

          <p>
            Return of{" "}
            {bestInvestment.returnPercentage.toFixed(
              2
            )}
            %.
          </p>
        </div>

        <div className="analytics-insight">
          <span>Largest Allocation</span>

          <strong>
            {largestAllocation.type}
          </strong>

          <p>
            {largestAllocation.percentage.toFixed(
              1
            )}
            % of portfolio value.
          </p>
        </div>

        <div className="analytics-insight">
          <span>Profitable Investments</span>

          <strong>
            {profitableInvestments}
          </strong>

          <p>
            Investment
            {profitableInvestments !== 1
              ? "s"
              : ""}{" "}
            currently showing a gain.
          </p>
        </div>

        <div className="analytics-insight">
          <span>Investments in Loss</span>

          <strong>
            {lossInvestments}
          </strong>

          <p>
            Investment
            {lossInvestments !== 1
              ? "s"
              : ""}{" "}
            currently showing a loss.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsInsights;