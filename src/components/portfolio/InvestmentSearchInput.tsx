import { useEffect, useId, useRef, useState } from "react";

import type { SelectedInvestmentOption } from "../../types/marketData";
import { searchMutualFunds } from "../../utils/mutualFundApi";
import { searchStocks } from "../../utils/stockApi";

interface InvestmentSearchInputProps {
  selected: SelectedInvestmentOption | null;
  onSelect: (option: SelectedInvestmentOption) => void;
  onClear: () => void;
}

interface SearchRow extends SelectedInvestmentOption {
  subtitle: string;
}

function InvestmentSearchInput({
  selected,
  onSelect,
  onClear,
}: InvestmentSearchInputProps) {
  const inputId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (selected) {
      setQuery(selected.name);
      setResults([]);
      setOpen(false);
      setError(null);
    }
  }, [selected]);

  useEffect(() => {
    if (selected && query === selected.name) {
      return;
    }

    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      const [stockSettled, fundSettled] = await Promise.allSettled([
        searchStocks(trimmed),
        searchMutualFunds(trimmed),
      ]);

      if (cancelled) {
        return;
      }

      const stockRows: SearchRow[] =
        stockSettled.status === "fulfilled"
          ? stockSettled.value.map((item) => ({
              name: item.instrumentName,
              type: "stock" as const,
              symbolOrCode: item.symbol,
              exchange: item.exchange,
              subtitle: `${item.symbol} on ${item.exchange}`,
            }))
          : [];

      const fundRows: SearchRow[] =
        fundSettled.status === "fulfilled"
          ? fundSettled.value.map((item) => ({
              name: item.schemeName,
              type: "mutual_fund" as const,
              symbolOrCode: String(item.schemeCode),
              subtitle: `Scheme ${item.schemeCode}`,
            }))
          : [];

      setResults([...stockRows, ...fundRows].slice(0, 12));
      setOpen(true);
      setLoading(false);

      const messages: string[] = [];

      if (stockSettled.status === "rejected") {
        messages.push(
          stockSettled.reason instanceof Error
            ? stockSettled.reason.message
            : "Stock search failed."
        );
      }

      if (fundSettled.status === "rejected") {
        messages.push(
          fundSettled.reason instanceof Error
            ? fundSettled.reason.message
            : "Mutual fund search failed."
        );
      }

      if (stockRows.length === 0 && fundRows.length === 0 && messages.length > 0) {
        setError(messages.join(" "));
      } else if (messages.length > 0) {
        setError(messages[0]);
      } else {
        setError(null);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, selected]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(row: SearchRow) {
    onSelect({
      name: row.name,
      type: row.type,
      symbolOrCode: row.symbolOrCode,
      exchange: row.exchange,
    });
    setQuery(row.name);
    setOpen(false);
    setResults([]);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setError(null);
    onClear();
  }

  return (
    <div className="investment-search" ref={containerRef}>
      <label htmlFor={inputId}>Search Stock / Mutual Fund</label>

      <div className="investment-search-control">
        <input
          id={inputId}
          type="text"
          autoComplete="off"
          placeholder="Search NSE/BSE stocks or mutual funds (e.g. RELIANCE, Parag Parikh)"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            if (selected) {
              onClear();
            }
          }}
          onFocus={() => {
            if (results.length > 0) {
              setOpen(true);
            }
          }}
        />

        {loading && <span className="investment-search-spinner" aria-hidden />}

        {selected && (
          <button
            type="button"
            className="investment-search-clear"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      {error && <p className="investment-search-error">{error}</p>}

      {open && query.trim().length >= 2 && !loading && (
        <div className="investment-search-dropdown" role="listbox">
          {results.length === 0 ? (
            <p className="investment-search-empty">No results</p>
          ) : (
            results.map((row) => (
              <button
                type="button"
                key={`${row.type}-${row.symbolOrCode}-${row.exchange ?? "mf"}`}
                className="investment-search-option"
                onClick={() => handleSelect(row)}
              >
                <span className="investment-search-option-text">
                  <strong>{row.name}</strong>
                  <small>{row.subtitle}</small>
                </span>
                <span
                  className={`investment-search-badge investment-search-badge-${row.type}`}
                >
                  {row.type === "stock" ? "Stock" : "Mutual Fund"}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default InvestmentSearchInput;
