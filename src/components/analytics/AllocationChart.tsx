import type { AllocationResult } from "../../utils/analyticsCalculator";

interface AllocationChartProps {
  allocation: AllocationResult[];
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function AllocationChart({
  allocation,
}: AllocationChartProps) {
  if (allocation.length === 0) {
    return null;
  }

  return (
    <div className="analytics-chart-card">
      <div className="analytics-section-heading">
        <p className="eyebrow">
          ALLOCATION
        </p>

        <h2>Portfolio Allocation</h2>

        <p>
          See how your current portfolio is
          distributed across investment types.
        </p>
      </div>

      <div className="allocation-list">
        {allocation.map((item) => (
          <div
            className="allocation-row"
            key={item.type}
          >
            <div className="allocation-header">
              <strong>
                {item.type}
              </strong>

              <span>
                {item.percentage.toFixed(1)}%
              </span>
            </div>

            <div className="allocation-track">
              <div
                className="allocation-bar"
                style={{
                  width: `${item.percentage}%`,
                }}
              />
            </div>

            <small>
              {formatMoney(item.value)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllocationChart;