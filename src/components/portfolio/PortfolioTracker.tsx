import { useEffect, useMemo, useState } from "react";

import PortfolioInput from "./PortfolioInput";
import PortfolioSummary from "./PortfolioSummary";
import PortfolioTable from "./PortfolioTable";
import PortfolioChart from "./PortfolioChart";

import {
  calculateInvestmentResult,
  calculatePortfolioSummary,
  type PortfolioInvestment,
  type PortfolioSnapshot,
} from "../../utils/portfolioCalculator";

const STORAGE_KEY =
  "techfinance-portfolio";

export const SNAPSHOT_STORAGE_KEY =
  "techfinance-portfolio-snapshots";

function PortfolioTracker() {
  const [investments, setInvestments] =
    useState<PortfolioInvestment[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            STORAGE_KEY
          );

        if (!saved) {
          return [];
        }

        return JSON.parse(saved);
      } catch {
        return [];
      }
    });

  const [snapshots, setSnapshots] =
    useState<PortfolioSnapshot[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            SNAPSHOT_STORAGE_KEY
          );

        if (!saved) {
          return [];
        }

        return JSON.parse(saved);
      } catch {
        return [];
      }
    });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(investments)
    );
  }, [investments]);

  useEffect(() => {
    localStorage.setItem(
      SNAPSHOT_STORAGE_KEY,
      JSON.stringify(snapshots)
    );
  }, [snapshots]);

  const results = useMemo(
    () =>
      investments.map(
        calculateInvestmentResult
      ),
    [investments]
  );

  const summary = useMemo(
    () =>
      calculatePortfolioSummary(
        investments
      ),
    [investments]
  );

  function handleAddInvestment(
    investment: PortfolioInvestment
  ) {
    setInvestments((current) => [
      ...current,
      investment,
    ]);
  }

  function handleDeleteInvestment(
    id: string
  ) {
    setInvestments((current) =>
      current.filter(
        (investment) =>
          investment.id !== id
      )
    );
  }

  function handleClearPortfolio() {
    const confirmed = window.confirm(
      "Are you sure you want to remove all investments?"
    );

    if (!confirmed) {
      return;
    }

    setInvestments([]);
  }

  function handleSaveSnapshot() {
    if (investments.length === 0) {
      return;
    }

    const today =
      new Date().toISOString().split("T")[0];

    const existingSnapshot =
      snapshots.find(
        (snapshot) =>
          snapshot.date === today
      );

    if (existingSnapshot) {
      setSnapshots((current) =>
        current.map((snapshot) =>
          snapshot.date === today
            ? {
                ...snapshot,
                totalInvested:
                  summary.totalInvested,
                currentValue:
                  summary.currentValue,
                totalGain:
                  summary.totalGain,
              }
            : snapshot
        )
      );

      return;
    }

    const newSnapshot: PortfolioSnapshot = {
      id: crypto.randomUUID(),
      date: today,
      totalInvested:
        summary.totalInvested,
      currentValue:
        summary.currentValue,
      totalGain:
        summary.totalGain,
    };

    setSnapshots((current) => [
      ...current,
      newSnapshot,
    ]);
  }

  return (
    <div className="investment-comparison portfolio-tracker">
      <PortfolioInput
        onAddInvestment={
          handleAddInvestment
        }
      />

      <PortfolioSummary
        summary={summary}
      />

      <div className="portfolio-snapshot-card">
        <div>
          <strong>
            Save Portfolio Snapshot
          </strong>

          <p>
            Save today's portfolio value so
            you can monitor growth and trends
            over time.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSnapshot}
        >
          Save Today's Snapshot
        </button>
      </div>

      <div className="portfolio-holdings-header">
        <div>
          <p className="eyebrow">
            YOUR PORTFOLIO
          </p>

          <h2>My Investments</h2>

          <p>
            Track all your investments and
            monitor their current performance.
          </p>
        </div>

        {investments.length > 0 && (
          <button
            type="button"
            className="portfolio-clear-button"
            onClick={
              handleClearPortfolio
            }
          >
            Clear Portfolio
          </button>
        )}
      </div>

      <PortfolioTable
        investments={results}
        onDelete={
          handleDeleteInvestment
        }
      />

      <PortfolioChart
        investments={results}
      />

      <div className="comparison-note">
        <strong>Important:</strong>

        <p>
          Portfolio values are based on the
          prices entered by you. Saved snapshots
          are used to generate historical
          analytics.
        </p>
      </div>
    </div>
  );
}

export default PortfolioTracker;