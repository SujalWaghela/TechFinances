export interface CashFlow {
  date: Date;
  amount: number;
}

export interface PortfolioPerformanceMetrics {
  cagr: number;
  absoluteReturn: number;
  xirr: number;
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
}

export interface BenchmarkComparison {
  vsFD: number;
  vsNifty: number;
}
