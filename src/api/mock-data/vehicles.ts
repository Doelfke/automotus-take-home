import type { Vehicle } from "../../types";

// Mock vehicles data
export const mockVehicles: Vehicle[] = [
  // Zone 001 vehicles
  {
    id: "veh-001",
    zoneId: "zone-001",
    licensePlate: "ABC 1234",
    type: "car",
    arrivalTime: new Date(Date.now() - 150 * 60 * 1000).toISOString(), // 2.5 hours ago
    timeLimit: 120,
    isOverstay: true,
    warningIssued: false,
  },
  {
    id: "veh-002",
    zoneId: "zone-001",
    licensePlate: "XYZ 5678",
    type: "truck",
    arrivalTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(), // 3 hours ago
    timeLimit: 60,
    isOverstay: true,
    warningIssued: true,
  },
  {
    id: "veh-003",
    zoneId: "zone-001",
    licensePlate: "DEF 9012",
    type: "car",
    arrivalTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
    timeLimit: 120,
    isOverstay: false,
    warningIssued: false,
  },
  // Zone 002 vehicles
  {
    id: "veh-004",
    zoneId: "zone-002",
    licensePlate: "GHI 3456",
    type: "motorcycle",
    arrivalTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 1.5 hours ago
    timeLimit: 60,
    isOverstay: true,
    warningIssued: false,
  },
  // Zone 003 vehicles
  {
    id: "veh-005",
    zoneId: "zone-003",
    licensePlate: "JKL 7890",
    type: "van",
    arrivalTime: new Date(Date.now() - 200 * 60 * 1000).toISOString(), // 3+ hours ago
    timeLimit: 60,
    isOverstay: true,
    warningIssued: true,
  },
  {
    id: "veh-006",
    zoneId: "zone-003",
    licensePlate: "MNO 2345",
    type: "car",
    arrivalTime: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    timeLimit: 120,
    isOverstay: true,
    warningIssued: false,
  },
  {
    id: "veh-007",
    zoneId: "zone-003",
    licensePlate: "PQR 6789",
    type: "car",
    arrivalTime: new Date(Date.now() - 140 * 60 * 1000).toISOString(),
    timeLimit: 120,
    isOverstay: true,
    warningIssued: false,
  },
  {
    id: "veh-008",
    zoneId: "zone-003",
    licensePlate: "STU 0123",
    type: "truck",
    arrivalTime: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    timeLimit: 60,
    isOverstay: true,
    warningIssued: false,
  },
  {
    id: "veh-009",
    zoneId: "zone-003",
    licensePlate: "VWX 4567",
    type: "car",
    arrivalTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    timeLimit: 120,
    isOverstay: false,
    warningIssued: false,
  },
  // Zone 005 vehicles
  {
    id: "veh-010",
    zoneId: "zone-005",
    licensePlate: "YZA 8901",
    type: "car",
    arrivalTime: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    timeLimit: 180,
    isOverstay: true,
    warningIssued: false,
  },
  {
    id: "veh-011",
    zoneId: "zone-005",
    licensePlate: "BCD 2345",
    type: "van",
    arrivalTime: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
    timeLimit: 180,
    isOverstay: true,
    warningIssued: true,
  },
];
