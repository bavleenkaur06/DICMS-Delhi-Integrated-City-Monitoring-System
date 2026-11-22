import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/login";

// Citizen pages
import CitizenDashboard from "./pages/citizen/citizendashboard";
import DelhiUpdates from "./pages/citizen/updates";
import AreaConditions from "./pages/citizen/areaconditions";
import ReportEmergency from "./pages/citizen/report";
import TrackReports from "./pages/citizen/trackreports";
import ReportSuccess from "./pages/citizen/reportsuccess";

// Officer pages
import OfficerDashboard from "./pages/officer/officerdashboard";
import IncidentManagement from "./pages/officer/incidentmanagement";
import CityMonitoring from "./pages/officer/citymonitoring";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
     
        {/* Citizen portal */}
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/updates" element={<DelhiUpdates />} />
        <Route path="/citizen/areas" element={<AreaConditions />} />
        <Route path="/citizen/report" element={<ReportEmergency />} />
        <Route path="/citizen/success/:id" element={<ReportSuccess />} />
        <Route path="/citizen/track" element={<TrackReports />} />
        <Route path="/officer" element={<OfficerDashboard />} />
        <Route path="/officer/incidents" element={<IncidentManagement />} />
        <Route path="/officer/monitoring" element={<CityMonitoring />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
