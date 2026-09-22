import { calculateSIP } from "./sipCalculator";
import { calculateLumpsum } from "./lumpsumCalculator";
import { calculateFD } from "./fdCalculator";

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

/**
 * Uses the same calculator functions as the dedicated pages so Compare
 * numbers stay in lockstep with SIP / Lumpsum / FD results.
 * Fixed Deposit in lumpsum mode uses quarterly compounding (calculateFD).
 */
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
      const sip = calculateSIP(amount, option.returnRate, years);
      investedAmount = sip.investedAmount;
      estimatedValue = sip.futureValue;
    } else if (option.id === "fixed-deposit") {
      const fd = calculateFD(amount, option.returnRate, years);
      investedAmount = fd.principal;
      estimatedValue = fd.maturityAmount;
    } else {
      const lumpsum = calculateLumpsum(amount, option.returnRate, years);
      investedAmount = lumpsum.investedAmount;
      estimatedValue = lumpsum.futureValue;
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
