import type {
  RiskCategory,
  RiskProfileInput,
  RiskProfileProbabilities,
  RiskProfileResult,
} from "../types/riskProfiler";

/**
 * Multi-class logistic regression weights trained offline
 * (scripts/train_risk_profiler.py) on 800 synthetic investor profiles.
 * Test accuracy: 72.00%
 *
 * Feature order:
 * age, monthlyIncome, investmentHorizonYears,
 * existingSavings, dependents, riskToleranceScore
 *
 * Class order: Conservative, Moderate, Aggressive
 */
const FEATURE_NAMES = [
  "age",
  "monthlyIncome",
  "investmentHorizonYears",
  "existingSavings",
  "dependents",
  "riskToleranceScore",
] as const;

const CLASS_NAMES: RiskCategory[] = [
  "Conservative",
  "Moderate",
  "Aggressive",
];

const SCALER_MEAN = [
  42.025, 257109.16333333333, 15.516666666666667, 2493660.3583333334, 2.52,
  5.265,
];

const SCALER_SCALE = [
  14.002655998059812, 143159.90422427407, 8.730963418902997,
  1452540.3631565794, 1.6939893742287755, 2.892768281997941,
];

const COEFFICIENTS: number[][] = [
  [
    1.0373976827697755, 0.17761685109904932, -1.348375641698709,
    -0.22515429215113494, 1.0074339948064661, -1.7834093920692982,
  ],
  [
    0.09886401840042186, 0.06956202195466138, -0.05456583351610373,
    -0.10787160989453795, 0.10255748848056472, -0.01223479278237559,
  ],
  [
    -1.1362617011701972, -0.2471788730537108, 1.402941475214812,
    0.3330259020456736, -1.1099914832870301, 1.7956441848516769,
  ],
];

const INTERCEPTS = [
  -1.0158828391526944, 1.1952864523129376, -0.17940361316024311,
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toFeatureVector(input: RiskProfileInput): number[] {
  return [
    clamp(input.age, 18, 65),
    clamp(input.monthlyIncome, 10_000, 500_000),
    clamp(input.investmentHorizonYears, 1, 30),
    clamp(input.existingSavings, 0, 5_000_000),
    clamp(input.dependents, 0, 5),
    clamp(input.riskToleranceScore, 1, 10),
  ];
}

function standardize(features: number[]): number[] {
  return features.map((value, index) => {
    const scale = SCALER_SCALE[index] || 1;
    return (value - SCALER_MEAN[index]) / scale;
  });
}

function softmax(logits: number[]): number[] {
  const maxLogit = Math.max(...logits);
  const exps = logits.map((logit) => Math.exp(logit - maxLogit));
  const sum = exps.reduce((total, value) => total + value, 0);

  if (sum <= 0 || !Number.isFinite(sum)) {
    const equal = 1 / logits.length;
    return logits.map(() => equal);
  }

  return exps.map((value) => value / sum);
}

function logitForClass(scaled: number[], classIndex: number): number {
  const weights = COEFFICIENTS[classIndex];
  let score = INTERCEPTS[classIndex];

  for (let i = 0; i < FEATURE_NAMES.length; i += 1) {
    score += weights[i] * scaled[i];
  }

  return score;
}

export function predictRiskProfile(
  input: RiskProfileInput
): RiskProfileResult {
  const features = toFeatureVector(input);
  const scaled = standardize(features);

  const logits = CLASS_NAMES.map((_, classIndex) =>
    logitForClass(scaled, classIndex)
  );
  const probs = softmax(logits);

  let bestIndex = 0;
  for (let i = 1; i < probs.length; i += 1) {
    if (probs[i] > probs[bestIndex]) {
      bestIndex = i;
    }
  }

  const probabilities: RiskProfileProbabilities = {
    conservative: probs[0],
    moderate: probs[1],
    aggressive: probs[2],
  };

  return {
    predictedCategory: CLASS_NAMES[bestIndex],
    confidence: probs[bestIndex],
    probabilities,
  };
}

export const RISK_PROFILER_METRICS = {
  testAccuracy: 0.72,
  totalSamples: 800,
  trainSize: 600,
  testSize: 200,
} as const;
