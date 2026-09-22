interface LumpsumResultProps {
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function LumpsumResult({
  investedAmount,
  estimatedReturns,
  futureValue,
}: LumpsumResultProps) {
  return (
    <div className="sip-result">
      <p className="result-label">Estimated value</p>

      <h2>{formatMoney(futureValue)}</h2>

      <div className="result-row">
        <span>Invested Amount</span>
        <strong>{formatMoney(investedAmount)}</strong>
      </div>

      <div className="result-row">
        <span>Estimated Returns</span>
        <strong>{formatMoney(estimatedReturns)}</strong>
      </div>

      <div className="result-row total">
        <span>Total Value</span>
        <strong>{formatMoney(futureValue)}</strong>
      </div>
    </div>
  );
}

export default LumpsumResult;