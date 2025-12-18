import type { Zone } from "../../types";

// Mock zones data
export const mockZones: Zone[] = [
  {
    id: "zone-001",
    name: "Downtown Main St",
    location: "100-200 Main Street",
    currentOccupancy: 18,
    maxCapacity: 20,
    violationCount: 3,
    priority: "high",
    lastChecked: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "zone-002",
    name: "City Hall Plaza",
    location: "50 Government Way",
    currentOccupancy: 12,
    maxCapacity: 30,
    violationCount: 1,
    priority: "medium",
    lastChecked: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
  },
  {
    id: "zone-003",
    name: "Market District",
    location: "300-400 Market Ave",
    currentOccupancy: 25,
    maxCapacity: 25,
    violationCount: 5,
    priority: "high",
    lastChecked: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
  },
  {
    id: "zone-004",
    name: "University Lot A",
    location: "1000 Campus Drive",
    currentOccupancy: 45,
    maxCapacity: 100,
    violationCount: 0,
    priority: "low",
    lastChecked: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
  },
  {
    id: "zone-005",
    name: "Shopping Center",
    location: "500 Retail Blvd",
    currentOccupancy: 78,
    maxCapacity: 80,
    violationCount: 2,
    priority: "medium",
    lastChecked: null, // Never checked today
  },
  {
    id: "zone-006",
    name: "Train Station",
    location: "1 Transit Center",
    currentOccupancy: 0,
    maxCapacity: 50,
    violationCount: 0,
    priority: "low",
    lastChecked: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
];
