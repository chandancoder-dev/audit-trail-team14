const express = require("express");
const cors = require("cors");

const authRouter = require("./auth/auth.route");
const shipmentQueryRouter = require("./queries/shipmentQuery.route");
const commandRouter = require("./commands/command.route");
const analyticsRouter = require("./analytics/analytics.route");
const alertsRouter = require("./alerts/alerts.route");
const eventRouter = require("./events/event.route");

const app = express();

// Allowed origins — configurable via CLIENT_ORIGINS (comma-separated).
// Defaults cover the common Vite dev ports (5173 falls back to 5174+ when busy).
const allowedOrigins = (
  process.env.CLIENT_ORIGINS ||
  "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// In development, allow any localhost / 127.0.0.1 port so that Vite's
// automatic port fallback (5173 → 5174 → 5175 …) never triggers a CORS error.
const isDev = (process.env.NODE_ENV || "development") !== "production";
const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, Postman) that send no Origin header.
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (isDev && localhostRegex.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/queries", shipmentQueryRouter);
app.use("/api/queries", analyticsRouter);
app.use("/api/queries", alertsRouter);
app.use("/api/commands", commandRouter);
app.use("/api/events", eventRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;