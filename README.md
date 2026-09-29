# Audit Trail

Event-Sourced Inventory & Logistics Ledger built with the MERN stack.

## Problem Statement

In traditional MongoDB designs (CRUD), when you update a product's inventory from 10 to 5, the previous state (10) is overwritten and lost. In highly regulated industries (Logistics, Finance), overwriting data is unacceptable; you must maintain an immutable, chronological log of every event that led to the current state.

## Use Case

A logistics manager views the Audit Trail dashboard for a specific shipping container. Instead of querying MongoDB for the current location of the container, the Node.js backend reconstructs the container's state by replaying an append-only log of events (SHIPMENT_CREATED → LOADED_ON_SHIP → TEMPERATURE_SPIKE → ARRIVED_AT_PORT). If a dispute arises about when the temperature spiked, the manager can instantly view the immutable historical timeline, providing cryptographic proof of the event sequence.

## Tech Stack

### Frontend
- React 19 (Vite)
- Tailwind CSS 4
- React Router DOM 7
- Recharts (data visualization)
- Axios (API client)

### Backend
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- CQRS Architecture
- JWT Authentication (jsonwebtoken + bcrypt)

### Database
- MongoDB Atlas (Event Store + Read Models + Alerts)

### Dev Tools
- Nodemon
- Concurrently
- Dotenv
- Jest (testing)

## Project Structure

```
audit-trail-team14/
├── client/                          # React frontend (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuditTimeline.jsx    # Vertical event timeline + details modal
│   │   │   ├── ConflictDialog.jsx   # OCC 409 conflict modal
│   │   │   ├── DashboardNavbar.jsx  # Navbar shown on the dashboard
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventMetadataViewer.jsx
│   │   │   ├── EventPayloadViewer.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── features/
│   │   │   ├── analytics/
│   │   │   │   ├── AnalyticsOverview.jsx # Fleet-wide analytics (status, KPIs, events)
│   │   │   │   ├── AnalyticsPage.jsx     # Per-shipment temperature + lifecycle analytics
│   │   │   │   └── TemperatureChart.jsx  # Recharts line chart + event markers
│   │   │   ├── alerts/
│   │   │   │   ├── AlertsPage.jsx        # Live alerts with severity filters
│   │   │   │   └── AlertCard.jsx
│   │   │   └── shipmentDetail/
│   │   │       └── ShipmentDetail.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── HistoricalState.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx         # 404 catch-all page
│   │   │   ├── Register.jsx
│   │   │   └── ShipmentOperations.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + all API methods (M6)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── server.js                    # Entry point + MongoDB connection
│   ├── scripts/
│   │   ├── rebuildProjections.js    # Wipe + replay all projections
│   │   ├── benchmark.js             # Event-replay vs read-model benchmark
│   │   ├── seedDemo.js              # Seed demo accounts with realistic data
│   │   ├── proveImmutability.js     # Live proof the event store rejects mutations
│   │   └── setupAppendOnlyRole.js   # DB least-privilege role (append-only)
│   ├── src/
│   │   ├── app.js                   # Express app + route mounting + CORS
│   │   ├── analytics/
│   │   │   ├── analyticsService.js  # Temperature, fleet overview, insights
│   │   │   ├── analytics.controller.js
│   │   │   └── analytics.route.js
│   │   ├── alerts/
│   │   │   ├── Alert.js             # Alert Mongoose model
│   │   │   ├── alertService.js      # Auto-generate alerts on TEMPERATURE_SPIKE
│   │   │   ├── alerts.controller.js
│   │   │   └── alerts.route.js
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   └── auth.route.js
│   │   ├── commands/
│   │   │   ├── command.controller.js
│   │   │   └── command.route.js
│   │   ├── events/
│   │   │   ├── event.controller.js
│   │   │   ├── event.route.js
│   │   │   └── eventStore.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js
│   │   │   └── occ.middleware.js    # Optimistic concurrency control
│   │   ├── models/
│   │   │   ├── Event.js             # Append-only event schema
│   │   │   ├── User.js
│   │   │   └── plugins/
│   │   │       └── appendOnly.js    # Rejects update/delete/replace on events
│   │   ├── projections/
│   │   │   ├── ShipmentView.js      # CQRS read model
│   │   │   ├── projectionBuilder.js # Event handlers → ShipmentView
│   │   │   └── projectionWorker.js  # Background poll + catch-up + retry
│   │   └── queries/
│   │       ├── historicalState.service.js
│   │       ├── eventReducers.js
│   │       ├── shipmentQuery.controller.js
│   │       └── shipmentQuery.route.js
│   ├── tests/
│   │   ├── historicalState.test.js
│   │   ├── appendOnly.test.js       # Immutability guard unit tests
│   │   └── m6.integration.test.js   # Analytics, alerts, OCC, insights, overview
│   └── package.json
├── package.json
├── WORKPLAN.md
├── COMMIT_PLAN.md
└── README.md
```

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page |
| `/dashboard` | Dashboard | Shipment list, search, summary stats |
| `/shipment-operations` | ShipmentOperations | Create & manage shipment events |
| `/shipment/:id` | ShipmentDetail | Shipment state + lifecycle + event timeline |
| `/shipment/:id/analytics` | AnalyticsPage | Per-shipment temperature & lifecycle analytics |
| `/shipment/:id/alerts` | AlertsPage | Alerts for a specific shipment |
| `/analytics` | AnalyticsOverview | Fleet-wide analytics (status, KPIs, events) |
| `/alerts` | AlertsPage | Fleet-wide alert monitoring with severity filters |
| `/historicalstate?shipmentId=` | HistoricalState | Time-travel state reconstruction |
| `/audittimeline/:id` | AuditTimeline | Vertical event timeline |
| `/About` | About | About page |
| `/features` | Features | Features page |
| `/login` | Login | Authentication |
| `/register` | Register | Registration |
| `/forgot-password` | ForgotPassword | Password reset |
| `*` | NotFound | 404 catch-all |

## API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current authenticated user (password excluded) |
| POST | `/api/auth/reset-password` | Change password (requires `email`, `currentPassword`, `password`) |

### Command Routes (Write Side) — JWT required

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/commands/shipment/create` | Create a new shipment (SHIPMENT_CREATED event) |
| POST | `/api/commands/shipment/:id/move` | Record movement (LOADED_ON_SHIP event) |
| POST | `/api/commands/shipment/:id/temperature` | Record temperature (TEMPERATURE_SPIKE event) |
| POST | `/api/commands/shipment/:id/arrive` | Record arrival (ARRIVED_AT_PORT event) |

> All mutation commands accept an optional `expectedVersion` field in the request body for OCC (Optimistic Concurrency Control). Returns `409 Conflict` if the version is stale.

### Query Routes (Read Side)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queries/shipments` | List all shipments (paginated) — JWT required |
| GET | `/api/queries/shipment/:id` | Get current shipment state — JWT required |
| GET | `/api/queries/shipment/:id/events` | Get raw event list |
| GET | `/api/queries/shipment/:id/timeline` | Get event timeline (newest first) |
| GET | `/api/queries/shipment/:id/state?date=` | Reconstruct state at a point in time |
| GET | `/api/queries/shipment/:id/analytics` | Temperature time-series, stats, lifecycle insights, event markers |
| GET | `/api/queries/shipment/:id/alerts` | Alerts for a specific shipment |
| GET | `/api/queries/analytics/overview` | Fleet-wide overview: status distribution, totals, events by type |
| GET | `/api/queries/dashboard/summary` | Total shipments, events, alerts, avg temperature |
| GET | `/api/queries/alerts` | All alerts (paginated, filterable by severity/shipment) |

### Query Parameters — `/api/queries/alerts`

| Param | Type | Description |
|-------|------|-------------|
| `severity` | string | Filter by `critical`, `warning`, or `info` |
| `shipmentId` | string | Filter by shipment |
| `acknowledged` | boolean | Filter by acknowledgement status |
| `page` | number | Page number (default 1) |
| `limit` | number | Results per page (default 20, max 100) |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                   │
│  Dashboard │ Timeline │ Analytics │ Alerts │ History  │
└─────────────────────────┬───────────────────────────┘
                          │ Axios (JWT + OCC headers)
┌─────────────────────────┴───────────────────────────┐
│                 Backend (Express + CQRS)              │
│                                                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Auth   │  │   Commands   │  │    Queries   │   │
│  │  (JWT)   │  │ (Write Side) │  │ (Read Side)  │   │
│  └──────────┘  └──────┬───────┘  └──────┬───────┘   │
│                   OCC │                  │           │
│                 ┌─────▼────────┐  ┌──────▼────────┐  │
│                 │  Event Store │  │  Read Models  │  │
│                 │ (Append-Only)│  │(ShipmentView) │  │
│                 └──────┬───────┘  └───────────────┘  │
│                        │                             │
│              ┌─────────▼──────────┐                  │
│              │  Projection Builder │                  │
│              │  (background worker)│                  │
│              └─────────┬──────────┘                  │
│                        │                             │
│                 ┌──────▼───────┐                     │
│                 │    Alerts    │                     │
│                 │ (auto-generated│                   │
│                 │  on spike)   │                     │
│                 └──────────────┘                     │
└─────────────────────────────────────────────────────┘
```

## Getting Started

```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Run both client and server
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:8000

## Environment Variables

Create `server/.env`:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/audit-trail
PORT=8000
SECRET_KEY=your_jwt_secret_here
JWT_SECRET=your_jwt_secret_here
```

> Note: `SECRET_KEY` and `JWT_SECRET` must have the same value. Both are required — different parts of the codebase reference each.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client & server concurrently |
| `npm run client` | Run only the React app |
| `npm run server` | Run only the Express server |
| `cd server && npm test` | Run Jest integration tests |
| `cd server && npm run seed:demo` | Seed demo accounts with realistic data |
| `cd server && npm run audit:immutability` | Prove the event store rejects update/delete |
| `cd server && node scripts/rebuildProjections.js` | Wipe and rebuild all ShipmentView projections |
| `cd server && node scripts/benchmark.js` | Benchmark event-replay vs read-model query time |

## Testing

```bash
cd server
npm test
```

60 tests across 3 suites covering:
- Temperature analytics computation (timeSeries, stats, spikes, eventMarkers)
- Event frequency + event-type breakdown grouping and ordering
- Shipment insights (lifecycle milestones, transit durations, cold-chain compliance)
- Fleet overview aggregation (status distribution, totals, events by type)
- Dashboard summary (user-scoped counts)
- Alert generation (critical/warning thresholds, idempotency, userId)
- OCC middleware (version match, 409 conflict, 400 invalid, 404 not found)
- Append-only immutability guard (rejects update/delete/replace/bulkWrite)
- Historical state reconstruction

## Team

| Member | Role | Responsibility |
|--------|------|----------------|
| Member 1 (Chandan) | Backend Lead | CQRS architecture, command routes, validation |
| Member 2 (Deepan) | Event Store Engineer | MongoDB event schema, append-only logic, immutability |
| Member 3 (Nilabha) | Projections & Queries | Read models, state reconstruction, query API |
| Member 4 (Pratiksha) | Frontend Lead | Dashboard, layout, routing, Tailwind |
| Member 5 (Sabeha) | Timeline & Visualization | Event timeline, Recharts, time slider |
| Member 6 (Sumit) | Integration & Testing | Analytics, alerts, projections, OCC, integration tests |

## Contributors

Thanks to everyone who built this project together 🚀

- **Chandan K R** — Backend architecture, CQRS, OCC, Dashboard UI
- **Deepan** — Event Store, AuditTimeline, event routes
- **Nilabha** — Projections, historical state, query API
- **Pratiksha** — Frontend lead, ShipmentDetail, routing
- **Sabeha** — Timeline, shipment operations, auth
- **Sumit Verma** — Analytics, alerts, projection worker, integration tests
