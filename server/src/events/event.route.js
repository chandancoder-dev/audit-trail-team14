const express = require("express");
const router = express.Router();
const { getShipmentTimeline } = require("./event.controller");
const tokenVerification = require("../middleware/auth.middleware");

// Read-only timeline. Writes MUST go through the command API (/api/commands/*),
// which enforces validation, business rules, OCC, and version assignment.
router.get("/shipments/:id/timeline", tokenVerification, getShipmentTimeline);

module.exports =router;