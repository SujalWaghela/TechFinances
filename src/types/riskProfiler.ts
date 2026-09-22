export type RiskCategory = "Conservative" | "Moderate" | "Aggressive";

export interface RiskProfileInput {
  age: number;
  monthlyIncome: number;
  investmentHorizonYears: number;
  existingSavings: number;
  dependents: number;
  riskToleranceScore: number;
}

export interface RiskProfileProbabilities {
  conservative: number;
  moderate: number;
  aggressive: number;
}

export interface RiskProfileResult {
  predictedCategory: RiskCategory;
  confidence: number;
  probabilities: RiskProfileProbabilities;
}
