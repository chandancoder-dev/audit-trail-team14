const express = require("express");
const router = express.Router();
const { getShipmentTimeline, createEvent } = require("./event.controller");

router.get("/shipments/:id/timeline", getShipmentTimeline);
router.post("/shipments/:id/events", createEvent);

module.exports =router;