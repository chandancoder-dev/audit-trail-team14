# Audit Trail

Event-Sourced Inventory & Logistics Ledger built with the MERN stack.

## Problem Statement

In traditional MongoDB designs (CRUD), when you update a product's inventory from 10 to 5, the previous state (10) is overwritten and lost. In highly regulated industries (Logistics, Finance), overwriting data is unacceptable; you must maintain an immutable, chronological log of every event that led to the current state.

## Use Case

A logistics manager views the Audit Trail dashboard for a specific shipping container. Instead of querying MongoDB for the current location of the container, the Node.js backend reconstructs the container's state by replaying an append-only log of events (CONTAINER_CREATED → LOADED_ON_SHIP → TEMPERATURE_SPIKE → ARRIVED_AT_PORT). If a dispute arises about when the temperature spiked, the manager can instantly view the immutable historical timeline, providing cryptographic proof of the event sequence.

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
- MongoDB (Event Store + Read Models + Alerts)

### Dev Tools
- Nodemon
- Concurrently
- Dotenv

## Project Structure

```
audit-trail-team14/
├── client/                          # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── components/              # Shared UI components
│   │   │   ├── AuditTimeline.jsx    # Vertical event timeline
│   │   │   └── EventCard.jsx        # Single event display card
│   │   ├── features/
│   │   │   ├── analytics/           # Analytics feature module
│   │   │   │   ├── AnalyticsPage.jsx
│   │   │   │   ├── TemperatureChart.jsx
│   │   │   │   └── index.js
│   │   │   └── alerts/              # Alerts feature module
│   │   │       ├── AlertsPage.jsx
│   │   │       ├── AlertCard.jsx
│   │   │       └── index.js
│   │   ├── pages/
│   │   │   ├── HistoricalState.jsx  # Time travel with state reconstruction
│   │   │   └── ShipmentOperations.jsx # Create/manage shipments
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + API methods
│   │   ├── styles/
│   │   │   └── historicalState.css
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx
│   │   └── index.css                # Tailwind + theme tokens
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                          # Express backend
│   ├── server.js                    # Entry point + MongoDB connection
│   ├── src/
│   │   ├── app.js                   # Express app setup + route mounting
│   │   ├── auth/
│   │   │   ├── auth.controller.js   # Register/Login logic
│   │   │   └── auth.route.js        # Auth routes
│   │   ├── middleware/
│   │   │   └── auth.middleware.js   # JWT verification middleware
│   │   ├── models/
│   │   │   └── User.js             # User model
│   │   ├── projections/
│   │   │   └── ShipmentView.js      # Read model schema
│   │   ├── analytics/
│   │   │   └── analyticsService.js  # Analytics computation service
│   │   └── alerts/
│   │       └── Alert.js             # Alert model schema
│   ├── .env
│   └── package.json
├── package.json                     # Root scripts (runs both)
├── WORKPLAN.md                      # Detailed 4-week project plan
├── COMMIT_PLAN.md                   # Daily commit plan (M6)
├── .gitignore
└── README.md
```

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | ShipmentOperations | Create/manage shipments |
| `/historicalstate` | HistoricalState | Time travel with state reconstruction |
| `/audittimeline` | AuditTimeline | Vertical event timeline |
| `/shipment/:id/analytics` | AnalyticsPage | Temperature charts & event analysis |
| `/alerts` | AlertsPage | Alert monitoring with severity filters |

## API Endpoints

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

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
| GET | `/api/queries/alerts` | Get all alerts (filterable) |
| GET | `/api/queries/shipment/:id/alerts` | Get shipment-specific alerts |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                   │
│  Dashboard │ Timeline │ Analytics │ Alerts │ History  │
└─────────────────────────┬───────────────────────────┘
                          │ Axios
┌─────────────────────────┴───────────────────────────┐
│                 Backend (Express + CQRS)              │
│                                                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Auth   │  │   Commands   │  │    Queries   │   │
│  │  (JWT)   │  │ (Write Side) │  │ (Read Side)  │   │
│  └──────────┘  └──────┬───────┘  └──────┬───────┘   │
│                        │                  │           │
│                 ┌──────▼───────┐  ┌──────▼────────┐  │
│                 │  Event Store │  │  Read Models  │  │
│                 │ (Append-Only)│  │(ShipmentView) │  │
│                 └──────┬───────┘  └───────────────┘  │
│                        │                             │
│              ┌─────────▼──────────┐                  │
│              │  Projection Builder │                  │
│              └─────────┬──────────┘                  │
│                        │                             │
│                 ┌──────▼───────┐                     │
│                 │    Alerts    │                     │
│                 │  (Generated) │                     │
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

- Client runs on: http://localhost:5173
- Server runs on: http://localhost:8000

## Environment Variables

Create `server/.env`:
```
MONGO_URI=mongodb://localhost:27017/audit-trail
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client & server concurrently |
| `npm run client` | Run only the React app |
| `npm run server` | Run only the Express server |

## Team

| Member | Role | Responsibility |
|--------|------|----------------|
| Member 1 | Backend Lead | CQRS architecture, command routes, validation |
| Member 2 | Event Store Engineer | MongoDB event schema, append-only logic, immutability |
| Member 3 | Projections & Queries | Read models, state reconstruction, query API |
| Member 4 | Frontend Lead | Dashboard, layout, routing, Tailwind, search |
| Member 5 | Timeline & Visualization | Event timeline, Recharts, time slider |
| Member 6 (Sumit) | Integration & Testing | Analytics, alerts, projections, OCC, integration testing |
