import type { ComparisonResult } from "../../utils/investmentComparison";

interface ComparisonTableProps {
  results: ComparisonResult[];
  onReturnChange: (id: string, value: number) => void;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ComparisonTable({
  results,
  onReturnChange,
}: ComparisonTableProps) {
  return (
    <div className="comparison-table-wrapper">
      <div className="comparison-table">
        <div className="comparison-table-header comparison-grid">
          <span>Investment</span>
          <span>Expected Return</span>
          <span>Invested</span>
          <span>Estimated Value</span>
          <span>Estimated Gain</span>
        </div>

        {results.map((result) => (
          <div
            className="comparison-table-row comparison-grid"
            key={result.id}
          >
            <div>
              <strong>{result.name}</strong>

              <small>
                {result.type === "market"
                  ? "Market linked"
                  : result.type === "government"
                  ? "Government scheme"
                  : "Fixed return"}
              </small>
            </div>

            <div className="return-input">
              <input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={result.returnRate}
                onChange={(e) =>
                  onReturnChange(
                    result.id,
                    Number(e.target.value)
                  )
                }
              />

              <span>%</span>
            </div>

            <span>{formatMoney(result.investedAmount)}</span>

            <strong>
              {formatMoney(result.estimatedValue)}
            </strong>

            <strong className="gain">
              {formatMoney(result.estimatedGain)}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparisonTable;