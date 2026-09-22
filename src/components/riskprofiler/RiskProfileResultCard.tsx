import { Link } from "react-router-dom";
import {
  riskProfileContent,
  type RiskProfileIconId,
} from "../../data/riskProfileContent";
import type { RiskCategory, RiskProfileResult } from "../../types/riskProfiler";
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

function getRecommendation(category: RiskCategory): Recommendation {
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

function RiskIcon({ icon }: { icon: RiskProfileIconId }) {
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 5 6.5v5.2c0 4.2 2.8 8 7 9.3 4.2-1.3 7-5.1 7-9.3V6.5L12 3Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M9.2 12.1 11 14l3.8-4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (icon === "balance") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 4v16M5 8h14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <path
          d="M5 8 2.8 13.2A3.2 3.2 0 0 0 5.8 17.5H6a3.2 3.2 0 0 0 3-1.8L7 8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M19 8 16.8 13.2A3.2 3.2 0 0 0 19.8 17.5H20a3.2 3.2 0 0 0 3-1.8L21 8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 16.5 10 10l3.5 3.5L20 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 7H20v5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RiskProfileResultCard({ result }: RiskProfileResultCardProps) {
  const recommendation = getRecommendation(result.predictedCategory);
  const content = riskProfileContent[result.predictedCategory];
  const categoryClass = result.predictedCategory.toLowerCase();

  const bars: {
    key: keyof typeof result.probabilities;
    category: RiskCategory;
    value: number;
  }[] = [
    {
      key: "conservative",
      category: "Conservative",
      value: result.probabilities.conservative,
    },
    {
      key: "moderate",
      category: "Moderate",
      value: result.probabilities.moderate,
    },
    {
      key: "aggressive",
      category: "Aggressive",
      value: result.probabilities.aggressive,
    },
  ];

  return (
    <div className="sip-result risk-profiler-result">
      <p className="result-label">Your risk profile</p>

      <div className={`risk-profile-hero risk-profile-hero-${categoryClass}`}>
        <div className={`risk-profile-icon risk-badge-${categoryClass}`}>
          <RiskIcon icon={content.icon} />
        </div>

        <div className="risk-profile-hero-text">
          <h2 className="risk-profile-category">{content.category}</h2>
          <p className="risk-profile-subtitle">{content.subtitle}</p>
        </div>
      </div>

      <p className="risk-profile-description">{content.description}</p>

      <div className="risk-suitable-for" aria-label="Typically suits">
        {content.suitableFor.map((item) => (
          <span key={item} className="risk-suitable-tag">
            {item}
          </span>
        ))}
      </div>

      <div className="risk-confidence-block">
        <strong className="risk-confidence-value">
          {formatPercent(result.confidence)}
        </strong>
        <span className="risk-confidence-label">Model confidence</span>
      </div>

      <div className="risk-probability-list">
        {bars.map((bar) => {
          const barContent = riskProfileContent[bar.category];
          return (
            <div className="risk-probability-row" key={bar.key}>
              <div className="risk-probability-meta">
                <span className="risk-probability-label">
                  <strong>{barContent.category}</strong>
                  <small>{barContent.subtitle}</small>
                </span>
                <strong className="risk-probability-pct">
                  {formatPercent(bar.value)}
                </strong>
              </div>
              <div className="risk-probability-track">
                <div
                  className={`risk-probability-fill risk-fill-${bar.key}`}
                  style={{ width: `${Math.max(bar.value * 100, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
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
