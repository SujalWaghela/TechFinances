export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  futureValue: number;
}

export function calculateSIP(
  monthlyInvestment: number,
  annualReturn: number,
  years: number
): SIPResult {
  const months = years * 12;
  const monthlyRate = annualReturn / 12 / 100;

  let futureValue: number;

  if (monthlyRate === 0) {
    futureValue = monthlyInvestment * months;
  } else {
    futureValue =
      monthlyInvestment *
      (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate));
  }

  const investedAmount = monthlyInvestment * months;
  const estimatedReturns = futureValue - investedAmount;

  return {
    investedAmount,
    estimatedReturns,
    futureValue,
  };
}