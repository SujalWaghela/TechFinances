import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CalculatorsDropdown from "./CalculatorsDropdown";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

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

          <NavLink to="/risk-profiler" className="nav-link">
            Risk Profiler
          </NavLink>

          <CalculatorsDropdown />

          {isAuthenticated && user ? (
            <div className="navbar-auth">
              <NavLink to="/profile" className="nav-link nav-profile-link">
                <span className="nav-avatar">
                  {user.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? "")
                    .join("") || "TF"}
                </span>
                <span className="nav-profile-name">{user.name.split(" ")[0]}</span>
              </NavLink>

              <button
                type="button"
                className="nav-logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <NavLink to="/login" className="nav-link">
                Log in
              </NavLink>
              <NavLink to="/register" className="nav-cta">
                Sign up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
