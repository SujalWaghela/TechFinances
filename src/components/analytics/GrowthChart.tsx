import type { PortfolioSnapshot } from "../../utils/portfolioCalculator";

interface GrowthChartProps {
  snapshots: PortfolioSnapshot[];
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function GrowthChart({
  snapshots,
}: GrowthChartProps) {
  if (snapshots.length < 2) {
    return (
      <div className="analytics-empty-card">
        <h3>Portfolio Growth</h3>

        <p>
          Save at least two portfolio snapshots
          to generate a growth trend.
        </p>
      </div>
    );
  }

  const values = snapshots.map(
    (snapshot) => snapshot.currentValue
  );

  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const range =
    maxValue - minValue || 1;

  const points = snapshots
    .map((snapshot, index) => {
      const x =
        snapshots.length === 1
          ? 50
          : (index /
              (snapshots.length - 1)) *
            100;

      const y =
        90 -
        ((snapshot.currentValue -
          minValue) /
          range) *
          70;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="analytics-chart-card">
      <div className="analytics-section-heading">
        <p className="eyebrow">
          GROWTH TREND
        </p>

        <h2>Portfolio Growth</h2>

        <p>
          Track how your portfolio value has
          changed over time.
        </p>
      </div>

      <div className="growth-chart">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polyline
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />

          {snapshots.map(
            (snapshot, index) => {
              const x =
                snapshots.length === 1
                  ? 50
                  : (index /
                      (snapshots.length - 1)) *
                    100;

              const y =
                90 -
                ((snapshot.currentValue -
                  minValue) /
                  range) *
                  70;

              return (
                <circle
                  key={snapshot.id}
                  cx={x}
                  cy={y}
                  r="1.8"
                  fill="currentColor"
                />
              );
            }
          )}
        </svg>
      </div>

      <div className="growth-chart-labels">
        {snapshots.map((snapshot) => (
          <div key={snapshot.id}>
            <strong>
              {formatMoney(
                snapshot.currentValue
              )}
            </strong>

            <span>
              {new Date(
                snapshot.date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                }
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GrowthChart;