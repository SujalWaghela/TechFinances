import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import SipCalculatorPage from "./pages/SipCalculatorPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Navigate to="/sip-calculator" replace />}
        />

        <Route
          path="/sip-calculator"
          element={<SipCalculatorPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;