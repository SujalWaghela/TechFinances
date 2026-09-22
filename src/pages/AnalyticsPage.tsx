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
        <p className="eyebrow">ANALYTICAL REPORTS</p>

        <h1>Investment Analytics</h1>

        <p>
          Analyze investment growth, performance, allocation and portfolio
          trends for your account.
        </p>
      </div>

      <AnalyticsDashboard key={user.id} userId={user.id} />
    </main>
  );
}

export default AnalyticsPage;
