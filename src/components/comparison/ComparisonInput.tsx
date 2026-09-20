import type { InvestmentMode } from "../../utils/investmentComparison";

interface ComparisonInputProps {
  amount: number;
  years: number;
  mode: InvestmentMode;
  onAmountChange: (value: number) => void;
  onYearsChange: (value: number) => void;
  onModeChange: (value: InvestmentMode) => void;
}

function ComparisonInput({
  amount,
  years,
  mode,
  onAmountChange,
  onYearsChange,
  onModeChange,
}: ComparisonInputProps) {
  return (
    <div className="comparison-inputs">
      <div className="comparison-mode">
        <button
          type="button"
          className={mode === "monthly" ? "active" : ""}
          onClick={() => onModeChange("monthly")}
        >
          Monthly Investment
        </button>

        <button
          type="button"
          className={mode === "lumpsum" ? "active" : ""}
          onClick={() => onModeChange("lumpsum")}
        >
          One-time Investment
        </button>
      </div>

      <div className="comparison-input">
        <div className="comparison-input-header">
          <label>
            {mode === "monthly"
              ? "Monthly Investment"
              : "Investment Amount"}
          </label>

          <strong>
            ₹{amount.toLocaleString("en-IN")}
          </strong>
        </div>

        <input
          type="range"
          min={500}
          max={1000000}
          step={500}
          value={amount}
          onChange={(e) =>
            onAmountChange(Number(e.target.value))
          }
        />
      </div>

      <div className="comparison-input">
        <div className="comparison-input-header">
          <label>Investment Tenure</label>

          <strong>{years} Years</strong>
        </div>

        <input
          type="range"
          min={1}
          max={40}
          step={1}
          value={years}
          onChange={(e) =>
            onYearsChange(Number(e.target.value))
          }
        />
      </div>
    </div>
  );
}

export default ComparisonInput;