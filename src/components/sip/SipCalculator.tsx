import { useState } from "react";
import SipInput from "./SipInput";
import SipResult from "./SipResult";
import { calculateSIP } from "../../utils/sipCalculator";

function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const result = calculateSIP(
    monthlyInvestment,
    annualReturn,
    years
  );

  return (
    <div className="sip-calculator">
      <div className="sip-inputs">
        <SipInput
          label="Monthly Investment"
          value={monthlyInvestment}
          onChange={setMonthlyInvestment}
          min={500}
          max={100000}
          step={500}
          prefix="₹"
        />

        <SipInput
          label="Expected Return"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={1}
          max={30}
          step={0.5}
          suffix="%"
        />

        <SipInput
          label="Time Period"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          suffix=" Years"
        />
      </div>

      <SipResult
        investedAmount={result.investedAmount}
        estimatedReturns={result.estimatedReturns}
        futureValue={result.futureValue}
      />
    </div>
  );
}

export default SipCalculator;