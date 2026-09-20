import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/common/Navbar";

import SipCalculatorPage from "./pages/SipCalculatorPage";
import LumpsumCalculatorPage from "./pages/LumpsumCalculatorPage";
import EmiCalculatorPage from "./pages/EmiCalculatorPage";
import FdCalculatorPage from "./pages/FdCalculatorPage";
import InvestmentComparisonPage from "./pages/InvestmentComparisonPage";
import PortfolioTrackerPage from "./pages/PortfolioTrackerPage";
import AnalyticsPage from "./pages/AnalyticsPage";

import "./App.css";

function App() {
  return (
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
          path="/portfolio"
          element={<PortfolioTrackerPage />}
        />

        <Route
          path="/analytics"
          element={<AnalyticsPage />}
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
  );
}

export default App;