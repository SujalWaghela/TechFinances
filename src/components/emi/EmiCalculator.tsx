import { useState } from "react";
import EmiInput from "./EmiInput";
import EmiResult from "./EmiResult";
import FaqAccordion from "../common/FaqAccordion";
import { emiFaqs } from "../../data/faqContent";
import { calculateEMI } from "../../utils/emiCalculator";

function EmiCalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [years, setYears] = useState<number>(10);

  const result = calculateEMI(
    loanAmount,
    interestRate,
    years
  );

  return (
    <div className="sip-calculator">
      <div className="sip-inputs">
        <EmiInput
          label="Loan Amount"
          value={loanAmount}
          onChange={setLoanAmount}
          min={50000}
          max={10000000}
          step={50000}
          prefix="₹"
        />

        <EmiInput
          label="Interest Rate"
          value={interestRate}
          onChange={setInterestRate}
          min={1}
          max={25}
          step={0.1}
          suffix="%"
        />

        <EmiInput
          label="Loan Tenure"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          suffix=" Years"
        />
      </div>

      <EmiResult
        monthlyEMI={result.monthlyEMI}
        totalInterest={result.totalInterest}
        totalPayment={result.totalPayment}
      />

      <FaqAccordion title="EMI Calculator FAQs" items={emiFaqs} />
    </div>
  );
}

export default EmiCalculator;
