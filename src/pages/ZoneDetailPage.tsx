import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Car, CheckCircle } from "lucide-react";
import { VehicleCard } from "../components/VehicleCard";
import { AlertCard } from "../components/AlertCard";
import { VehicleCardSkeleton } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { EmptyState } from "../components/EmptyState";
import { showToast } from "../components/Toast";
import {
  useZone,
  useVehicles,
  useZoneAlerts,
  useVisitZone,
  useIssueWarning,
  useIssueCitation,
  useAcknowledgeAlert,
} from "../hooks/useQueries";
import pageStyles from "./Page.module.css";
import styles from "./ZoneDetailPage.module.css";
import buttonStyles from "../styles/Button.module.css";

type TabType = "vehicles" | "alerts";

export function ZoneDetailPage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("vehicles");

  // React Query hooks
  const {
    data: zone,
    isLoading: zoneLoading,
    error: zoneError,
    refetch: refetchZone,
  } = useZone(zoneId!);
  const { data: vehicles = [], isLoading: vehiclesLoading } = useVehicles(
    zoneId!
  );
  const { data: alerts = [], isLoading: alertsLoading } = useZoneAlerts(
    zoneId!
  );

  // Mutations
  const visitZoneMutation = useVisitZone();
  const issueWarningMutation = useIssueWarning();
  const issueCitationMutation = useIssueCitation();
  const acknowledgeAlertMutation = useAcknowledgeAlert();

  const isLoading = zoneLoading || vehiclesLoading || alertsLoading;
  const error = zoneError;

  const handleMarkVisit = async () => {
    if (!zoneId) return;

    try {
      await visitZoneMutation.mutateAsync({ zoneId });
      showToast("Zone visit logged", "success");
    } catch (err) {
      showToast("Failed to log visit", "error");
    }
  };

  const handleIssueWarning = async (vehicleId: string, notes?: string) => {
    try {
      await issueWarningMutation.mutateAsync({ vehicleId, notes });
      showToast("Warning issued successfully", "success");
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : "Failed to issue warning",
        "error"
      );
      throw err;
    }
  };

  const handleIssueCitation = async (vehicleId: string, notes?: string) => {
    try {
      await issueCitationMutation.mutateAsync({ vehicleId, notes });
      showToast("Citation issued successfully", "success");
    } catch (err) {
      showToast("Failed to issue citation", "error");
      throw err;
    }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      await acknowledgeAlertMutation.mutateAsync(alertId);
      showToast("Alert acknowledged", "success");
    } catch (err) {
      showToast("Failed to acknowledge alert", "error");
      throw err;
    }
  };

  const overstayVehicles = vehicles.filter((v) => v.isOverstay);
  const okVehicles = vehicles.filter((v) => !v.isOverstay);

  if (isLoading) {
    return (
      <div className={pageStyles.page}>
        <div style={{ marginBottom: "16px" }}>
          <button
            className={pageStyles.headerBack}
            onClick={() => navigate("/zones")}
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <VehicleCardSkeleton />
        <VehicleCardSkeleton />
        <VehicleCardSkeleton />
      </div>
    );
  }

  if (error || !zone) {
    return (
      <div className={pageStyles.page}>
        <div style={{ marginBottom: "16px" }}>
          <button
            className={pageStyles.headerBack}
            onClick={() => navigate("/zones")}
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
        <ErrorState
          message={
            error instanceof Error ? error.message : error || "Zone not found"
          }
          onRetry={() => refetchZone()}
        />
      </div>
    );
  }

  return (
    <div className={pageStyles.page}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <button
          className={pageStyles.headerBack}
          onClick={() => navigate("/zones")}
        >
          <ArrowLeft size={20} />
          Back to Zones
        </button>
      </div>

      {/* Zone Info */}
      <div className={styles.zoneDetailHeader}>
        <h1 className={pageStyles.pageTitle} style={{ marginBottom: "4px" }}>
          {zone.name}
        </h1>
        <p style={{ color: "var(--color-gray-500)", fontSize: "14px" }}>
          <MapPin size={14} style={{ display: "inline", marginRight: "4px" }} />
          {zone.location}
        </p>

        <div className={styles.zoneDetailStats}>
          <div className={styles.zoneDetailStat}>
            <div className={styles.zoneDetailStatValue}>
              {zone.currentOccupancy}
            </div>
            <div className={styles.zoneDetailStatLabel}>Parked</div>
          </div>
          <div className={styles.zoneDetailStat}>
            <div className={`${styles.zoneDetailStatValue} text-danger`}>
              {zone.violationCount}
            </div>
            <div className={styles.zoneDetailStatLabel}>Violations</div>
          </div>
          <div className={styles.zoneDetailStat}>
            <div className={styles.zoneDetailStatValue}>{zone.maxCapacity}</div>
            <div className={styles.zoneDetailStatLabel}>Capacity</div>
          </div>
        </div>

        <button
          className={`${buttonStyles.btn} ${buttonStyles.btnSuccess} ${buttonStyles.btnBlock} mt-md`}
          onClick={handleMarkVisit}
          disabled={visitZoneMutation.isPending}
        >
          <CheckCircle size={18} />
          {visitZoneMutation.isPending ? "Logging..." : "Mark Zone as Visited"}
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "vehicles" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("vehicles")}
        >
          Vehicles ({vehicles.length})
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "alerts" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("alerts")}
        >
          Alerts ({alerts.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "vehicles" ? (
        <>
          {vehicles.length === 0 ? (
            <EmptyState
              icon={<Car size={64} />}
              title="No vehicles"
              message="There are no vehicles currently parked in this zone."
            />
          ) : (
            <>
              {/* Overstay vehicles first */}
              {overstayVehicles.length > 0 && (
                <>
                  <div className={pageStyles.sectionHeader}>
                    <h2 className={pageStyles.sectionTitle}>Violations</h2>
                    <span className={pageStyles.sectionCount}>
                      {overstayVehicles.length}
                    </span>
                  </div>
                  {overstayVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onIssueWarning={handleIssueWarning}
                      onIssueCitation={handleIssueCitation}
                    />
                  ))}
                </>
              )}

              {/* OK vehicles */}
              {okVehicles.length > 0 && (
                <>
                  <div className={pageStyles.sectionHeader}>
                    <h2 className={pageStyles.sectionTitle}>Compliant</h2>
                    <span className={pageStyles.sectionCount}>
                      {okVehicles.length}
                    </span>
                  </div>
                  {okVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onIssueWarning={handleIssueWarning}
                      onIssueCitation={handleIssueCitation}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {alerts.length === 0 ? (
            <EmptyState
              icon={<CheckCircle size={64} />}
              title="No active alerts"
              message="All clear! No alerts require your attention in this zone."
            />
          ) : (
            alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                zoneName={zone.name}
                onAcknowledge={handleAcknowledgeAlert}
              />
            ))
          )}
        </>
      )}
    </div>
  );
}
