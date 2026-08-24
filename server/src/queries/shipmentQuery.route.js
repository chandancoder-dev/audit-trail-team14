const express = require("express");

const {
  getShipmentEvents,
  getShipmentHistoricalState,
} = require("./shipmentQuery.controller");

const router = express.Router();

router.get("/shipment/:id/events", getShipmentEvents);

router.get("/shipment/:id/state", getShipmentHistoricalState);

module.exports = router;
