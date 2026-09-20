import type {
  PortfolioInvestment,
  PortfolioInvestmentResult,
} from "../../utils/portfolioCalculator";

interface PortfolioTableProps {
  investments: PortfolioInvestmentResult[];
  onDelete: (id: string) => void;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PortfolioTable({
  investments,
  onDelete,
}: PortfolioTableProps) {
  if (investments.length === 0) {
    return (
      <div className="portfolio-empty">
        <div className="portfolio-empty-icon">
          +
        </div>

        <h3>No investments added yet</h3>

        <p>
          Add your first investment above to start
          tracking your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className="portfolio-table-wrapper">
      <div className="portfolio-table">
        <div className="portfolio-table-header portfolio-grid">
          <span>Investment</span>
          <span>Quantity</span>
          <span>Invested</span>
          <span>Current Value</span>
          <span>Gain / Loss</span>
          <span>Return</span>
          <span></span>
        </div>

        {investments.map((investment) => {
          const isProfit =
            investment.gain >= 0;

          return (
            <div
              className="portfolio-table-row portfolio-grid"
              key={investment.id}
            >
              <div className="portfolio-investment-name">
                <strong>
                  {investment.name}
                </strong>

                <small>
                  {investment.type}
                </small>
              </div>

              <span>
                {investment.quantity}
              </span>

              <span>
                {formatMoney(
                  investment.investedAmount
                )}
              </span>

              <strong>
                {formatMoney(
                  investment.currentValue
                )}
              </strong>

              <strong
                className={
                  isProfit
                    ? "portfolio-profit"
                    : "portfolio-loss"
                }
              >
                {isProfit ? "+" : ""}
                {formatMoney(investment.gain)}
              </strong>

              <strong
                className={
                  isProfit
                    ? "portfolio-profit"
                    : "portfolio-loss"
                }
              >
                {isProfit ? "+" : ""}
                {investment.returnPercentage.toFixed(
                  2
                )}
                %
              </strong>

              <button
                type="button"
                className="portfolio-delete-button"
                onClick={() =>
                  onDelete(investment.id)
                }
                aria-label={`Delete ${investment.name}`}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PortfolioTable;