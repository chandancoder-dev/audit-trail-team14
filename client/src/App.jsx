import { BrowserRouter, Routes, Route } from "react-router-dom";
import HistoricalState from "./pages/HistoricalState";
import ShipmentOperations from "./pages/ShipmentOperations";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import NavBar from "./components/Navbar";
import AuditTimeline from "./components/AuditTimeline";

function App() {
  return (
  
        <BrowserRouter>
        <NavBar/>

      <div className="min-h-screen bg-bg-primary text-text-normal">
        <Routes>
          <Route path="/" element={<ShipmentOperations />} />
          <Route path = "/home" element = {<Home/>} />
          <Route path = "/About" element = {<About/>} />
          <Route path = "/features" element = {<Features/>} />
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
