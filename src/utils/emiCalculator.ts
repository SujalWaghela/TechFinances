export interface EmiResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculateEMI(
  loanAmount: number,
  annualInterestRate: number,
  years: number
): EmiResult {
  const months = years * 12;

  if (
    !Number.isFinite(loanAmount) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(years) ||
    loanAmount <= 0 ||
    years <= 0 ||
    months <= 0
  ) {
    return {
      monthlyEMI: 0,
      totalInterest: 0,
      totalPayment: 0,
    };
  }

  const monthlyRate = annualInterestRate / 12 / 100;

  let monthlyEMI: number;

  if (monthlyRate === 0) {
    monthlyEMI = loanAmount / months;
  } else {
    monthlyEMI =
      (loanAmount *
        monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  const totalPayment = monthlyEMI * months;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyEMI,
    totalInterest,
    totalPayment,
  };
}