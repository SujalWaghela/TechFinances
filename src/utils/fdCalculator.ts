export interface FdResult {
  principal: number;
  interest: number;
  maturityAmount: number;
}

export function calculateFD(
  principal: number,
  annualRate: number,
  years: number
): FdResult {
  const compoundingFrequency = 4;

  const maturityAmount =
    principal *
    Math.pow(
      1 + annualRate / 100 / compoundingFrequency,
      compoundingFrequency * years
    );

  const interest = maturityAmount - principal;

  return {
    principal,
    interest,
    maturityAmount,
  };
}