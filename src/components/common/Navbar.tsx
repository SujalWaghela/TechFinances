import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/sip-calculator"
          className="navbar-logo"
        >
          Tech<span>Finance</span>
        </Link>

        <div className="navbar-links">
          <NavLink
            to="/sip-calculator"
            className="nav-link"
          >
            SIP Calculator
          </NavLink>

          <NavLink
            to="/lumpsum-calculator"
            className="nav-link"
          >
            Lumpsum
          </NavLink>

          <NavLink
            to="/emi-calculator"
            className="nav-link"
          >
            EMI Calculator
          </NavLink>

          <NavLink
            to="/fd-calculator"
            className="nav-link"
          >
            FD Calculator
          </NavLink>

          <NavLink
            to="/compare-investments"
            className="nav-link"
          >
            Compare
          </NavLink>

          <NavLink
            to="/portfolio"
            className="nav-link"
          >
            Portfolio
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;