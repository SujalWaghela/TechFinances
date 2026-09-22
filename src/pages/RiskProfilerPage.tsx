import { useState } from "react";
import RiskProfilerForm from "../components/riskprofiler/RiskProfilerForm";
import RiskProfileResultCard from "../components/riskprofiler/RiskProfileResultCard";
import type {
  RiskProfileInput,
  RiskProfileResult,
} from "../types/riskProfiler";
import { predictRiskProfile } from "../utils/riskProfiler";

const DEFAULT_INPUT: RiskProfileInput = {
  age: 32,
  monthlyIncome: 75_000,
  investmentHorizonYears: 12,
  existingSavings: 400_000,
  dependents: 1,
  riskToleranceScore: 6,
};

function RiskProfilerPage() {
  const [values, setValues] = useState<RiskProfileInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<RiskProfileResult>(() =>
    predictRiskProfile(DEFAULT_INPUT)
  );

  function handleSubmit() {
    setResult(predictRiskProfile(values));
  }

  return (
    <main className="sip-page">
      <div className="page-header">
        <p className="eyebrow">Before you invest</p>
        <h1>Risk Profiler</h1>
        <p>
          Answer a few questions about your finances. We estimate whether your
          style leans Conservative, Moderate, or Aggressive.
        </p>
      </div>

      <div className="sip-calculator risk-profiler-layout">
        <RiskProfilerForm
          values={values}
          onChange={setValues}
          onSubmit={handleSubmit}
        />
        <RiskProfileResultCard result={result} />
      </div>
    </main>
  );
}

export default RiskProfilerPage;
