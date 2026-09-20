import EmiCalculator from "../components/emi/EmiCalculator";

function EmiCalculatorPage() {
  return (
    <main className="sip-page">

      <div className="page-header">
        <p className="eyebrow">LOAN CALCULATOR</p>

        <h1>EMI Calculator</h1>

        <p>
          Calculate your monthly loan EMI, total interest,
          and total repayment.
        </p>
      </div>

      <EmiCalculator />

    </main>
  );
}

export default EmiCalculatorPage;