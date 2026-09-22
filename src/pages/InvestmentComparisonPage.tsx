import InvestmentComparison from "../components/comparison/InvestmentComparison";

function InvestmentComparisonPage() {
  return (
    <main className="sip-page comparison-page">
      <div className="page-header">
        <p className="eyebrow">Side by side</p>
        <h1>Compare Investments</h1>
        <p>
          Put the same amount into different options and see which path could
          grow further under your assumptions.
        </p>
      </div>

      <InvestmentComparison />
    </main>
  );
}

export default InvestmentComparisonPage;
