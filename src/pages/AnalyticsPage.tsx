import { useAuth } from "../context/AuthContext";
import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";

function AnalyticsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="sip-page comparison-page">
      <div className="page-header">
        <p className="eyebrow">Performance</p>
        <h1>Analytics</h1>
        <p>
          Allocation, returns, and trends based on the same portfolio you track
          above.
        </p>
      </div>

      <AnalyticsDashboard key={user.id} userId={user.id} />
    </main>
  );
}

export default AnalyticsPage;
