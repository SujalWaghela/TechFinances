import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Tech<span>Finance</span>
        </Link>

        {/* Calculators */}
        <div className="navbar-links">
          <Link to="/sip-calculator" className="nav-link active">
            SIP Calculator
          </Link>

          <Link to="/lumpsum-calculator" className="nav-link">
            Lumpsum
          </Link>

          <Link to="/emi-calculator" className="nav-link">
            EMI Calculator
          </Link>

          <Link to="/fd-calculator" className="nav-link">
            FD Calculator
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;