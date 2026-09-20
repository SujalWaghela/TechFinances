import LumpsumCalculator from "../components/lumpsum/LumpsumCalculator";

function LumpsumCalculatorPage() {
  return (
    <main className="sip-page">

      <div className="page-header">
        <p className="eyebrow">INVESTMENT CALCULATOR</p>

        <h1>Lumpsum Calculator</h1>

        <p>
          Calculate the potential growth of your one-time
          investment.
        </p>
      </div>

      <LumpsumCalculator />

    </main>
  );
}

export default LumpsumCalculatorPage;