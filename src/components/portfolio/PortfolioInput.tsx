import { useState } from "react";

import type {
  PortfolioInvestment,
  PortfolioType,
} from "../../utils/portfolioCalculator";

interface PortfolioInputProps {
  onAddInvestment: (
    investment: PortfolioInvestment
  ) => void;
}

function PortfolioInput({
  onAddInvestment,
}: PortfolioInputProps) {
  const [name, setName] = useState("");

  const [type, setType] =
    useState<PortfolioType>("Stock");

  const [quantity, setQuantity] =
    useState("");

  const [buyPrice, setBuyPrice] =
    useState("");

  const [currentPrice, setCurrentPrice] =
    useState("");

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const parsedQuantity = Number(quantity);
    const parsedBuyPrice = Number(buyPrice);
    const parsedCurrentPrice =
      Number(currentPrice);

    if (
      !name.trim() ||
      parsedQuantity <= 0 ||
      parsedBuyPrice <= 0 ||
      parsedCurrentPrice < 0
    ) {
      return;
    }

    const investment: PortfolioInvestment = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      quantity: parsedQuantity,
      buyPrice: parsedBuyPrice,
      currentPrice: parsedCurrentPrice,
    };

    onAddInvestment(investment);

    setName("");
    setType("Stock");
    setQuantity("");
    setBuyPrice("");
    setCurrentPrice("");
  }

  return (
    <div className="portfolio-input-card">
      <div className="comparison-section-heading">
        <p className="eyebrow">ADD INVESTMENT</p>

        <h2>Add to Your Portfolio</h2>

        <p>
          Add stocks, mutual funds and other
          investments to track your portfolio
          performance.
        </p>
      </div>

      <form
        className="portfolio-form"
        onSubmit={handleSubmit}
      >
        <div className="portfolio-form-group">
          <label>Investment Name</label>

          <input
            type="text"
            placeholder="e.g. Reliance Industries"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div className="portfolio-form-group">
          <label>Investment Type</label>

          <select
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as PortfolioType
              )
            }
          >
            <option value="Stock">
              Stock
            </option>

            <option value="Mutual Fund">
              Mutual Fund
            </option>

            <option value="Fixed Deposit">
              Fixed Deposit
            </option>

            <option value="Recurring Deposit">
              Recurring Deposit
            </option>

            <option value="PPF">
              PPF
            </option>

            <option value="Gold">
              Gold
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div className="portfolio-form-row">
          <div className="portfolio-form-group">
            <label>Quantity</label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="10"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
            />
          </div>

          <div className="portfolio-form-group">
            <label>Buy Price</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="₹ 1,400"
              value={buyPrice}
              onChange={(event) =>
                setBuyPrice(event.target.value)
              }
            />
          </div>

          <div className="portfolio-form-group">
            <label>Current Price</label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="₹ 1,520"
              value={currentPrice}
              onChange={(event) =>
                setCurrentPrice(
                  event.target.value
                )
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="portfolio-add-button"
        >
          + Add Investment
        </button>
      </form>
    </div>
  );
}

export default PortfolioInput;