const express = require("express");

const {
  getShipment,
  getShipmentEvents,
  getShipmentHistoricalState,
} = require("./shipmentQuery.controller");

const router = express.Router();

router.get("/shipment/:id", getShipment);

router.get("/shipment/:id/events", getShipmentEvents);

router.get("/shipment/:id/state", getShipmentHistoricalState);

module.exports = router;