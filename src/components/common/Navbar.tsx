import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link to="/sip-calculator" className="navbar-logo">
          Tech<span>Finance</span>
        </Link>

        <div className="navbar-links">

          <Link
            to="/sip-calculator"
            className={`nav-link ${
              location.pathname === "/sip-calculator"
                ? "active"
                : ""
            }`}
          >
            SIP Calculator
          </Link>

          <Link
            to="/lumpsum-calculator"
            className={`nav-link ${
              location.pathname === "/lumpsum-calculator"
                ? "active"
                : ""
            }`}
          >
            Lumpsum
          </Link>

          <Link
            to="/emi-calculator"
            className={`nav-link ${
              location.pathname === "/emi-calculator"
                ? "active"
                : ""
            }`}
          >
            EMI Calculator
          </Link>

          <Link
            to="/fd-calculator"
            className={`nav-link ${
              location.pathname === "/fd-calculator"
                ? "active"
                : ""
            }`}
          >
            FD Calculator
          </Link>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;