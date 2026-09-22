import SipCalculator from "../components/sip/SipCalculator";

function SipCalculatorPage() {
  return (
    <main className="sip-page">
      <div className="page-header">
        <p className="eyebrow">Monthly investing</p>
        <h1>SIP Calculator</h1>
        <p>
          See how a monthly SIP could grow over time, based on the return you
          expect.
        </p>
      </div>

      <SipCalculator />
    </main>
  );
}

export default SipCalculatorPage;
