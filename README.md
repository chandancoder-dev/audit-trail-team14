# Audit Trail

Event-Sourced Inventory & Logistics Ledger built with the MERN stack.

## Problem Statement

In traditional MongoDB designs (CRUD), when you update a product's inventory from 10 to 5, the previous state (10) is overwritten and lost. In highly regulated industries (Logistics, Finance), overwriting data is unacceptable; you must maintain an immutable, chronological log of every event that led to the current state.

## Use Case

A logistics manager views the Audit Trail dashboard for a specific shipping container. Instead of querying MongoDB for the current location of the container, the Node.js backend reconstructs the container's state by replaying an append-only log of events (CONTAINER_CREATED → LOADED_ON_SHIP → TEMPERATURE_SPIKE → ARRIVED_AT_PORT). If a dispute arises about when the temperature spiked, the manager can instantly view the immutable historical timeline, providing cryptographic proof of the event sequence.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Recharts (data visualization)

### Backend
- Node.js
- Express.js
- CQRS Architecture

### Database
- MongoDB (Event Store + Read Models)

### Dev Tools
- Nodemon
- Concurrently
- Dotenv

## Project Structure

```
audit-trail-team14/
├── client/                # React frontend (Vite + Tailwind CSS)
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                # Express backend
│   ├── server.js          # Entry point
│   ├── src/
│   │   └── app.js         # Express app setup
│   ├── .env
│   └── package.json
├── package.json           # Root scripts (runs both)
├── .gitignore
└── README.md
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
- Server runs on: http://localhost:5000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run client & server concurrently |
| `npm run client` | Run only the React app |
| `npm run server` | Run only the Express server |
