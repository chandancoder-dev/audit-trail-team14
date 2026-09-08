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
│   │   │   ├── AuditTimeline.jsx    # Vertical event timeline
│   │   │   ├── ConflictDialog.jsx   # OCC 409 conflict modal (M6)
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventMetadataViewer.jsx
│   │   │   ├── EventPayloadViewer.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   ├── features/
│   │   │   ├── analytics/
│   │   │   │   ├── AnalyticsPage.jsx     # Live temperature charts + stats (M6)
│   │   │   │   └── TemperatureChart.jsx  # Recharts line chart + event markers (M6)
│   │   │   ├── alerts/
│   │   │   │   ├── AlertsPage.jsx        # Live alerts with severity filters (M6)
│   │   │   │   └── AlertCard.jsx
│   │   │   └── shipmentDetail/
│   │   │       └── ShipmentDetail.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── HistoricalState.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
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
│   │   ├── rebuildProjections.js    # Wipe + replay all projections (M6)
│   │   └── benchmark.js             # Event-replay vs read-model benchmark (M6)
│   ├── src/
│   │   ├── app.js                   # Express app + route mounting
│   │   ├── analytics/
│   │   │   ├── analyticsService.js  # Temperature analytics + event frequency (M6)
│   │   │   ├── analytics.controller.js
│   │   │   └── analytics.route.js
│   │   ├── alerts/
│   │   │   ├── Alert.js             # Alert Mongoose model (M6)
│   │   │   ├── alertService.js      # Auto-generate alerts on TEMPERATURE_SPIKE (M6)
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
│   │   │   └── occ.middleware.js    # Optimistic concurrency control (M6)
│   │   ├── models/
│   │   │   ├── Event.js
│   │   │   └── User.js
│   │   ├── projections/
│   │   │   ├── ShipmentView.js      # CQRS read model (M6)
│   │   │   ├── projectionBuilder.js # Event handlers → ShipmentView (M6)
│   │   │   └── projectionWorker.js  # Background poll + catch-up + retry (M6)
│   │   └── queries/
│   │       ├── historicalState.service.js
│   │       ├── shipmentQuery.controller.js
│   │       └── shipmentQuery.route.js
│   ├── tests/
│   │   ├── historicalState.test.js
│   │   └── m6.integration.test.js   # 23 tests: analytics, alerts, OCC, flow (M6)
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
| `/shipment-operations` | ShipmentOperations | Create & manage shipment events |
| `/shipment/:id` | ShipmentDetail | Shipment state + event timeline |
| `/shipment/:id/analytics` | AnalyticsPage | Temperature charts & event analysis |
| `/alerts` | AlertsPage | Alert monitoring with severity filters |
| `/historicalstate` | HistoricalState | Time-travel state reconstruction |
| `/audittimeline/:id` | AuditTimeline | Vertical event timeline |
| `/login` | Login | Authentication |
| `/register` | Register | Registration |
| `/forgot-password` | ForgotPassword | Password reset |

## API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current authenticated user |

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
| GET | `/api/queries/shipments` | List all shipments (paginated) |
| GET | `/api/queries/shipment/:id` | Get current shipment state |
| GET | `/api/queries/shipment/:id/events` | Get raw event list |
| GET | `/api/queries/shipment/:id/state?date=` | Reconstruct state at a point in time |
| GET | `/api/queries/shipment/:id/analytics` | Temperature time-series, stats, event markers |
| GET | `/api/queries/dashboard/summary` | Total shipments, events, alerts, avg temperature |
| GET | `/api/queries/alerts` | All alerts (paginated, filterable by severity/shipment) |
| GET | `/api/queries/shipment/:id/alerts` | Alerts for a specific shipment |

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
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client & server concurrently |
| `npm run client` | Run only the React app |
| `npm run server` | Run only the Express server |
| `npm test` | Run Jest integration tests (from server/) |
| `node scripts/rebuildProjections.js` | Wipe and rebuild all ShipmentView projections |
| `node scripts/benchmark.js` | Benchmark event-replay vs read-model query time |

## Testing

```bash
cd server
npm test
```

23 tests across 5 suites covering:
- Temperature analytics computation (timeSeries, stats, spikes, eventMarkers)
- Event frequency grouping and sorting
- Alert generation (critical/warning thresholds, idempotency, custom threshold)
- OCC middleware (version match, 409 conflict, 400 invalid, 404 not found)
- Full event flow pipeline

## Team

| Member | Role | Responsibility |
|--------|------|----------------|
| Member 1 | Backend Lead | CQRS architecture, command routes, validation |
| Member 2 | Event Store Engineer | MongoDB event schema, append-only logic, immutability |
| Member 3 | Projections & Queries | Read models, state reconstruction, query API |
| Member 4 | Frontend Lead | Dashboard, layout, routing, Tailwind |
| Member 5 | Timeline & Visualization | Event timeline, Recharts, time slider |
| Member 6 (Sumit) | Integration & Testing | Analytics, alerts, projections, OCC, integration tests |
