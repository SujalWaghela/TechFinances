interface AnalyticsSummaryProps {
  totalInvested: number;
  currentValue: number;
  totalGain: number;
  returnPercentage: number;
  investmentCount: number;
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function AnalyticsSummary({
  totalInvested,
  currentValue,
  totalGain,
  returnPercentage,
  investmentCount,
}: AnalyticsSummaryProps) {
  const isProfit = totalGain >= 0;

  return (
    <div className="analytics-summary">
      <div className="analytics-card">
        <span>Total Invested</span>
        <strong>
          {formatMoney(totalInvested)}
        </strong>
      </div>

      <div className="analytics-card">
        <span>Current Value</span>
        <strong>
          {formatMoney(currentValue)}
        </strong>
      </div>

      <div
        className={`analytics-card ${
          isProfit
            ? "analytics-profit"
            : "analytics-loss"
        }`}
      >
        <span>Total Gain / Loss</span>
        <strong>
          {isProfit ? "+" : ""}
          {formatMoney(totalGain)}
        </strong>
      </div>

      <div
        className={`analytics-card ${
          isProfit
            ? "analytics-profit"
            : "analytics-loss"
        }`}
      >
        <span>Overall Return</span>
        <strong>
          {isProfit ? "+" : ""}
          {returnPercentage.toFixed(2)}%
        </strong>
      </div>

      <div className="analytics-card">
        <span>Total Investments</span>
        <strong>
          {investmentCount}
        </strong>
      </div>
    </div>
  );
}

export default AnalyticsSummary;