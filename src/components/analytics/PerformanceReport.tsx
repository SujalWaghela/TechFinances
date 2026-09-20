import type {
  PortfolioInvestmentResult,
} from "../../utils/portfolioCalculator";

interface PerformanceReportProps {
  investments: PortfolioInvestmentResult[];
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PerformanceReport({
  investments,
}: PerformanceReportProps) {
  if (investments.length === 0) {
    return null;
  }

  const sorted = [...investments].sort(
    (a, b) =>
      b.returnPercentage -
      a.returnPercentage
  );

  return (
    <div className="analytics-report-card">
      <div className="analytics-section-heading">
        <p className="eyebrow">
          PERFORMANCE REPORT
        </p>

        <h2>Investment Performance</h2>

        <p>
          Detailed performance of each
          investment in your portfolio.
        </p>
      </div>

      <div className="analytics-performance-table">
        <div className="analytics-performance-header">
          <span>Investment</span>
          <span>Invested</span>
          <span>Current Value</span>
          <span>Gain / Loss</span>
          <span>Return</span>
        </div>

        {sorted.map((investment) => {
          const isProfit =
            investment.gain >= 0;

          return (
            <div
              className="analytics-performance-row"
              key={investment.id}
            >
              <div>
                <strong>
                  {investment.name}
                </strong>

                <small>
                  {investment.type}
                </small>
              </div>

              <span>
                {formatMoney(
                  investment.investedAmount
                )}
              </span>

              <span>
                {formatMoney(
                  investment.currentValue
                )}
              </span>

              <strong
                className={
                  isProfit
                    ? "analytics-profit-text"
                    : "analytics-loss-text"
                }
              >
                {isProfit ? "+" : ""}
                {formatMoney(
                  investment.gain
                )}
              </strong>

              <strong
                className={
                  isProfit
                    ? "analytics-profit-text"
                    : "analytics-loss-text"
                }
              >
                {isProfit ? "+" : ""}
                {investment.returnPercentage.toFixed(
                  2
                )}
                %
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PerformanceReport;