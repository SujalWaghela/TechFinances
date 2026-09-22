import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { RiskProfile } from "../types/auth";
import { calculatePortfolioSummary } from "../utils/portfolioCalculator";
import { loadUserPortfolio } from "../utils/userDataStorage";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("moderate");
  const [investmentGoal, setInvestmentGoal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [portfolioTick, setPortfolioTick] = useState(0);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setPhone(user.phone);
    setRiskProfile(user.riskProfile);
    setInvestmentGoal(user.investmentGoal);
  }, [user]);

  useEffect(() => {
    function refresh() {
      setPortfolioTick((value) => value + 1);
    }

    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);

  const portfolio = useMemo(() => {
    if (!user) {
      return [];
    }

    void portfolioTick;
    return loadUserPortfolio(user.id);
  }, [user, portfolioTick]);

  const portfolioSummary = useMemo(
    () => calculatePortfolioSummary(portfolio),
    [portfolio]
  );

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const joinedOn = new Date(user.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const message = await updateProfile({
      name,
      phone,
      riskProfile,
      investmentGoal,
    });

    setSubmitting(false);

    if (message) {
      setError(message);
      return;
    }

    setSuccess("Profile updated successfully.");
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="profile-page">
      <div className="page-header">
        <p className="eyebrow">YOUR ACCOUNT</p>
        <h1>Profile</h1>
        <p>Manage your personal details and view your private portfolio.</p>
      </div>

      <div className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-avatar">{initials || "TF"}</div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <div className="profile-meta">
            <div>
              <span>Member since</span>
              <strong>{joinedOn}</strong>
            </div>
            <div>
              <span>Risk profile</span>
              <strong className="profile-risk-badge">{user.riskProfile}</strong>
            </div>
          </div>

          <button
            type="button"
            className="profile-logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        </aside>

        <div className="profile-main-column">
          <section className="profile-portfolio-card">
            <div className="profile-portfolio-header">
              <div>
                <h3>My Portfolio</h3>
                <p>
                  Saved only to your account. Other logins cannot see this
                  data.
                </p>
              </div>
              <Link to="/portfolio" className="profile-portfolio-link">
                Open Tracker
              </Link>
            </div>

            {portfolio.length === 0 ? (
              <p className="profile-portfolio-empty">
                No investments yet. Add stocks or funds in Portfolio Tracker
                and they will appear here.
              </p>
            ) : (
              <>
                <div className="profile-portfolio-stats">
                  <div>
                    <span>Holdings</span>
                    <strong>{portfolio.length}</strong>
                  </div>
                  <div>
                    <span>Invested</span>
                    <strong>
                      {formatMoney(portfolioSummary.totalInvested)}
                    </strong>
                  </div>
                  <div>
                    <span>Current Value</span>
                    <strong>
                      {formatMoney(portfolioSummary.currentValue)}
                    </strong>
                  </div>
                  <div>
                    <span>Gain / Loss</span>
                    <strong
                      className={
                        portfolioSummary.totalGain >= 0
                          ? "is-positive"
                          : "is-negative"
                      }
                    >
                      {formatMoney(portfolioSummary.totalGain)}
                    </strong>
                  </div>
                </div>

                <ul className="profile-holdings-list">
                  {portfolio.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.type}</span>
                      </div>
                      <em>
                        {formatMoney(item.quantity * item.currentPrice)}
                      </em>
                    </li>
                  ))}
                </ul>

                {portfolio.length > 5 && (
                  <p className="profile-portfolio-more">
                    +{portfolio.length - 5} more holdings in Portfolio Tracker
                  </p>
                )}
              </>
            )}
          </section>

          <section className="profile-form-card">
            <h3>Edit profile</h3>
            <p className="profile-form-lead">
              These details stay on this device for now and help personalize
              your finance tools.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p className="auth-error">{error}</p>}
              {success && <p className="auth-success">{success}</p>}

              <label className="auth-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>

              <label className="auth-field">
                <span>Email</span>
                <input type="email" value={user.email} disabled />
              </label>

              <label className="auth-field">
                <span>Phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Optional"
                />
              </label>

              <label className="auth-field">
                <span>Risk profile</span>
                <select
                  value={riskProfile}
                  onChange={(event) =>
                    setRiskProfile(event.target.value as RiskProfile)
                  }
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </label>

              <label className="auth-field">
                <span>Investment goal</span>
                <textarea
                  rows={3}
                  value={investmentGoal}
                  onChange={(event) => setInvestmentGoal(event.target.value)}
                  placeholder="e.g. Build a retirement corpus in 15 years"
                />
              </label>

              <button
                type="submit"
                className="auth-submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save changes"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
