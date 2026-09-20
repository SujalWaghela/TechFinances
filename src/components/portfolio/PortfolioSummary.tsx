import type { PortfolioSummary as PortfolioSummaryType } from "../../utils/portfolioCalculator";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PortfolioSummary({
  summary,
}: PortfolioSummaryProps) {
  const isProfit = summary.totalGain >= 0;

  return (
    <div className="portfolio-summary">
      <div className="portfolio-summary-card">
        <span>Total Invested</span>

        <strong>
          {formatMoney(summary.totalInvested)}
        </strong>
      </div>

      <div className="portfolio-summary-card">
        <span>Current Value</span>

        <strong>
          {formatMoney(summary.currentValue)}
        </strong>
      </div>

      <div
        className={`portfolio-summary-card ${
          isProfit ? "profit" : "loss"
        }`}
      >
        <span>Total Gain / Loss</span>

        <strong>
          {isProfit ? "+" : ""}
          {formatMoney(summary.totalGain)}
        </strong>
      </div>

      <div
        className={`portfolio-summary-card ${
          isProfit ? "profit" : "loss"
        }`}
      >
        <span>Portfolio Return</span>

        <strong>
          {isProfit ? "+" : ""}
          {summary.returnPercentage.toFixed(2)}%
        </strong>
      </div>
    </div>
  );
}

export default PortfolioSummary;