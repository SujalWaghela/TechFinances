import InvestmentComparison from "../components/comparison/InvestmentComparison";

function InvestmentComparisonPage() {
  return (
    <main className="sip-page comparison-page">
      <div className="page-header">
        <p className="eyebrow">INVESTMENT PLANNER</p>

        <h1>Compare Investments</h1>

        <p>
          Compare the potential growth of your money across
          different investment options.
        </p>
      </div>

      <InvestmentComparison />
    </main>
  );
}

export default InvestmentComparisonPage;