import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HistoricalState from "./pages/HistoricalState";
import ShipmentOperations from "./pages/ShipmentOperations";
import AuditTimeline from './components/AuditTimeline';
import { AnalyticsPage } from './features/analytics';
import { AlertsPage } from './features/alerts';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-normal">
        <Routes>
          <Route path="/" element={<ShipmentOperations />} />
          <Route path="/historicalstate" element={<HistoricalState />} />
          <Route path="/audittimeline" element={<AuditTimeline />} />
          <Route path="/shipment/:id/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;