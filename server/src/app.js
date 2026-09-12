const express = require("express");
const cors = require("cors");

const authRouter = require("./auth/auth.route");
const shipmentQueryRouter = require("./queries/shipmentQuery.route");
const commandRouter = require("./commands/command.route");
const analyticsRouter = require("./analytics/analytics.route");
const alertsRouter = require("./alerts/alerts.route");
const eventRouter = require("./events/event.route");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
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