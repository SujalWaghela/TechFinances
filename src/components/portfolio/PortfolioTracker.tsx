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
import {
  loadUserPortfolio,
  saveUserPortfolio,
} from "../../utils/userDataStorage";

interface PortfolioTrackerProps {
  userId: string;
}

function PortfolioTracker({ userId }: PortfolioTrackerProps) {
  const [investments, setInvestments] = useState<PortfolioInvestment[]>(() =>
    loadUserPortfolio(userId)
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setInvestments(loadUserPortfolio(userId));
    setHydrated(true);
  }, [userId]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveUserPortfolio(userId, investments);
  }, [userId, investments, hydrated]);

  const results = useMemo(
    () => investments.map(calculateInvestmentResult),
    [investments]
  );

  const summary = useMemo(
    () => calculatePortfolioSummary(investments),
    [investments]
  );

  function handleAddInvestment(investment: PortfolioInvestment) {
    setInvestments((current) => [...current, investment]);
  }

  function handleDeleteInvestment(id: string) {
    setInvestments((current) =>
      current.filter((investment) => investment.id !== id)
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
      <PortfolioInput onAddInvestment={handleAddInvestment} />

      <PortfolioSummary summary={summary} />

      <div className="portfolio-holdings-header">
        <div>
          <p className="eyebrow">YOUR PORTFOLIO</p>

          <h2>My Investments</h2>

          <p>
            Track all your investments and monitor their current performance.
            This portfolio is saved only to your account.
          </p>
        </div>

        {investments.length > 0 && (
          <button
            type="button"
            className="portfolio-clear-button"
            onClick={handleClearPortfolio}
          >
            Clear Portfolio
          </button>
        )}
      </div>

      <PortfolioTable
        investments={results}
        onDelete={handleDeleteInvestment}
      />

      <PortfolioChart investments={results} />

      <div className="comparison-note">
        <strong>Important:</strong>

        <p>
          Portfolio values are based on the prices entered by you and are
          stored privately under your logged-in account.
        </p>
      </div>
    </div>
  );
}

export default PortfolioTracker;
