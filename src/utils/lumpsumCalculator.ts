export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
}

export function calculateLumpsum(
  investment: number,
  annualReturn: number,
  years: number
): LumpsumResult {
  const futureValue =
    investment * Math.pow(1 + annualReturn / 100, years);

  const estimatedReturns = futureValue - investment;

  return {
    investedAmount: investment,
    estimatedReturns,
    futureValue,
  };
}