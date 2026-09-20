import "./App.css";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/common/Navbar";

import SipCalculatorPage from "./pages/SipCalculatorPage";
import LumpsumCalculatorPage from "./pages/LumpsumCalculatorPage";
import EmiCalculatorPage from "./pages/EmiCalculatorPage";
import FdCalculatorPage from "./pages/FdCalculatorPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to="/sip-calculator"
              replace
            />
          }
        />

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

      </Routes>
    </BrowserRouter>
  );
}

export default App;