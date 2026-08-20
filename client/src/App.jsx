import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoricalState from "./pages/HistoricalState";
import ShipmentOperations from "./pages/ShipmentOperations";
import AuditTimeline from "./components/AuditTimeline";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-normal">
        <Routes>
          <Route path="/" element={<ShipmentOperations />} />
          <Route path="/historicalstate" element={<HistoricalState />} />
          <Route path="/audittimeline" element={<AuditTimeline />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
