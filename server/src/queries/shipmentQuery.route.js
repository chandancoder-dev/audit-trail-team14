const express = require("express");

const {
  getShipment,
  getShipmentEvents,
  getShipmentHistoricalState,
  getShipments,
  getShipmentTimeline,
} = require("./shipmentQuery.controller");

const tokenVerification = require("../middleware/auth.middleware")
const router = express.Router();

router.get("/shipment/:id",tokenVerification, getShipment);

router.get("/shipment/:id/events",tokenVerification, getShipmentEvents);

router.get("/shipment/:id/timeline",tokenVerification, getShipmentTimeline);

router.get("/shipment/:id/state",tokenVerification, getShipmentHistoricalState);

router.get("/shipments",tokenVerification,getShipments);

module.exports = router;