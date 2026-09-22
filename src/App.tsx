import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";

import SipCalculatorPage from "./pages/SipCalculatorPage";
import LumpsumCalculatorPage from "./pages/LumpsumCalculatorPage";
import EmiCalculatorPage from "./pages/EmiCalculatorPage";
import FdCalculatorPage from "./pages/FdCalculatorPage";
import InvestmentComparisonPage from "./pages/InvestmentComparisonPage";
import PortfolioTrackerPage from "./pages/PortfolioTrackerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RiskProfilerPage from "./pages/RiskProfilerPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route
            path="/sip-calculator"
            element={<SipCalculatorPage />}
          />

          <Route
            path="/lumpsum-calculator"
            element={<LumpsumCalculatorPage />}
          />

          <Route
            path="/emi-calculator"
            element={<EmiCalculatorPage />}
          />

          <Route
            path="/fd-calculator"
            element={<FdCalculatorPage />}
          />

          <Route
            path="/compare-investments"
            element={<InvestmentComparisonPage />}
          />

          <Route
            path="/risk-profiler"
            element={<RiskProfilerPage />}
          />

          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioTrackerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/sip-calculator"
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
