import InstrumentCard from "../components/instruments/InstrumentCard";
import { investmentInstruments } from "../data/investmentInstruments";
import { calculateLumpsum } from "../utils/lumpsumCalculator";

function InvestmentInstrumentsPage() {
  const compoundingExample = calculateLumpsum(10_000, 12, 10);
  const compoundingNote = `Compounding example: ₹10,000 invested as a lumpsum at 12% p.a. grows to about ₹${Math.round(
    compoundingExample.futureValue
  ).toLocaleString("en-IN")} in 10 years (illustrative, using TechFinance’s lumpsum formula).`;

  return (
    <main className="sip-page instruments-page">
      <div className="page-header">
        <p className="eyebrow">LEARN</p>
        <h1>Investment Instruments</h1>
        <p>
          Understand how different instruments generate returns — from fixed
          deposits to equity and SIPs — so you can choose tools that match your
          goals and risk comfort.
        </p>
      </div>

      <div className="instruments-grid">
        {investmentInstruments.map((instrument) => (
          <InstrumentCard
            key={instrument.name}
            instrument={instrument}
            compoundingNote={
              instrument.name === "Lumpsum Investment"
                ? compoundingNote
                : undefined
            }
          />
        ))}
      </div>
    </main>
  );
}

export default InvestmentInstrumentsPage;
