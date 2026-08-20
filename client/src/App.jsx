import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoricalState from "./pages/HistoricalState";
import { ShipmentDetail } from "./features/shipmentDetail";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-normal">
        <Routes>
          <Route path="/" element={<HistoricalState />} />
          <Route
            path="/shipment/:shipmentId"
            element={<ShipmentDetail />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;