import type { InvestmentInstrument } from "../types/investmentInstrument";

export const investmentInstruments: InvestmentInstrument[] = [
  {
    name: "SIP",
    category: "Market-linked",
    description:
      "A Systematic Investment Plan invests a fixed amount at regular intervals into mutual funds or similar products. It builds discipline and spreads purchase timing across market cycles.",
    returnMechanism:
      "Returns come from underlying fund growth plus rupee-cost averaging: you buy more units when prices are low and fewer when prices are high, which can smooth long-term outcomes.",
    riskLevel: "Moderate",
    typicalReturnRange: "10–14% p.a. historically (equity-oriented)",
  },
  {
    name: "Lumpsum Investment",
    category: "Market-linked",
    description:
      "A one-time investment deployed fully at purchase. Suitable when you have surplus capital and a clear time horizon for staying invested.",
    returnMechanism:
      "Wealth compounds as returns earn further returns over time. Final value depends on entry price, holding period, and the asset’s growth rate.",
    riskLevel: "High",
    typicalReturnRange: "10–15% p.a. historically (equity)",
  },
  {
    name: "Fixed Deposit",
    category: "Fixed-income",
    description:
      "A bank or NBFC deposit locked for a chosen tenure at a contracted interest rate. Principal and interest terms are known upfront.",
    returnMechanism:
      "Returns are generated from a fixed (or floating) interest rate, often compounded quarterly. Outcome is largely predictable for the tenure.",
    riskLevel: "Low",
    typicalReturnRange: "6–8% p.a. (illustrative bank FD range)",
  },
  {
    name: "Mutual Funds",
    category: "Market-linked",
    description:
      "Pooled vehicles managed by professionals that invest across equities, debt, or hybrids based on the scheme mandate. Investors hold units priced by NAV.",
    returnMechanism:
      "Returns track NAV movements of the underlying portfolio. Gains (or losses) reflect market performance after fund expenses.",
    riskLevel: "Moderate",
    typicalReturnRange: "8–14% p.a. depending on category",
  },
  {
    name: "Direct Equity (Stocks)",
    category: "Market-linked",
    description:
      "Buying shares of listed companies gives ownership exposure to business growth and market valuation. Returns can be volatile over short periods.",
    returnMechanism:
      "Returns come from price appreciation and optional dividends. Compounding works when gains are reinvested or held through multi-year growth.",
    riskLevel: "High",
    typicalReturnRange: "12%+ p.a. long-term equity averages (illustrative)",
  },
];
