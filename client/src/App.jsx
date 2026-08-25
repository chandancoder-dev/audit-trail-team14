import { BrowserRouter, Routes, Route } from "react-router-dom";

import HistoricalState from "./pages/HistoricalState";
import ShipmentOperations from "./pages/ShipmentOperations";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import NavBar from "./components/Navbar";
import AnalyticsPage from "./features/analytics/AnalyticsPage"
import AlertsPage from "./features/alerts/AlertsPage"
import AuditTimeline from "./components/AuditTimeline";
import ShipmentDetail from "./features/shipmentDetail/ShipmentDetail";
import Login from "./pages/Login";

function App() {
  return (
  
        <BrowserRouter>
        <NavBar/>

      <div className="min-h-screen bg-bg-primary text-text-normal">
        <Routes>
          <Route path="/" element={<ShipmentOperations />} />
          <Route path="/shipment/:shipmentId" element={<ShipmentDetail />} />
          <Route path = "/home" element = {<Home/>} />
          <Route path = "/About" element = {<About/>} />
          <Route path = "/features" element = {<Features/>} />
          <Route path="/historicalstate" element={<HistoricalState />} />
          <Route path="/audittimeline" element={<AuditTimeline />} />
          <Route path="/shipment/:id/analytics" element={<AnalyticsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/login" element={<Login/>}/>
        </Routes>
      </div>
      </BrowserRouter>
   
     
    
  );
}

export default App;