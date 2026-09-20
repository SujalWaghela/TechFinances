import SipCalculator from "../components/sip/SipCalculator";

function SipCalculatorPage() {
  return (
    <main className="sip-page">
      <div className="page-header">
        <p className="eyebrow">INVESTMENT CALCULATOR</p>

        <h1>SIP Calculator</h1>

        <p>
          Calculate the potential growth of your monthly SIP
          investment.
        </p>
      </div>

      <SipCalculator />
    </main>
  );
}

export default SipCalculatorPage;