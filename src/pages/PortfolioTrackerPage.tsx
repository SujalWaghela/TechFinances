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
        <p className="eyebrow">Your holdings</p>
        <h1>Portfolio Tracker</h1>
        <p>
          Add stocks and mutual funds, refresh live prices, and see where you
          stand. Saved only for {user.name}.
        </p>
      </div>

      <PortfolioTracker key={user.id} userId={user.id} />
    </main>
  );
}

export default PortfolioTrackerPage;
