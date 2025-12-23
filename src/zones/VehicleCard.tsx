import { useState } from "react";
import { Car, Truck, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import type { Vehicle } from "../types";
import { timeUtils } from "../utils/timeUtils";
import { Button } from "../core/buttons/Button";
import styles from "./VehicleCard.module.css";

interface VehicleCardProps {
  vehicle: Vehicle;
  onIssueWarning: (vehicleId: string, notes?: string) => Promise<void>;
  onIssueCitation: (vehicleId: string, notes?: string) => Promise<void>;
}

export function VehicleCard({
  vehicle,
  onIssueWarning,
  onIssueCitation,
}: VehicleCardProps) {
  const [isLoading, setIsLoading] = useState<"warning" | "citation" | null>(
    null
  );
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  const parkedMinutes = timeUtils.getMinutesSince(vehicle.arrivalTime);
  const overstayMinutes = timeUtils.getOverstayMinutes(
    vehicle.arrivalTime,
    vehicle.timeLimit
  );

  const getVehicleIcon = () => {
    switch (vehicle.type) {
      case "truck":
      case "van":
        return <Truck size={16} />;
      default:
        return <Car size={16} />;
    }
  };

  const getStatus = () => {
    if (vehicle.warningIssued) {
      return { label: "Warned", className: "warned" };
    }
    if (vehicle.isOverstay) {
      return { label: "Overstay", className: "overstay" };
    }
    return { label: "OK", className: "ok" };
  };

  const status = getStatus();

  const handleAction = async (action: "warning" | "citation") => {
    setIsLoading(action);
    try {
      if (action === "warning") {
        await onIssueWarning(vehicle.id, notes || undefined);
      } else {
        await onIssueCitation(vehicle.id, notes || undefined);
      }
      setNotes("");
      setShowNotes(false);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div
      className={`${styles.card} ${vehicle.isOverstay ? styles.overstay : ""} ${
        vehicle.warningIssued ? styles.warningIssued : ""
      }`}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <div className={styles.plate}>{vehicle.licensePlate}</div>
            <div className={styles.type}>
              {getVehicleIcon()} {vehicle.type}
            </div>
          </div>
          <span className={`${styles.status} ${styles[status.className]}`}>
            {status.className === "overstay" && <AlertTriangle size={12} />}
            {status.className === "ok" && <CheckCircle size={12} />}
            {status.label}
          </span>
        </div>

        <div className={styles.time}>
          <Clock size={16} />
          <span>
            Arrived {timeUtils.formatTime(vehicle.arrivalTime)} • Parked{" "}
            {timeUtils.formatDuration(parkedMinutes)}
            {vehicle.isOverstay && (
              <span className="text-danger">
                {" "}
                • Over by {timeUtils.formatDuration(overstayMinutes)}
              </span>
            )}
          </span>
        </div>

        {vehicle.isOverstay && (
          <div className={styles.actions}>
            {!vehicle.warningIssued ? (
              <>
                <Button
                  variant="warning"
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowNotes(!showNotes)}
                  disabled={isLoading !== null}
                >
                  Issue Warning
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAction("citation")}
                  disabled={isLoading !== null}
                >
                  {isLoading === "citation" ? "Issuing..." : "Issue Citation"}
                </Button>
              </>
            ) : (
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => handleAction("citation")}
                disabled={isLoading !== null}
              >
                {isLoading === "citation" ? "Issuing..." : "Issue Citation"}
              </Button>
            )}
          </div>
        )}

        {showNotes && !vehicle.warningIssued && (
          <div className="mt-md">
            <textarea
              className={styles.formTextarea}
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
            <div className="flex gap-sm mt-md">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setShowNotes(false)}
              >
                Cancel
              </Button>
              <Button
                variant="warning"
                size="sm"
                className="flex-1"
                onClick={() => handleAction("warning")}
                disabled={isLoading !== null}
              >
                {isLoading === "warning" ? "Issuing..." : "Confirm Warning"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
