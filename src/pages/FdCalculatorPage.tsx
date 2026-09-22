import FdCalculator from "../components/fd/FdCalculator";

function FdCalculatorPage() {
  return (
    <main className="sip-page">
      <div className="page-header">
        <p className="eyebrow">Fixed deposits</p>
        <h1>FD Calculator</h1>
        <p>
          Estimate interest and maturity value with quarterly compounding, as
          banks typically use for Indian FDs.
        </p>
      </div>

      <FdCalculator />
    </main>
  );
}

export default FdCalculatorPage;
