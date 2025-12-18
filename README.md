# ParkPatrol - Parking Enforcement Officer Companion App

A mobile-first prototype application designed to help parking enforcement officers modernize their workflow. Officers can see which zones need attention, understand what's happening at each zone, and log their patrol activity.

## 🚀 Quick Start

```bash

# Install dependencies

npm install

# Start development server

npm run dev

# Open in browser (mobile viewport recommended)

http://localhost:3000

```

## 📱 Demo Instructions

1. **Zones Tab**: View all patrol zones sorted by priority. High-priority zones with violations appear first.
2. **Zone Detail**: Tap any zone to see parked vehicles and active alerts.
3. **Issue Actions**: For overstaying vehicles, you can issue warnings or citations.
4. **Mark Visited**: Use the "Mark Zone as Visited" button to log patrol activity.
5. **Alerts Tab**: View and acknowledge alerts sorted by severity.
6. **Activity Tab**: Review your patrol history.

### Triggering Error States for Demo

**Toggle Switch**: On the Zones page, use the "Demo: Toggle errors" switch at the top

When enabled, API calls have a 50% chance of failing with realistic network error messages.

## 🛠 Tech Stack

| Technology          | Rationale                                                             |
| ------------------- | --------------------------------------------------------------------- |
| **React 18**        | Modern component model, great ecosystem, team likely familiar         |
| **TypeScript**      | Type safety catches bugs early, better DX with autocomplete           |
| **Vite**            | Fast dev server, quick HMR, simple configuration                      |
| **React Router v6** | De facto standard for React routing, handles mobile nav patterns well |
| **Lucide React**    | Lightweight, consistent icons that work well at various sizes         |

### Why Not...?

- **Next.js**: Overkill for a client-side prototype; adds complexity we don't need
- **State Management Library**: React's useState + lifting state is sufficient at this scale
- **Component Library**: Custom CSS gives full control over mobile UX patterns
- **CSS-in-JS**: Adds bundle size and complexity; vanilla CSS is simpler to understand. It increases re-renders and isn't compatible with SSR, if we ever need to go that route.

## 📡 API Documentation

The mock API simulates realistic backend behavior with:

- Network latency (300-800ms random delay)
- Optional error simulation for demo purposes
- In-memory state that persists during session

### Endpoints

#### Zones

| Endpoint             | Method | Description                        |
| -------------------- | ------ | ---------------------------------- |
| \/zones              | GET    | List all zones, sorted by priority |
| \/zones/:id          | GET    | Get single zone details            |
| \/zones/:id/vehicles | GET    | Get vehicles in a zone             |
| \/zones/:id/visit    | POST   | Record zone visit                  |

**GET /zones Response:**

```typescript
Zone[]

interface Zone {
id: string;
name: string;
location: string;
currentOccupancy: number;
maxCapacity: number;
violationCount: number;
priority: 'high' | 'medium' | 'low';
lastChecked: string | null; // ISO timestamp
}
```

**GET /zones/:id/vehicles Response:**

```typescript
Vehicle[]

interface Vehicle {
id: string;
zoneId: string;
licensePlate: string;
type: 'car' | 'truck' | 'motorcycle' | 'van';
arrivalTime: string; // ISO timestamp
timeLimit: number; // minutes
isOverstay: boolean;
warningIssued: boolean;
}
```

#### Alerts

| Endpoint                | Method | Description                            |
| ----------------------- | ------ | -------------------------------------- |
| /alerts                 | GET    | Get all active (unacknowledged) alerts |
| /alerts/zone/:zoneId    | GET    | Get alerts for specific zone           |
| /alerts/:id/acknowledge | POST   | Acknowledge an alert                   |

**GET /alerts Response:**

```typescript
Alert[]

interface Alert {
id: string;
zoneId: string;
vehicleId: string | null;
severity: 'critical' | 'warning' | 'info';
message: string;
timestamp: string; // ISO timestamp
acknowledged: boolean;
}

```

#### Activity

| Endpoint  | Method | Description                 |
| --------- | ------ | --------------------------- |
| /activity | GET    | Get officer's activity logs |
| /activity | POST   | Log new activity            |

**GET /activity Response:**

```typescript
ActivityLog[]

interface ActivityLog {
id: string;
officerId: string;
action: 'zone_visited' | 'warning_issued' | 'citation_issued' | 'note_added' | 'alert_acknowledged';
zoneId: string | null;
vehicleId: string | null;
timestamp: string; // ISO timestamp
notes: string | null;
}
```

#### Vehicles

| Endpoint               | Method | Description               |
| ---------------------- | ------ | ------------------------- |
| /vehicles/:id/warning  | POST   | Issue warning to vehicle  |
| /vehicles/:id/citation | POST   | Issue citation to vehicle |

**POST /vehicles/:id/warning Request:**

```typescript
{
notes?: string;
}
```

**Response:**

```typescript
{
  vehicle: Vehicle;
  log: ActivityLog;
}
```

## 🎨 Design Decisions

### Mobile-First Approach

- 375px minimum viewport width
- Touch-friendly tap targets (minimum 44px)
- Bottom navigation for thumb-zone accessibility
- Safe area support for notched devices
- Scannable at a glance while walking/driving

### State Handling

- **Loading**: Skeleton cards preserve layout, contextual spinners
- **Error**: Friendly messages with retry buttons
- **Empty**: Helpful messages ("All caught up not "No data")

## Summary

### What I Prioritized and Why

I focused on three core features that map directly to the prompt's officer needs:

1. **Zone Overview with Priority Sorting** - Officers need to quickly know "where should I go next?" Zones are sorted by priority and violation count, with visual indicators for urgency. The "last checked" timestamp helps officers avoid re-visiting zones unnecessarily.

2. **Zone Detail with Vehicle Actions** - Once at a zone, officers need to see which vehicles are problematic and take action. Overstaying vehicles appear first, and issuing warnings/citations is 1-2 taps away.

3. **Activity Logging** - Officers need accountability and records. Every action (zone visit, warning, citation) is logged automatically, and they can review their shift activity.

4. **Module Folders** - alerts, activity, zones, etc show how we can scale the application from a folder structure perspective, making it easy for developers to easily find the code they are looking to edit.

### What I Cut and Why

- **Map/GPS Integration**: Would require significant additional work and external APIs. The zone list with location text is sufficient for a prototype.
- **Real-time Updates**: Polling every 30s for alerts is good enough; WebSockets would add complexity.
- **Offline Support**: Important for production but adds significant complexity; assumes network connectivity for MVP.
- **Search/Filter**: With 6 zones, scrolling is fine. Would add for production with more zones.
- **Push Notifications**: Requires backend infrastructure and permissions flow.
- **Desktop Styling**: It was outside of the scope of this project, but the current design does work on desktop resolutions to a reasonable degree.
- **Styling** I assumed this project was more about things like architecture, so I let AI choose the styling for me. It's usable, but seemingly dated.

### Assumptions About User Needs

- Officers work from a prioritized list, not a map (though map would be nice-to-have)
- They need to act fast: big tap targets, minimal navigation depth
- They work outdoors in various lighting: high contrast, clear typography
- They may be walking/driving: scannable information hierarchy
- They need accountability: automatic logging of all actions
- Network connectivity is available (reasonable for urban enforcement)

### API Design Approach

The API is designed around user tasks, not data models:

- \`fetchZones()\` returns zones pre-sorted by priority
- \`fetchVehiclesByZone()\` returns vehicles sorted by violation status
- Actions like \`issueWarning()\` handle multiple operations (update vehicle, create log)

Tradeoffs:

- **Denormalized responses**: Zone includes violation count rather than requiring a separate query. Simpler for the client, but requires backend to maintain counts.
- **Implicit officer context**: Current officer is assumed from session. Real system would use auth tokens.
- **Optimistic updates avoided**: I wait for API responses before updating UI. Safer but slightly slower UX.

### What I'd Build Next

1. **Pull-to-Refresh**: Natural mobile pattern for refreshing zone/alert lists
2. **Vehicle Search**: Search by license plate across all zones for dispatch scenarios
3. **Shift Summary**: End-of-shift report with statistics
4. **Zone Navigation**: Deep link to maps app for directions
5. **Photo Capture**: Attach photos to citations for evidence
