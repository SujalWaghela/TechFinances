import type { PortfolioHistoryPoint } from "../../utils/userDataStorage";

interface PortfolioTrendChartProps {
  history: PortfolioHistoryPoint[];
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function PortfolioTrendChart({ history }: PortfolioTrendChartProps) {
  if (history.length < 2) {
    return (
      <div className="analytics-chart-card">
        <div className="analytics-section-heading">
          <p className="eyebrow">Growth over time</p>
          <h2>Portfolio Value Over Time</h2>
          <p>
            Visit Portfolio Tracker a few times after updating holdings to build
            a value history trend.
          </p>
        </div>
        <p className="portfolio-trend-empty">
          Need at least two snapshots to draw a trend line.
        </p>
      </div>
    );
  }

  const values = history.map((point) => point.totalValue);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);

  const width = 560;
  const height = 180;
  const padding = 16;

  const points = history
    .map((point, index) => {
      const x =
        padding +
        (index / Math.max(history.length - 1, 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((point.totalValue - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const latest = history[history.length - 1];
  const first = history[0];

  return (
    <div className="analytics-chart-card">
      <div className="analytics-section-heading">
        <p className="eyebrow">Growth over time</p>
        <h2>Portfolio Value Over Time</h2>
        <p>
          Snapshots saved when you use Portfolio Tracker (last {history.length}{" "}
          of up to 50 visits).
        </p>
      </div>

      <div className="portfolio-trend-meta">
        <div>
          <span>First snapshot</span>
          <strong>{formatMoney(first.totalValue)}</strong>
        </div>
        <div>
          <span>Latest</span>
          <strong>{formatMoney(latest.totalValue)}</strong>
        </div>
      </div>

      <svg
        className="portfolio-trend-svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Portfolio value trend"
      >
        <polyline
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
        {history.map((point, index) => {
          const x =
            padding +
            (index / Math.max(history.length - 1, 1)) * (width - padding * 2);
          const y =
            height -
            padding -
            ((point.totalValue - min) / range) * (height - padding * 2);

          return (
            <circle
              key={`${point.date}-${index}`}
              cx={x}
              cy={y}
              r="3.5"
              fill="var(--accent-strong)"
            />
          );
        })}
      </svg>
    </div>
  );
}

export default PortfolioTrendChart;
