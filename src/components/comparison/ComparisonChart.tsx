import type { ComparisonResult } from "../../utils/investmentComparison";

interface ComparisonChartProps {
  results: ComparisonResult[];
}

function formatCompactMoney(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)} K`;
  }

  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function ComparisonChart({
  results,
}: ComparisonChartProps) {
  const maxGain = Math.max(
    ...results.map((result) => result.estimatedGain)
  );

  return (
    <div className="comparison-chart">
      <div className="comparison-section-heading">
        <p className="eyebrow">VISUAL COMPARISON</p>

        <h2>Estimated Gain</h2>

        <p>
          Compare the estimated profit you could earn from
          different investment options.
        </p>
      </div>

      <div className="chart-bars">
        {results.map((result) => {
          const width =
            maxGain > 0
              ? (result.estimatedGain / maxGain) * 100
              : 0;

          return (
            <div className="chart-row" key={result.id}>
              <div className="chart-label">
                <span>{result.name}</span>

                <strong>
                  {formatCompactMoney(
                    result.estimatedGain
                  )}
                </strong>
              </div>

              <div className="chart-track">
                <div
                  className="chart-bar"
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

export default ComparisonChart;