import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";
import { MapPin, Bell, ClipboardList } from "lucide-react";
import { ZonesPage } from "./pages/ZonesPage";
import { ZoneDetailPage } from "./pages/ZoneDetailPage";
import { AlertsPage } from "./pages/AlertsPage";
import { ActivityPage } from "./pages/ActivityPage";
import { Toast } from "./components/Toast";
import { useOfficer, useAlerts } from "./hooks/useQueries";
import { useEffect } from "react";
import "./styles/global.css";
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
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>ParkPatrol</h1>
            <p className={styles.headerSubtitle}>
              {officer.name} • #{officer.badgeNumber}
            </p>
          </div>
        </div>
      </header>

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
      <nav className={styles.bottomNav}>
        <NavLink
          to="/zones"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <MapPin size={24} />
          <span>Zones</span>
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <div className={styles.navIconWrapper}>
            <Bell size={24} />
            {alertCount > 0 && (
              <span className={styles.navBadge}>{alertCount}</span>
            )}
          </div>
          <span>Alerts</span>
        </NavLink>
        <NavLink
          to="/activity"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <ClipboardList size={24} />
          <span>Activity</span>
        </NavLink>
      </nav>

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
