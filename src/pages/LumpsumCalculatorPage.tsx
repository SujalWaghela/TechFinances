import LumpsumCalculator from "../components/lumpsum/LumpsumCalculator";

function LumpsumCalculatorPage() {
  return (
    <main className="sip-page">
      <div className="page-header">
        <p className="eyebrow">One-time investment</p>
        <h1>Lumpsum Calculator</h1>
        <p>
          Estimate the future value of a single investment compounded annually.
        </p>
      </div>

      <LumpsumCalculator />
    </main>
  );
}

export default LumpsumCalculatorPage;
