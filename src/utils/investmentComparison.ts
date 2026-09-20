export type InvestmentMode = "monthly" | "lumpsum";

export interface InvestmentOption {
  id: string;
  name: string;
  returnRate: number;
  type: "market" | "fixed" | "government";
}

export interface ComparisonResult {
  id: string;
  name: string;
  returnRate: number;
  investedAmount: number;
  estimatedValue: number;
  estimatedGain: number;
  type: InvestmentOption["type"];
}

export const defaultInvestmentOptions: InvestmentOption[] = [
  {
    id: "mutual-fund",
    name: "Mutual Fund / SIP",
    returnRate: 12,
    type: "market",
  },
  {
    id: "fixed-deposit",
    name: "Fixed Deposit",
    returnRate: 7,
    type: "fixed",
  },
  {
    id: "recurring-deposit",
    name: "Recurring Deposit",
    returnRate: 7,
    type: "fixed",
  },
  {
    id: "ppf",
    name: "PPF",
    returnRate: 7.1,
    type: "government",
  },
  {
    id: "savings",
    name: "Savings Account",
    returnRate: 3,
    type: "fixed",
  },
];

export function calculateInvestmentComparison(
  amount: number,
  years: number,
  mode: InvestmentMode,
  options: InvestmentOption[]
): ComparisonResult[] {
  return options.map((option) => {
    let investedAmount: number;
    let estimatedValue: number;

    if (mode === "monthly") {
      const months = years * 12;
      const monthlyRate = option.returnRate / 12 / 100;

      investedAmount = amount * months;

      if (monthlyRate === 0) {
        estimatedValue = investedAmount;
      } else {
        estimatedValue =
          amount *
          ((Math.pow(1 + monthlyRate, months) - 1) /
            monthlyRate) *
          (1 + monthlyRate);
      }
    } else {
      investedAmount = amount;

      estimatedValue =
        amount *
        Math.pow(1 + option.returnRate / 100, years);
    }

    return {
      id: option.id,
      name: option.name,
      returnRate: option.returnRate,
      investedAmount,
      estimatedValue,
      estimatedGain: estimatedValue - investedAmount,
      type: option.type,
    };
  });
}