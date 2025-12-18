import type { Alert } from "../../types";

// Mock alerts data
export const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    zoneId: "zone-001",
    vehicleId: "veh-002",
    severity: "critical",
    message: "Vehicle XYZ 5678 exceeded time limit by 2+ hours",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-002",
    zoneId: "zone-003",
    vehicleId: "veh-005",
    severity: "critical",
    message: "Repeat offender detected: JKL 7890",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-003",
    zoneId: "zone-003",
    vehicleId: null,
    severity: "warning",
    message: "Zone at 100% capacity",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-004",
    zoneId: "zone-005",
    vehicleId: null,
    severity: "warning",
    message: "Zone approaching capacity (98%)",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "alert-005",
    zoneId: "zone-001",
    vehicleId: "veh-001",
    severity: "warning",
    message: "Vehicle ABC 1234 overstayed by 30 minutes",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
];
