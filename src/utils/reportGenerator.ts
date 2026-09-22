import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { PortfolioPerformanceMetrics } from "../types/portfolioPerformance";
import {
  BENCHMARK_RATES,
  calculateInvestmentResult,
  compareToBenchmarks,
  type PortfolioInvestment,
} from "./portfolioCalculator";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function generatePortfolioReport(
  holdings: PortfolioInvestment[],
  performanceMetrics: PortfolioPerformanceMetrics
): void {
  const doc = new jsPDF();
  const generatedOn = new Date();
  const dateLabel = generatedOn.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  doc.setFontSize(18);
  doc.text("TechFinance Portfolio Report", 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(90);
  doc.text(`Generated on ${dateLabel}`, 14, 28);
  doc.setTextColor(20);

  const rows = holdings.map((holding) => {
    const result = calculateInvestmentResult(holding);
    return [
      holding.name,
      holding.type,
      formatMoney(result.investedAmount),
      formatMoney(result.currentValue),
      formatPercent(result.returnPercentage),
    ];
  });

  autoTable(doc, {
    startY: 36,
    head: [["Holding", "Type", "Invested", "Current Value", "Gain/Loss %"]],
    body: rows.length > 0 ? rows : [["No holdings", "-", "-", "-", "-"]],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [15, 110, 86] },
  });

  const metricsStart =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 80;

  let y = metricsStart + 14;
  doc.setFontSize(14);
  doc.text("Overall Performance", 14, y);

  y += 8;
  doc.setFontSize(11);
  const metricLines = [
    `Total Invested: ${formatMoney(performanceMetrics.totalInvested)}`,
    `Current Value: ${formatMoney(performanceMetrics.currentValue)}`,
    `Total Gain/Loss: ${formatMoney(performanceMetrics.totalGainLoss)} (${formatPercent(performanceMetrics.totalGainLossPercent)})`,
    `CAGR: ${formatPercent(performanceMetrics.cagr)}`,
    `Absolute Return: ${formatPercent(performanceMetrics.absoluteReturn)}`,
    `XIRR: ${formatPercent(performanceMetrics.xirr)}`,
  ];

  metricLines.forEach((line) => {
    doc.text(line, 14, y);
    y += 7;
  });

  y += 6;
  doc.setFontSize(14);
  doc.text("Benchmark Comparison (illustrative)", 14, y);
  y += 8;
  doc.setFontSize(11);

  const benchmarks = compareToBenchmarks(performanceMetrics.cagr);
  doc.text(
    `Portfolio CAGR ${formatPercent(performanceMetrics.cagr)} vs FD average ${BENCHMARK_RATES.fdAverage}% (${benchmarks.vsFD >= 0 ? "+" : ""}${benchmarks.vsFD.toFixed(2)} pts)`,
    14,
    y
  );
  y += 7;
  doc.text(
    `Portfolio CAGR vs Nifty historical ${BENCHMARK_RATES.niftyHistoricalCAGR}% (${benchmarks.vsNifty >= 0 ? "+" : ""}${benchmarks.vsNifty.toFixed(2)} pts)`,
    14,
    y
  );

  y += 12;
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(
    "Estimates only. Not financial advice. Benchmark rates are illustrative references.",
    14,
    y
  );

  const fileDate = generatedOn.toISOString().slice(0, 10);
  doc.save(`TechFinance_Portfolio_Report_${fileDate}.pdf`);
}
