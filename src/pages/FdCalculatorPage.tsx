import FdCalculator from "../components/fd/FdCalculator";

function FdCalculatorPage() {
  return (
    <main className="sip-page">

      <div className="page-header">
        <p className="eyebrow">INVESTMENT CALCULATOR</p>

        <h1>FD Calculator</h1>

        <p>
          Calculate the interest earned and maturity amount
          on your fixed deposit.
        </p>
      </div>

      <FdCalculator />

    </main>
  );
}

export default FdCalculatorPage;