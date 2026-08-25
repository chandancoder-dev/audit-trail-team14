const express = require("express");

const {
  commandHealth,
  createShipment,
  moveShipment,
} = require("./command.controller");

const router = express.Router();

router.get("/health", commandHealth);

router.post("/shipments", createShipment);

router.post("/shipment/:id/move", moveShipment);

module.exports = router;
