import {
  BENCHMARK_RATES,
  compareToBenchmarks,
} from "../../utils/portfolioCalculator";
import type { PortfolioPerformanceMetrics } from "../../types/portfolioPerformance";

interface PerformanceSummaryCardProps {
  metrics: PortfolioPerformanceMetrics;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function toneClass(value: number): string {
  if (value > 0) {
    return "is-positive";
  }
  if (value < 0) {
    return "is-negative";
  }
  return "";
}

function PerformanceSummaryCard({ metrics }: PerformanceSummaryCardProps) {
  const benchmarks = compareToBenchmarks(metrics.cagr);

  return (
    <section className="performance-summary-card">
      <div className="analytics-section-heading">
        <p className="eyebrow">Returns</p>
        <h2>Portfolio Metrics</h2>
        <p>
          CAGR, absolute return and XIRR estimated from your holdings. Benchmark
          rates are illustrative references, not live indexes.
        </p>
      </div>

      <div className="performance-metrics-grid">
        <div className="performance-metric">
          <span>CAGR</span>
          <strong className={toneClass(metrics.cagr)}>
            {formatPercent(metrics.cagr)}
          </strong>
        </div>
        <div className="performance-metric">
          <span>Absolute Return</span>
          <strong className={toneClass(metrics.absoluteReturn)}>
            {formatPercent(metrics.absoluteReturn)}
          </strong>
        </div>
        <div className="performance-metric">
          <span>XIRR</span>
          <strong className={toneClass(metrics.xirr)}>
            {formatPercent(metrics.xirr)}
          </strong>
        </div>
        <div className="performance-metric">
          <span>Total Gain / Loss</span>
          <strong className={toneClass(metrics.totalGainLoss)}>
            {formatMoney(metrics.totalGainLoss)}
          </strong>
          <small className={toneClass(metrics.totalGainLossPercent)}>
            {formatPercent(metrics.totalGainLossPercent)}
          </small>
        </div>
      </div>

      <div className="performance-benchmarks">
        <p className="performance-benchmark-label">
          Your portfolio CAGR{" "}
          <strong className={toneClass(metrics.cagr)}>
            {metrics.cagr.toFixed(2)}%
          </strong>{" "}
          vs FD average {BENCHMARK_RATES.fdAverage}% vs Nifty historical{" "}
          {BENCHMARK_RATES.niftyHistoricalCAGR}%
        </p>

        <div className="performance-benchmark-bars">
          <div className="performance-benchmark-row">
            <span>vs FD ({BENCHMARK_RATES.fdAverage}%)</span>
            <strong className={toneClass(benchmarks.vsFD)}>
              {formatPercent(benchmarks.vsFD)} pts
            </strong>
            <div className="performance-benchmark-track">
              <div
                className={`performance-benchmark-fill ${toneClass(benchmarks.vsFD)}`}
                style={{
                  width: `${Math.min(Math.abs(benchmarks.vsFD) * 6, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="performance-benchmark-row">
            <span>vs Nifty ({BENCHMARK_RATES.niftyHistoricalCAGR}%)</span>
            <strong className={toneClass(benchmarks.vsNifty)}>
              {formatPercent(benchmarks.vsNifty)} pts
            </strong>
            <div className="performance-benchmark-track">
              <div
                className={`performance-benchmark-fill ${toneClass(benchmarks.vsNifty)}`}
                style={{
                  width: `${Math.min(Math.abs(benchmarks.vsNifty) * 6, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PerformanceSummaryCard;
