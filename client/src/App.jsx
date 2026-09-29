import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import HistoricalState from "./pages/HistoricalState";
import ShipmentOperations from "./pages/ShipmentOperations";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import NavBar from "./components/Navbar";
import AnalyticsPage from "./features/analytics/AnalyticsPage";
import AnalyticsOverview from "./features/analytics/AnalyticsOverview";
import AlertsPage from "./features/alerts/AlertsPage";
import AuditTimeline from "./components/AuditTimeline";
import ShipmentDetail from "./features/shipmentDetail/ShipmentDetail";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function AppContent() {
  const location = useLocation();

  // Pages that provide their own in-page "Back to Dashboard" navigation and
  // should render without the global Navbar.
  const hideNavbar =
    location.pathname === "/shipment-operations" ||
    location.pathname === "/analytics" ||
    location.pathname === "/alerts" ||
    location.pathname === "/historicalstate" ||
    location.pathname.startsWith("/shipment/") ||
    location.pathname.startsWith("/audittimeline/");

  return (
    <div className="min-h-screen bg-bg-primary text-text-normal">
      {!hideNavbar && <NavBar />}

      <Routes>
        {/* Main/Home */}
        <Route path="/" element={<Home />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Shipment Operations */}
        <Route
          path="/shipment-operations"
          element={<ShipmentOperations />}
        />

        {/* Shipment Details */}
        <Route
          path="/shipment/:shipmentId"
          element={<ShipmentDetail />}
        />

        {/* Other Pages */}
        <Route path="/About" element={<About />} />
        <Route path="/features" element={<Features />} />

        <Route
          path="/historicalstate"
          element={<HistoricalState />}
        />

        {/* Audit Timeline */}
        <Route
          path="/audittimeline/:id"
          element={<AuditTimeline />}
        />

        {/* Analytics */}
        <Route
          path="/shipment/:id/analytics"
          element={<AnalyticsPage />}
        />

        {/* Fleet Analytics Overview */}
        <Route path="/analytics" element={<AnalyticsOverview />} />

        {/* Alerts */}
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/shipment/:id/alerts" element={<AlertsPage />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;