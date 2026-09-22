import { Link } from "react-router-dom";
import type { RiskProfileResult } from "../../types/riskProfiler";
import { RISK_PROFILER_METRICS } from "../../utils/riskProfiler";

interface RiskProfileResultCardProps {
  result: RiskProfileResult;
}

interface Recommendation {
  title: string;
  body: string;
  linkTo: string;
  linkLabel: string;
}

function getRecommendation(
  category: RiskProfileResult["predictedCategory"]
): Recommendation {
  if (category === "Conservative") {
    return {
      title: "Suggested next step",
      body: "Prioritise capital protection with fixed-income options. Start with an FD estimate to see guaranteed-style outcomes.",
      linkTo: "/fd-calculator",
      linkLabel: "Open FD Calculator",
    };
  }

  if (category === "Moderate") {
    return {
      title: "Suggested next step",
      body: "A balanced mix of growth and stability often fits. Compare SIP and lumpsum paths before allocating.",
      linkTo: "/compare-investments",
      linkLabel: "Compare Investments",
    };
  }

  return {
    title: "Suggested next step",
    body: "You may tolerate higher market volatility for long-term growth. Model an equity-style SIP with a higher expected return.",
    linkTo: "/sip-calculator",
    linkLabel: "Open SIP Calculator",
  };
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function RiskProfileResultCard({ result }: RiskProfileResultCardProps) {
  const recommendation = getRecommendation(result.predictedCategory);
  const categoryClass = result.predictedCategory.toLowerCase();

  const bars = [
    {
      key: "conservative",
      label: "Conservative",
      value: result.probabilities.conservative,
    },
    {
      key: "moderate",
      label: "Moderate",
      value: result.probabilities.moderate,
    },
    {
      key: "aggressive",
      label: "Aggressive",
      value: result.probabilities.aggressive,
    },
  ] as const;

  return (
    <div className="sip-result risk-profiler-result">
      <p className="result-label">Your risk profile</p>

      <div className={`risk-badge risk-badge-${categoryClass}`}>
        {result.predictedCategory}
      </div>

      <h2>{formatPercent(result.confidence)}</h2>
      <p className="risk-confidence-label">Confidence</p>

      <div className="risk-probability-list">
        {bars.map((bar) => (
          <div className="risk-probability-row" key={bar.key}>
            <div className="risk-probability-meta">
              <span>{bar.label}</span>
              <strong>{formatPercent(bar.value)}</strong>
            </div>
            <div className="risk-probability-track">
              <div
                className={`risk-probability-fill risk-fill-${bar.key}`}
                style={{ width: `${Math.max(bar.value * 100, 2)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="risk-recommendation">
        <strong>{recommendation.title}</strong>
        <p>{recommendation.body}</p>
        <Link to={recommendation.linkTo} className="risk-recommendation-link">
          {recommendation.linkLabel}
        </Link>
      </div>

      <p className="risk-model-note">
        Based on a logistic regression model trained on{" "}
        {RISK_PROFILER_METRICS.totalSamples} sample profiles (
        {(RISK_PROFILER_METRICS.testAccuracy * 100).toFixed(0)}% test accuracy).
        Estimates only, not financial advice.
      </p>
    </div>
  );
}

export default RiskProfileResultCard;
