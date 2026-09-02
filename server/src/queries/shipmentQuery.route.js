const express = require("express");

const {
  getShipmentEvents,
  getShipmentHistoricalState,
  getShipments
} = require("./shipmentQuery.controller");

const router = express.Router();

router.get("/shipment/:id/events", getShipmentEvents);

router.get("/shipment/:id/state", getShipmentHistoricalState);

router.get("/shipments", getShipments);

module.exports = router;
