import InstrumentCard from "../components/instruments/InstrumentCard";
import { investmentInstruments } from "../data/investmentInstruments";
import { calculateLumpsum } from "../utils/lumpsumCalculator";

function InvestmentInstrumentsPage() {
  const compoundingExample = calculateLumpsum(10_000, 12, 10);
  const compoundingNote = `Example: ₹10,000 at 12% a year grows to about ₹${Math.round(
    compoundingExample.futureValue
  ).toLocaleString("en-IN")} in 10 years (illustrative).`;

  return (
    <main className="sip-page instruments-page">
      <div className="page-header">
        <p className="eyebrow">Basics</p>
        <h1>Investment Instruments</h1>
        <p>
          A plain-language guide to how common instruments work, so you can
          match them to your goals and risk comfort.
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
