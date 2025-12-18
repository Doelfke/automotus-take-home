// Core data types for the parking enforcement app

export interface Zone {
  id: string;
  name: string;
  location: string;
  currentOccupancy: number;
  maxCapacity: number;
  violationCount: number;
  priority: 'high' | 'medium' | 'low';
  lastChecked: string | null;
}

export interface Vehicle {
  id: string;
  zoneId: string;
  licensePlate: string;
  type: 'car' | 'truck' | 'motorcycle' | 'van';
  arrivalTime: string;
  timeLimit: number; // minutes
  isOverstay: boolean;
  warningIssued: boolean;
}

export interface Alert {
  id: string;
  zoneId: string;
  vehicleId: string | null;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface ActivityLog {
  id: string;
  officerId: string;
  action: 'zone_visited' | 'warning_issued' | 'citation_issued' | 'note_added' | 'alert_acknowledged';
  zoneId: string | null;
  vehicleId: string | null;
  timestamp: string;
  notes: string | null;
}

export interface Officer {
  id: string;
  name: string;
  badgeNumber: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
