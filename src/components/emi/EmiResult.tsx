interface EmiResultProps {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function EmiResult({
  monthlyEMI,
  totalInterest,
  totalPayment,
}: EmiResultProps) {
  return (
    <div className="sip-result">

      <p className="result-label">MONTHLY EMI</p>

      <h2>{formatMoney(monthlyEMI)}</h2>

      <div className="result-row">
        <span>Total Interest</span>
        <strong>{formatMoney(totalInterest)}</strong>
      </div>

      <div className="result-row">
        <span>Loan Amount</span>
        <strong>
          {formatMoney(totalPayment - totalInterest)}
        </strong>
      </div>

      <div className="result-row total">
        <span>Total Payment</span>
        <strong>{formatMoney(totalPayment)}</strong>
      </div>

    </div>
  );
}

export default EmiResult;