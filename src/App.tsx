import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MapPin, Bell, ClipboardList } from "lucide-react";
import { ZonesPage } from "./zones/ZonesPage";
import { ZoneDetailPage } from "./zones/ZoneDetailPage";
import { AlertsPage } from "./alerts/AlertsPage";
import { ActivityPage } from "./activity/ActivityPage";
import { Toast } from "./core/Toast";
import { Header } from "./core/layout/Header";
import { BottomNav, NavItem } from "./core/layout/BottomNav";
import { useOfficer, useAlerts } from "./api/useQueries";
import { useEffect } from "react";
import "./global.css";
import styles from "./App.module.css";

function AppContent() {
  const { data: officer } = useOfficer();
  const { data: alerts = [], refetch: refetchAlerts } = useAlerts();

  // Poll for alert count updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetchAlerts();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [refetchAlerts]);

  const alertCount = alerts.length;

  if (!officer) {
    return null; // or a loading spinner
  }

  return (
    <div className={styles.app}>
      {/* Header */}
      <Header
        title="ParkPatrol"
        subtitle={`${officer.name} • #${officer.badgeNumber}`}
      />

      {/* Main Content */}
      <main className={styles.appContent}>
        <Routes>
          <Route path="/" element={<Navigate to="/zones" replace />} />
          <Route path="/zones" element={<ZonesPage />} />
          <Route path="/zones/:zoneId" element={<ZoneDetailPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <BottomNav>
        <NavItem to="/zones" icon={<MapPin size={24} />} label="Zones" />
        <NavItem
          to="/alerts"
          icon={<Bell size={24} />}
          label="Alerts"
          badge={alertCount}
        />
        <NavItem
          to="/activity"
          icon={<ClipboardList size={24} />}
          label="Activity"
        />
      </BottomNav>

      {/* Toast notifications */}
      <Toast />
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
