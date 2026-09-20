import { useState } from "react";

import ComparisonInput from "./ComparisonInput";
import ComparisonTable from "./ComparisonTable";
import ComparisonChart from "./ComparisonChart";

import {
  calculateInvestmentComparison,
  defaultInvestmentOptions,
  type InvestmentMode,
  type InvestmentOption,
} from "../../utils/investmentComparison";

function InvestmentComparison() {
  const [amount, setAmount] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);

  const [mode, setMode] =
    useState<InvestmentMode>("monthly");

  const [options, setOptions] = useState<
    InvestmentOption[]
  >(defaultInvestmentOptions);

  const results = calculateInvestmentComparison(
    amount,
    years,
    mode,
    options
  );

  function handleReturnChange(
    id: string,
    value: number
  ) {
    setOptions((currentOptions) =>
      currentOptions.map((option) =>
        option.id === id
          ? {
              ...option,
              returnRate: value,
            }
          : option
      )
    );
  }

  return (
    <div className="investment-comparison">
      <ComparisonInput
        amount={amount}
        years={years}
        mode={mode}
        onAmountChange={setAmount}
        onYearsChange={setYears}
        onModeChange={setMode}
      />

      <ComparisonTable
        results={results}
        onReturnChange={handleReturnChange}
      />

      <ComparisonChart results={results} />

      <div className="comparison-note">
        <strong>Important:</strong>

        <p>
          The returns shown are estimates based on the
          expected return assumptions you enter. Market-linked
          investments such as mutual funds do not guarantee
          these returns. Actual returns may be higher or lower.
        </p>
      </div>
    </div>
  );
}

export default InvestmentComparison;