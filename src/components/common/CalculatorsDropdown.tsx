import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";

const CALCULATOR_LINKS = [
  { to: "/sip-calculator", label: "SIP Calculator" },
  { to: "/lumpsum-calculator", label: "Lumpsum Calculator" },
  { to: "/emi-calculator", label: "EMI Calculator" },
  { to: "/fd-calculator", label: "FD Calculator" },
  { to: "/compare-investments", label: "Compare Investments" },
] as const;

const CALCULATOR_PATHS = CALCULATOR_LINKS.map((link) => link.to);

function CalculatorsDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isSectionActive = CALCULATOR_PATHS.some(
    (path) => location.pathname === path
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
      return;
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="navbar-dropdown" ref={containerRef}>
      <button
        type="button"
        className={`nav-link calculator-button ${
          open || isSectionActive ? "active" : ""
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
      >
        Calculators
        <span className="dropdown-arrow">▾</span>
      </button>

      {open && (
        <div
          className="calculator-menu"
          role="menu"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
        >
          {CALCULATOR_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              role="menuitem"
              className="calculator-menu-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default CalculatorsDropdown;
