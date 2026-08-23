const express = require("express");

const { getShipmentEvents } = require("./shipmentQuery.controller");

const router = express.Router();

router.get("/shipment/:id/events", getShipmentEvents);

module.exports = router;
