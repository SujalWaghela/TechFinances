import AnalyticsDashboard from "../components/analytics/AnalyticsDashboard";

function AnalyticsPage() {
  return (
    <main className="sip-page comparison-page">
      <div className="page-header">
        <p className="eyebrow">
          ANALYTICAL REPORTS
        </p>

        <h1>Investment Analytics</h1>

        <p>
          Analyze investment growth,
          performance, allocation and
          portfolio trends.
        </p>
      </div>

      <AnalyticsDashboard />
    </main>
  );
}

export default AnalyticsPage;