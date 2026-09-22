import { useState, type FormEvent } from "react";

import InvestmentSearchInput from "./InvestmentSearchInput";
import type { SelectedInvestmentOption } from "../../types/marketData";
import type { PortfolioInvestment } from "../../utils/portfolioCalculator";
import {
  getMutualFundNav,
  getNavValue,
} from "../../utils/mutualFundApi";
import { getStockQuote } from "../../utils/stockApi";

interface PortfolioInputProps {
  onAddInvestment: (investment: PortfolioInvestment) => void;
}

function PortfolioInput({ onAddInvestment }: PortfolioInputProps) {
  const [selected, setSelected] = useState<SelectedInvestmentOption | null>(
    null
  );
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSelect(option: SelectedInvestmentOption) {
    setSelected(option);
    setError(null);
    setLivePrice(null);
    setPriceLoading(true);

    try {
      if (option.type === "stock") {
        if (!option.exchange) {
          throw new Error("Stock exchange is missing. Please select again.");
        }
        const quote = await getStockQuote(option.symbolOrCode, option.exchange);
        setLivePrice(quote.c);
      } else {
        const nav = await getMutualFundNav(option.symbolOrCode);
        setLivePrice(getNavValue(nav));
      }
    } catch (err: unknown) {
      setLivePrice(null);
      setError(
        err instanceof Error
          ? err.message
          : "Could not fetch live price. Please retry."
      );
    } finally {
      setPriceLoading(false);
    }
  }

  function handleClearSelection() {
    setSelected(null);
    setLivePrice(null);
    setError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!selected) {
      setError("Select a listed stock or mutual fund from search.");
      return;
    }

    const parsedQuantity = Number(quantity);
    const parsedBuyPrice = Number(buyPrice);

    if (parsedQuantity <= 0 || parsedBuyPrice <= 0) {
      setError("Enter a valid quantity and buy price.");
      return;
    }

    setSubmitting(true);

    try {
      let currentPrice = livePrice;

      if (currentPrice === null || currentPrice <= 0) {
        if (selected.type === "stock") {
          if (!selected.exchange) {
            throw new Error("Stock exchange is missing. Please select again.");
          }
          const quote = await getStockQuote(
            selected.symbolOrCode,
            selected.exchange
          );
          currentPrice = quote.c;
        } else {
          const nav = await getMutualFundNav(selected.symbolOrCode);
          currentPrice = getNavValue(nav);
        }
      }

      if (currentPrice === null || currentPrice <= 0) {
        throw new Error("Live price is unavailable for this instrument.");
      }

      const investment: PortfolioInvestment = {
        id: crypto.randomUUID(),
        name: selected.name,
        type: selected.type === "stock" ? "Stock" : "Mutual Fund",
        quantity: parsedQuantity,
        buyPrice: parsedBuyPrice,
        currentPrice,
        symbolOrCode: selected.symbolOrCode,
        exchange: selected.exchange,
        liveAssetKind: selected.type,
        lastPriceUpdated: new Date().toISOString(),
      };

      onAddInvestment(investment);

      setSelected(null);
      setQuantity("");
      setBuyPrice("");
      setLivePrice(null);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not add investment. Please retry."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="portfolio-input-card">
      <div className="comparison-section-heading">
        <p className="eyebrow">ADD INVESTMENT</p>

        <h2>Add to Your Portfolio</h2>

        <p>
          Search NSE/BSE stocks and Indian mutual funds. Live price / NAV is
          fetched automatically — no manual current price needed.
        </p>
      </div>

      <form className="portfolio-form" onSubmit={handleSubmit}>
        <InvestmentSearchInput
          selected={selected}
          onSelect={handleSelect}
          onClear={handleClearSelection}
        />

        {selected && (
          <div className="portfolio-live-price">
            <div>
              <span>Live {selected.type === "stock" ? "Price" : "NAV"}</span>
              <strong>
                {priceLoading
                  ? "Fetching…"
                  : livePrice !== null
                    ? `₹${livePrice.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}`
                    : "—"}
              </strong>
            </div>
            <small>
              {selected.type === "stock"
                ? `${selected.symbolOrCode} · ${selected.exchange ?? ""}`
                : `Scheme ${selected.symbolOrCode}`}
            </small>
          </div>
        )}

        <div className="portfolio-form-row portfolio-form-row-two">
          <div className="portfolio-form-group">
            <label htmlFor="portfolio-quantity">Quantity / Units</label>
            <input
              id="portfolio-quantity"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="10"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </div>

          <div className="portfolio-form-group">
            <label htmlFor="portfolio-buy-price">Buy Price</label>
            <input
              id="portfolio-buy-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="₹ 1,400"
              value={buyPrice}
              onChange={(event) => setBuyPrice(event.target.value)}
            />
          </div>
        </div>

        {error && <p className="portfolio-form-error">{error}</p>}

        <button
          type="submit"
          className="portfolio-add-button"
          disabled={submitting || priceLoading}
        >
          {submitting ? "Adding…" : "+ Add Investment"}
        </button>
      </form>
    </div>
  );
}

export default PortfolioInput;
