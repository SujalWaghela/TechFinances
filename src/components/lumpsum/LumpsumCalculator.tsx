import { useState } from "react";
import LumpsumInput from "./LumpsumInput";
import LumpsumResult from "./LumpsumResult";
import RealityCheck from "../common/RealityCheck";
import { calculateLumpsum } from "../../utils/lumpsumCalculator";

function LumpsumCalculator() {
  const [investment, setInvestment] = useState<number>(100000);
  const [annualReturn, setAnnualReturn] = useState<number>(12);
  const [years, setYears] = useState<number>(10);

  const result = calculateLumpsum(
    investment,
    annualReturn,
    years
  );

  return (
    <div className="sip-calculator">
      <div className="sip-inputs">

        <LumpsumInput
          label="Investment Amount"
          value={investment}
          onChange={setInvestment}
          min={1000}
          max={10000000}
          step={1000}
          prefix="₹"
        />

        <LumpsumInput
          label="Expected Return"
          value={annualReturn}
          onChange={setAnnualReturn}
          min={1}
          max={30}
          step={0.5}
          suffix="%"
        />

        <LumpsumInput
          label="Time Period"
          value={years}
          onChange={setYears}
          min={1}
          max={40}
          suffix=" Years"
        />

      </div>

      <LumpsumResult
        investedAmount={result.investedAmount}
        estimatedReturns={result.estimatedReturns}
        futureValue={result.futureValue}
      />

      <RealityCheck
        estimatedValue={result.futureValue}
        investedAmount={result.investedAmount}
        years={years}
        taxLabel="Tax on Profit (%)"
        defaultTaxRate={10}
        defaultFeeRate={1}
        defaultInflationRate={6}
      />
    </div>
  );
}

export default LumpsumCalculator;