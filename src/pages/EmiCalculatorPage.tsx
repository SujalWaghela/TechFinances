import EmiCalculator from "../components/emi/EmiCalculator";

function EmiCalculatorPage() {
  return (
    <main className="sip-page">
      <div className="page-header">
        <p className="eyebrow">Loans</p>
        <h1>EMI Calculator</h1>
        <p>
          Work out your monthly EMI, total interest, and overall repayment for a
          loan.
        </p>
      </div>

      <EmiCalculator />
    </main>
  );
}

export default EmiCalculatorPage;
