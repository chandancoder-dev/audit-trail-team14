# Audit Trail — Detailed Project Plan

## Team: 6 Members | Duration: 4 Weeks + Reviews

---

## Team Role Assignment

| # | Role | Responsibility |
|---|------|----------------|
| Member 1 | Backend Lead | CQRS architecture, command routes, validation |
| Member 2 | Event Store Engineer | MongoDB event schema, append-only logic, immutability |
| Member 3 | Projections & Queries | Read models, state reconstruction, query API |
| Member 4 | Frontend Lead | Dashboard, layout, routing, Tailwind, search |
| Member 5 | Timeline & Visualization | Event timeline, Recharts, time slider |
| Member 6 | Integration & Testing | API integration, seed data, testing, documentation |

---

## API Design

### Command Routes (Write Side)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/commands/shipment/create` | Create a new shipment/container |
| POST | `/api/commands/shipment/:id/move` | Record shipment movement |
| POST | `/api/commands/shipment/:id/temperature` | Record temperature event |
| POST | `/api/commands/shipment/:id/arrive` | Record port arrival |

### Query Routes (Read Side)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queries/shipments` | List all shipments (paginated) |
| GET | `/api/queries/shipment/:id` | Get current shipment state |
| GET | `/api/queries/shipment/:id/events` | Get raw event list |
| GET | `/api/queries/shipment/:id/timeline` | Get formatted timeline |
| GET | `/api/queries/shipment/:id/state?date=` | Get state at a point in time |
| GET | `/api/queries/shipment/:id/analytics` | Get temperature & event analytics |

---

## Event Schema (MongoDB)

```javascript
{
  aggregateId: String,       // "SHIP-4521"
  eventType: String,         // "CONTAINER_CREATED" | "LOADED_ON_SHIP" | "TEMPERATURE_SPIKE" | "ARRIVED_AT_PORT"
  payload: {
    // Varies per event type
    location: String,
    temperature: Number,
    threshold: Number,
    vessel: String,
    port: String,
    notes: String
  },
  version: Number,           // Auto-incremented per aggregate (1, 2, 3...)
  timestamp: Date,           // Immutable event time
  metadata: {
    userId: String,
    correlationId: String,
    source: String
  }
}
```

## Read Model Schema (Projection)

```javascript
{
  shipmentId: String,        // Same as aggregateId
  status: String,            // "created" | "in_transit" | "arrived" | "alert"
  currentLocation: String,
  origin: String,
  destination: String,
  lastTemperature: Number,
  eventCount: Number,
  lastEventAt: Date,
  createdAt: Date,
  lastVersion: Number        // For OCC checks
}
```

---

## Frontend Pages & Components

### Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Search, summary stats, recent shipments |
| Shipment Detail | `/shipment/:id` | Full shipment info with timeline |
| Historical State | `/shipment/:id/history` | Time slider with state reconstruction |
| Analytics | `/shipment/:id/analytics` | Temperature charts with event markers |
| Not Found | `*` | 404 page |

### Shared Components
| Component | Usage |
|-----------|-------|
| Navbar | All pages |
| SearchBar | Dashboard, can be reused |
| Loader/Skeleton | All pages during data fetch |
| ErrorState | When API calls fail |
| EmptyState | When no data exists |
| StatusBadge | Shipment status indicator |

### Feature Components
| Component | Page | Description |
|-----------|------|-------------|
| ShipmentSummary | Dashboard | Key stats for a shipment |
| RecentShipments | Dashboard | List of recent/available shipments |
| EventTimeline | Shipment Detail | Vertical timeline of events |
| EventCard | Shipment Detail | Single event in timeline |
| TimeSlider | Historical State | Drag to select point in time |
| ReconstructedState | Historical State | State display for selected time |
| TemperatureChart | Analytics | Recharts line chart |
| EventMarkers | Analytics | Overlay events on chart |

---

## Week-by-Week Detailed Plan

---

### WEEK 1 — CQRS Setup + Dashboard Scaffolding

**Goal:** Backend accepts commands and queries. Frontend shows a working dashboard with search.

#### Backend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Create CQRS folder structure | Member 1 | `commands/routes`, `commands/handlers`, `commands/validators`, `queries/routes`, `queries/handlers` |
| Set up command router | Member 1 | Mount at `/api/commands`, define POST routes with placeholder handlers |
| Set up query router | Member 3 | Mount at `/api/queries`, define GET routes with placeholder handlers |
| Design Event model | Member 2 | Mongoose schema with indexes on `aggregateId` and `timestamp` |
| MongoDB connection | Member 2 | `config/db.js` with error handling and retry logic |
| Define event type constants | Member 2 | `eventTypes.js` — CONTAINER_CREATED, LOADED_ON_SHIP, TEMPERATURE_SPIKE, ARRIVED_AT_PORT |
| Input validation setup | Member 1 | Install Joi/Zod, create validators for create & move commands |
| Health check & error middleware | Member 6 | Global error handler, async wrapper, health endpoint |

#### Frontend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Install & configure Tailwind CSS | Member 4 | Tailwind + PostCSS setup in Vite |
| Set up React Router | Member 4 | Routes for Dashboard, ShipmentDetail, History, Analytics, 404 |
| Build Navbar | Member 4 | Logo, navigation links, responsive |
| Build SearchBar component | Member 4 | Input + button, calls onSearch prop |
| Build Dashboard page layout | Member 4 | Grid layout with search, summary area, recent shipments area |
| Set up Axios API service | Member 6 | `services/api.js` — base URL, interceptors, error handling |
| Build Loader/Skeleton component | Member 5 | Reusable loading state |
| Build static EventTimeline mockup | Member 5 | Hardcoded events to establish the visual design |

#### Week 1 Deliverables
- [ ] Backend responds to all command/query routes (200 with placeholder data)
- [ ] Frontend dashboard renders with search bar and navigation
- [ ] API service layer configured and tested against health endpoint

---

### WEEK 2 — Event Store + Timeline UI

**Goal:** Events are persisted. Frontend shows real event timelines.

#### Backend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Implement `eventStore.js` | Member 2 | `append(event)` — validates, increments version, saves |
| Implement `getEventsByAggregate(id)` | Member 2 | Returns events sorted by version |
| Implement `getEventsByType(type)` | Member 2 | Filter by event type |
| Implement `shipment/create` handler | Member 1 | Validates input → creates CONTAINER_CREATED event → appends |
| Implement `shipment/:id/move` handler | Member 1 | Validates → creates LOADED_ON_SHIP event → appends |
| Implement `shipment/:id/temperature` handler | Member 1 | Validates → creates TEMPERATURE_SPIKE event → appends |
| Implement `shipment/:id/arrive` handler | Member 1 | Validates → creates ARRIVED_AT_PORT event → appends |
| State reconstruction logic | Member 3 | `reconstructState(events)` — folds events into current state |
| Implement `GET /shipment/:id` | Member 3 | Fetch events → reconstruct → return current state |
| Implement `GET /shipment/:id/events` | Member 3 | Return raw event list with pagination |
| Create seed data script | Member 6 | Generate 5-10 shipments with varied event histories |

#### Frontend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Build ShipmentDetail page | Member 4 | Layout for shipment info + timeline section |
| Build CurrentState display | Member 4 | Show status, location, last update |
| Build StatusBadge component | Member 4 | Color-coded status indicator |
| Connect EventTimeline to API | Member 5 | Fetch real events, render dynamically |
| Build EventCard component | Member 5 | Event type icon, timestamp, payload details |
| Style timeline with Tailwind | Member 5 | Vertical line, dots, cards, responsive |
| Build RecentShipments on dashboard | Member 4 | Fetch and list available shipments |
| Connect search to API | Member 6 | Search → navigate to ShipmentDetail page |

#### Week 2 Deliverables
- [ ] Creating a shipment and adding events works end-to-end
- [ ] `GET /shipment/:id` returns reconstructed state from events
- [ ] Frontend timeline renders real event data for any shipment
- [ ] Seed data provides realistic test scenarios

---

### MID-PROJECT REVIEW — Immutability + State Reconstruction

#### Checklist to Prove

| # | Requirement | How to Prove | Owner |
|---|-------------|--------------|-------|
| 1 | No UPDATE on Event Store | Attempt `db.events.updateOne()` → rejected | Member 2 |
| 2 | No DELETE on Event Store | Attempt `db.events.deleteOne()` → rejected | Member 2 |
| 3 | State is reconstructed, not stored | Show no "currentState" field in events collection | Member 3 |
| 4 | Events are append-only | Show version auto-increments, no gaps | Member 2 |
| 5 | Timeline is chronological | UI shows events in correct order | Member 5 |
| 6 | CQRS separation is clear | Command and query routes are in separate files/routers | Member 1 |

#### Tasks for Review Prep

| Task | Owner | Details |
|------|-------|---------|
| Build `immutabilityGuard.js` middleware | Member 2 | Intercepts MongoDB operations, rejects update/delete on events |
| Write proof-of-immutability test | Member 6 | Script that attempts mutations and logs rejections |
| Document architecture decisions | Member 6 | Brief ADR (Architecture Decision Record) |

---

### WEEK 3 — Read Models (Projections) + Time Travel

**Goal:** Fast reads via projections. Users can rewind shipment state to any point in time.

#### Backend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Design ShipmentView read model | Member 3 | Optimized schema for fast dashboard queries |
| Build projection builder | Member 3 | On new event → update read model |
| Build projection worker | Member 3 | Background process that catches up on missed events |
| Switch `GET /shipments` to read model | Member 3 | Fast paginated list from projection |
| Implement `GET /shipment/:id/state?date=` | Member 3 | Replay events up to given timestamp → return state |
| Add pagination to list endpoints | Member 1 | `?page=1&limit=10` with total count |
| Performance benchmarks | Member 6 | Compare replay-every-time vs read-model query speed |

#### Frontend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Build Historical State page | Member 5 | Layout with slider + state display |
| Build TimeSlider component | Member 5 | Range input or custom slider, snaps to event timestamps |
| Build ReconstructedState display | Member 5 | Shows shipment state at selected time |
| Connect slider to `state?date=` API | Member 5 | On slide → fetch → display |
| Add filters to shipment list | Member 4 | Filter by status, search by ID/location |
| Add pagination UI | Member 4 | Page numbers or infinite scroll |
| Error & empty states | Member 4 | Handle no results, API errors gracefully |
| Loading skeletons | Member 6 | Skeleton placeholders for all data areas |

#### Week 3 Deliverables
- [ ] Dashboard loads shipments from read model (fast)
- [ ] Time slider reconstructs shipment state at any past point
- [ ] Pagination works on list and event endpoints
- [ ] Performance improvement documented (read model vs replay)

---

### WEEK 4 — Concurrency Control + Recharts Analytics

**Goal:** System handles concurrent edits safely. Full analytics visualization.

#### Backend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Implement OCC in command handlers | Member 1 | Accept `expectedVersion` in command → reject if stale |
| Version conflict error response | Member 1 | Return 409 with current version info |
| Add metadata to events | Member 2 | `userId`, `correlationId` on every event |
| Implement `GET /shipment/:id/analytics` | Member 3 | Aggregate temperature data, event frequency |
| Dashboard summary endpoint | Member 3 | Total shipments, events today, alerts count |
| Concurrency conflict test | Member 6 | Simulate two users updating same shipment |

#### Frontend Tasks

| Task | Owner | Details |
|------|-------|---------|
| Build Analytics page | Member 5 | Layout for charts + event markers |
| Temperature line chart (Recharts) | Member 5 | X: time, Y: temperature, with threshold line |
| Event markers on chart | Member 5 | Vertical lines or dots at event timestamps |
| Event frequency chart | Member 5 | Bar chart — events per day |
| Handle 409 conflict on frontend | Member 4 | Show "data has changed" message, offer refresh |
| Responsive design polish | Member 4 | Mobile-friendly layout for all pages |
| Accessibility audit | Member 4 | Keyboard navigation, ARIA labels, contrast |
| Final integration testing | Member 6 | Full user flow testing |
| Update README & documentation | Member 6 | Setup guide, API docs, architecture diagram |

#### Week 4 Deliverables
- [ ] OCC rejects stale commands with proper error handling
- [ ] Temperature chart visualizes sensor data with event correlation
- [ ] UI is responsive and accessible
- [ ] Project is fully documented and demo-ready

---

### FINAL REVIEW — Complete Audit Trail

#### Demo Flow
1. Create a new shipment → show event appended
2. Add movement events → show timeline growing
3. Trigger temperature spike → show alert on timeline
4. Arrive at port → show final state
5. Attempt to UPDATE/DELETE an event → show rejection (immutability proof)
6. Use time slider → show reconstructed past state
7. View analytics → show temperature chart with event markers
8. Simulate concurrent edit → show OCC conflict handling

#### Final Checklist
- [ ] Event Store is truly append-only (no mutations possible)
- [ ] State is always reconstructed from events, never stored directly
- [ ] CQRS separation is clear and enforced
- [ ] Read models provide fast query performance
- [ ] Time travel reconstruction works accurately
- [ ] Concurrency control prevents data conflicts
- [ ] Dashboard provides complete forensic visibility
- [ ] Code is documented and deployable

---

## Git Workflow

```
main ← PR from sumit (release only)
  └── sumit ← PRs from feature branches
        ├── member1/cqrs-setup
        ├── member2/event-store
        ├── member3/projections
        ├── member4/dashboard-ui
        ├── member5/timeline-charts
        └── member6/integration-tests
```

### Branch Naming Convention
- `feature/short-description` — new features
- `fix/short-description` — bug fixes
- `docs/short-description` — documentation

### PR Rules
- Every PR needs at least 1 review
- Must pass any lint/test checks
- Squash merge to keep history clean

---

## Daily Standup (15 min)

Each member answers:
1. What did I complete yesterday?
2. What am I working on today?
3. Am I blocked on anything?

## End-of-Week Demo
- Each member demos their working feature
- Identify integration issues early
- Plan next week's priorities
