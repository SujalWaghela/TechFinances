import { useState } from "react";
import FdInput from "./FdInput";
import FdResult from "./FdResult";
import RealityCheck from "../common/RealityCheck";
import { calculateFD } from "../../utils/fdCalculator";

function FdCalculator() {
  const [deposit, setDeposit] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [years, setYears] = useState<number>(5);

  const result = calculateFD(
    deposit,
    interestRate,
    years
  );

  return (
    <div className="sip-calculator">

      <div className="sip-inputs">

        <FdInput
          label="Deposit Amount"
          value={deposit}
          onChange={setDeposit}
          min={1000}
          max={10000000}
          step={1000}
          prefix="₹"
        />

        <FdInput
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={15}
          step={0.1}
          suffix="%"
        />

        <FdInput
          label="Time Period"
          value={years}
          onChange={setYears}
          min={1}
          max={20}
          suffix=" Years"
        />

      </div>

      <FdResult
        principal={result.principal}
        interest={result.interest}
        maturityAmount={result.maturityAmount}
      />

      <RealityCheck
        estimatedValue={result.maturityAmount}
        investedAmount={result.principal}
        years={years}
        taxLabel="Tax on Interest (%)"
        defaultTaxRate={20}
        defaultFeeRate={0}
        defaultInflationRate={6}
      />

    </div>
  );
}

export default FdCalculator;