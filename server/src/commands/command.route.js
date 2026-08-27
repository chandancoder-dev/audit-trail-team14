const express = require("express");

const {
  commandHealth,
  createShipment,
  moveShipment,
  recordTemperature,
  arriveShipment,
} = require("./command.controller");

const router = express.Router();

router.get("/health", commandHealth);

router.post("/shipments", createShipment);

router.post("/shipment/:id/move", moveShipment);

router.post("/shipment/:id/temperature", recordTemperature);

router.post("/shipment/:id/arrive", arriveShipment);

module.exports = router;