import { Link } from "react-router-dom";

const CALCULATOR_LINKS = [
  { to: "/sip-calculator", label: "SIP Calculator" },
  { to: "/lumpsum-calculator", label: "Lumpsum Calculator" },
  { to: "/emi-calculator", label: "EMI Calculator" },
  { to: "/fd-calculator", label: "FD Calculator" },
  { to: "/compare-investments", label: "Compare Investments" },
] as const;

const PLATFORM_LINKS = [
  { to: "/portfolio", label: "Portfolio Tracker" },
  { to: "/analytics", label: "Analytics" },
  { to: "/investment-instruments", label: "Investment Instruments" },
  { to: "/risk-profiler", label: "Risk Profiler" },
] as const;

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/portfolio" className="navbar-logo">
              Tech<span>Finance</span>
            </Link>
            <p className="footer-tagline">
              Clear tools for everyday investing decisions
            </p>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Calculators</h3>
            <ul className="footer-links">
              {CALCULATOR_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-heading">Platform</h3>
            <ul className="footer-links">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column footer-disclaimer">
            <h3 className="footer-heading">Disclaimer</h3>
            <p className="footer-disclaimer-text">
              This platform is for educational and informational purposes only
              and does not constitute financial advice. All calculations are
              estimates based on user-provided inputs and assumed rates of
              return.
            </p>
            <p className="footer-credits">
              Stock data from Twelve Data. Mutual fund data from AMFI via
              mfapi.in.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 TechFinance. All rights reserved.
          </p>
          <p className="footer-meta">An MSc Project</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
