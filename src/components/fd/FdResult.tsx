interface FdResultProps {
  principal: number;
  interest: number;
  maturityAmount: number;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function FdResult({
  principal,
  interest,
  maturityAmount,
}: FdResultProps) {
  return (
    <div className="sip-result">

      <p className="result-label">MATURITY AMOUNT</p>

      <h2>{formatMoney(maturityAmount)}</h2>

      <div className="result-row">
        <span>Deposit Amount</span>
        <strong>{formatMoney(principal)}</strong>
      </div>

      <div className="result-row">
        <span>Interest Earned</span>
        <strong>{formatMoney(interest)}</strong>
      </div>

      <div className="result-row total">
        <span>Maturity Amount</span>
        <strong>{formatMoney(maturityAmount)}</strong>
      </div>

    </div>
  );
}

export default FdResult;