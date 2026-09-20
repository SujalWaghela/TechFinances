import PortfolioTracker from "../components/portfolio/PortfolioTracker";

function PortfolioTrackerPage() {
  return (
    <main className="sip-page comparison-page">
      <div className="page-header">
        <p className="eyebrow">
          PORTFOLIO MANAGEMENT
        </p>

        <h1>Portfolio Tracker</h1>

        <p>
          Track your investments, monitor
          performance and evaluate your
          portfolio in one place.
        </p>
      </div>

      <PortfolioTracker />
    </main>
  );
}

export default PortfolioTrackerPage;