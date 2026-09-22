import { useState, useId, type ChangeEvent } from "react";

export interface RealityCheckProps {
  estimatedValue: number;
  investedAmount: number;
  years: number;
  taxLabel: string;
  defaultTaxRate: number;
  defaultFeeRate: number;
  defaultInflationRate: number;
}

function formatMoney(amount: number): string {
  if (!Number.isFinite(amount)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return "0.00%";
  }

  return `${value.toFixed(2)}%`;
}

function sanitizeRate(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

function RealityCheck({
  estimatedValue,
  investedAmount,
  years,
  taxLabel,
  defaultTaxRate,
  defaultFeeRate,
  defaultInflationRate,
}: RealityCheckProps) {
  const [expanded, setExpanded] = useState(false);
  const [taxRate, setTaxRate] = useState(defaultTaxRate);
  const [feeRate, setFeeRate] = useState(defaultFeeRate);
  const [inflationRate, setInflationRate] = useState(defaultInflationRate);
  const fieldId = useId();

  const safeEstimatedValue = Number.isFinite(estimatedValue)
    ? Math.max(0, estimatedValue)
    : 0;
  const safeInvestedAmount = Number.isFinite(investedAmount)
    ? Math.max(0, investedAmount)
    : 0;
  const safeYears = Number.isFinite(years) ? Math.max(0, years) : 0;

  const safeTaxRate = sanitizeRate(taxRate);
  const safeFeeRate = sanitizeRate(feeRate);
  const safeInflationRate = sanitizeRate(inflationRate);

  const estimatedProfit = safeEstimatedValue - safeInvestedAmount;
  const taxableAmount = Math.max(0, estimatedProfit);
  const taxAmount = (taxableAmount * safeTaxRate) / 100;
  const feeAmount = (safeEstimatedValue * safeFeeRate) / 100;
  const afterTaxAndFees = safeEstimatedValue - taxAmount - feeAmount;

  const inflationDivisor = Math.pow(1 + safeInflationRate / 100, safeYears);
  const inflationAdjustedValue =
    inflationDivisor > 0 ? afterTaxAndFees / inflationDivisor : afterTaxAndFees;
  const inflationImpact = afterTaxAndFees - inflationAdjustedValue;
  const realGain = inflationAdjustedValue - safeInvestedAmount;
  const realReturn =
    safeInvestedAmount > 0 ? (realGain / safeInvestedAmount) * 100 : 0;

  const taxDisplayLabel = taxLabel.replace(" (%)", "");

  const handleRateChange =
    (setter: (value: number) => void) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.target.value);

      if (event.target.value === "" || Number.isNaN(nextValue)) {
        setter(0);
        return;
      }

      setter(Math.max(0, nextValue));
    };

  return (
    <div className={`reality-check ${expanded ? "is-open" : ""}`}>
      <button
        type="button"
        className="reality-check-toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <div className="reality-check-toggle-left">
          <span className="reality-check-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M4 19V5M4 19H20M8 15V11M12 15V8M16 15V12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="reality-check-toggle-text">
            <strong>Reality Check</strong>
            <span>Tax • Fees • Inflation</span>
          </div>
        </div>

        <span className="reality-check-chevron" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {expanded && (
        <div className="reality-check-body">
          <div className="reality-check-content">
            <div className="reality-check-aside">
              <p className="reality-check-lead">
                Adjust assumptions to estimate what your money may be worth after
                tax, fees and inflation.
              </p>

              <div className="reality-check-inputs">
                <label className="reality-check-field" htmlFor={`${fieldId}-tax`}>
                  <span className="reality-check-field-label">
                    {taxDisplayLabel}
                  </span>
                  <span className="reality-check-field-control">
                    <input
                      id={`${fieldId}-tax`}
                      type="number"
                      min={0}
                      step={0.1}
                      value={taxRate}
                      onChange={handleRateChange(setTaxRate)}
                    />
                    <span>%</span>
                  </span>
                </label>

                <label
                  className="reality-check-field"
                  htmlFor={`${fieldId}-fees`}
                >
                  <span className="reality-check-field-label">
                    Investment Fees
                  </span>
                  <span className="reality-check-field-control">
                    <input
                      id={`${fieldId}-fees`}
                      type="number"
                      min={0}
                      step={0.1}
                      value={feeRate}
                      onChange={handleRateChange(setFeeRate)}
                    />
                    <span>%</span>
                  </span>
                </label>

                <label
                  className="reality-check-field"
                  htmlFor={`${fieldId}-inflation`}
                >
                  <span className="reality-check-field-label">
                    Expected Inflation
                  </span>
                  <span className="reality-check-field-control">
                    <input
                      id={`${fieldId}-inflation`}
                      type="number"
                      min={0}
                      step={0.1}
                      value={inflationRate}
                      onChange={handleRateChange(setInflationRate)}
                    />
                    <span>% / yr</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="reality-check-main">
              <div className="reality-check-panel">
                <div className="reality-row">
                  <span>Original Estimated Value</span>
                  <strong>{formatMoney(safeEstimatedValue)}</strong>
                </div>

                <div className="reality-row is-deduction">
                  <span>{taxDisplayLabel}</span>
                  <strong>− {formatMoney(taxAmount)}</strong>
                </div>

                <div className="reality-row is-deduction">
                  <span>Investment Fees</span>
                  <strong>− {formatMoney(feeAmount)}</strong>
                </div>

                <div className="reality-row is-subtotal">
                  <span>Value After Tax &amp; Fees</span>
                  <strong>{formatMoney(afterTaxAndFees)}</strong>
                </div>

                <div className="reality-row">
                  <span>Investment Period</span>
                  <strong>
                    {safeYears} {safeYears === 1 ? "year" : "years"}
                  </strong>
                </div>

                <div className="reality-row is-deduction">
                  <span>Inflation Impact</span>
                  <strong>− {formatMoney(inflationImpact)}</strong>
                </div>
              </div>

              <div className="reality-summary">
                <div className="reality-summary-hero">
                  <span>Inflation-Adjusted Value</span>
                  <strong>{formatMoney(inflationAdjustedValue)}</strong>
                  <small>
                    Estimated purchasing power in today&apos;s terms
                  </small>
                </div>

                <div className="reality-summary-metrics">
                  <div
                    className={`reality-metric ${
                      realGain >= 0 ? "is-positive" : "is-negative"
                    }`}
                  >
                    <span>Real Gain / Loss</span>
                    <strong>{formatMoney(realGain)}</strong>
                  </div>

                  <div
                    className={`reality-metric ${
                      realReturn >= 0 ? "is-positive" : "is-negative"
                    }`}
                  >
                    <span>Real Return</span>
                    <strong>{formatPercent(realReturn)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="reality-check-note">
            Figures are illustrative assumptions only. Actual tax, fees and
            inflation may differ.
          </p>
        </div>
      )}
    </div>
  );
}

export default RealityCheck;
