import type { InvestmentInstrument } from "../../types/investmentInstrument";

interface InstrumentCardProps {
  instrument: InvestmentInstrument;
  compoundingNote?: string;
}

function InstrumentCard({ instrument, compoundingNote }: InstrumentCardProps) {
  const riskClass = instrument.riskLevel.toLowerCase();

  return (
    <article className="instrument-card">
      <div className="instrument-card-top">
        <h3>{instrument.name}</h3>
        <div className="instrument-badges">
          <span className="instrument-badge instrument-badge-category">
            {instrument.category}
          </span>
          <span className={`instrument-badge instrument-badge-risk-${riskClass}`}>
            {instrument.riskLevel} risk
          </span>
        </div>
      </div>

      <p className="instrument-description">{instrument.description}</p>

      <div className="instrument-section">
        <strong>How returns are generated</strong>
        <p>{instrument.returnMechanism}</p>
      </div>

      <div className="instrument-return-range">
        <span>Typical return range</span>
        <strong>{instrument.typicalReturnRange}</strong>
      </div>

      {compoundingNote && (
        <p className="instrument-compounding-note">{compoundingNote}</p>
      )}
    </article>
  );
}

export default InstrumentCard;
