import { useEffect, useMemo, useState } from "react";

import PortfolioInput from "./PortfolioInput";
import PortfolioSummary from "./PortfolioSummary";
import PortfolioTable from "./PortfolioTable";
import PortfolioChart from "./PortfolioChart";

import {
  calculateInvestmentResult,
  calculatePortfolioSummary,
  type PortfolioInvestment,
} from "../../utils/portfolioCalculator";

const STORAGE_KEY =
  "techfinance-portfolio";

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

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(investments)
    );
  }, [investments]);

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
          prices entered by you. This tracker
          does not automatically fetch live
          market prices. Actual market values
          may change continuously.
        </p>
      </div>
    </div>
  );
}

export default PortfolioTracker;