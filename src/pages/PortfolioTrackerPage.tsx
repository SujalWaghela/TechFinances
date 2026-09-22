import { useAuth } from "../context/AuthContext";
import PortfolioTracker from "../components/portfolio/PortfolioTracker";

function PortfolioTrackerPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="sip-page comparison-page">
      <div className="page-header">
        <p className="eyebrow">PORTFOLIO MANAGEMENT</p>

        <h1>Portfolio Tracker</h1>

        <p>
          Track your investments, monitor performance and evaluate your
          portfolio in one place. Data is saved only to {user.name}&apos;s
          account.
        </p>
      </div>

      <PortfolioTracker key={user.id} userId={user.id} />
    </main>
  );
}

export default PortfolioTrackerPage;
