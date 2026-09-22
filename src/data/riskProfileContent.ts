import type { RiskCategory } from "../types/riskProfiler";

export type RiskProfileIconId = "shield" | "balance" | "trending";

export interface RiskProfileContent {
  category: RiskCategory;
  subtitle: string;
  description: string;
  suitableFor: string[];
  icon: RiskProfileIconId;
}

export const riskProfileContent: Record<RiskCategory, RiskProfileContent> = {
  Conservative: {
    category: "Conservative",
    subtitle: "Safety First",
    description:
      "You prioritize protecting your money over chasing high returns.",
    suitableFor: ["Fixed Deposits", "Debt mutual funds"],
    icon: "shield",
  },
  Moderate: {
    category: "Moderate",
    subtitle: "Balanced Growth",
    description:
      "You want your money to grow, but with some cushion against losses.",
    suitableFor: [
      "A mix of mutual funds",
      "Balanced funds",
      "Some equity",
    ],
    icon: "balance",
  },
  Aggressive: {
    category: "Aggressive",
    subtitle: "Growth Focused",
    description:
      "You're comfortable with short-term ups and downs in exchange for higher long-term growth potential.",
    suitableFor: [
      "Direct equity",
      "Equity mutual funds",
      "Long-horizon SIPs",
    ],
    icon: "trending",
  },
};
