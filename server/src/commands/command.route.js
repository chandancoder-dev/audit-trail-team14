const express = require("express");

const {
  commandHealth,
  createShipment,
  moveShipment,
  recordTemperature,
} = require("./command.controller");

const router = express.Router();

router.get("/health", commandHealth);

router.post("/shipments", createShipment);

router.post("/shipment/:id/move", moveShipment);

router.post("/shipment/:id/temperature", recordTemperature);

module.exports = router;
