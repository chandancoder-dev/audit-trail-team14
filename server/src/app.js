const express = require("express");
const cors = require("cors");
const authRouter = require("./auth/auth.route");
const shipmentQueryRouter = require("./queries/shipmentQuery.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/queries", shipmentQueryRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
