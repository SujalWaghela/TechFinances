import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/sip-calculator" className="navbar-logo">
          Tech<span>Finance</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/portfolio" className="nav-link">
            Portfolio
          </NavLink>

          <NavLink to="/analytics" className="nav-link">
            Analytics
          </NavLink>

          <NavLink to="/compare-investments" className="nav-link">
            Compare
          </NavLink>

          <div className="navbar-dropdown">
            <button
              type="button"
              className={`nav-link calculator-button ${
                calculatorOpen ? "active" : ""
              }`}
              onClick={() => setCalculatorOpen(!calculatorOpen)}
            >
              Calculator
              <span className="dropdown-arrow">▾</span>
            </button>

            {calculatorOpen && (
              <div className="calculator-menu">
                <NavLink
                  to="/sip-calculator"
                  className="calculator-menu-link"
                  onClick={() => setCalculatorOpen(false)}
                >
                  SIP Calculator
                </NavLink>

                <NavLink
                  to="/lumpsum-calculator"
                  className="calculator-menu-link"
                  onClick={() => setCalculatorOpen(false)}
                >
                  Lumpsum
                </NavLink>

                <NavLink
                  to="/emi-calculator"
                  className="calculator-menu-link"
                  onClick={() => setCalculatorOpen(false)}
                >
                  EMI Calculator
                </NavLink>

                <NavLink
                  to="/fd-calculator"
                  className="calculator-menu-link"
                  onClick={() => setCalculatorOpen(false)}
                >
                  FD Calculator
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;