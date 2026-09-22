import type {
  PortfolioInvestmentResult,
} from "../../utils/portfolioCalculator";

interface PortfolioChartProps {
  investments: PortfolioInvestmentResult[];
}

function formatCompactMoney(
  amount: number
): string {
  const absoluteAmount = Math.abs(amount);

  if (absoluteAmount >= 10000000) {
    return `₹${(
      absoluteAmount / 10000000
    ).toFixed(2)} Cr`;
  }

  if (absoluteAmount >= 100000) {
    return `₹${(
      absoluteAmount / 100000
    ).toFixed(2)} L`;
  }

  if (absoluteAmount >= 1000) {
    return `₹${(
      absoluteAmount / 1000
    ).toFixed(1)} K`;
  }

  return `₹${Math.round(
    absoluteAmount
  ).toLocaleString("en-IN")}`;
}

function PortfolioChart({
  investments,
}: PortfolioChartProps) {
  if (investments.length === 0) {
    return null;
  }

  const maxGain = Math.max(
    ...investments.map((investment) =>
      Math.abs(investment.gain)
    ),
    1
  );

  return (
    <div className="portfolio-chart">
      <div className="comparison-section-heading">
        <p className="eyebrow">
          Gain and loss
        </p>

        <h2>Investment performance</h2>

        <p>
          Compare how each holding is doing right now.
        </p>
      </div>

      <div className="portfolio-chart-list">
        {investments.map((investment) => {
          const isProfit =
            investment.gain >= 0;

          const width =
            (Math.abs(investment.gain) /
              maxGain) *
            100;

          return (
            <div
              className="portfolio-chart-row"
              key={investment.id}
            >
              <div className="portfolio-chart-label">
                <span>
                  {investment.name}
                </span>

                <strong
                  className={
                    isProfit
                      ? "portfolio-profit"
                      : "portfolio-loss"
                  }
                >
                  {isProfit ? "+" : ""}
                  {formatCompactMoney(
                    investment.gain
                  )}
                </strong>
              </div>

              <div className="portfolio-chart-track">
                <div
                  className={`portfolio-chart-bar ${
                    isProfit
                      ? "profit-bar"
                      : "loss-bar"
                  }`}
                  style={{
                    width: `${width}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioChart;