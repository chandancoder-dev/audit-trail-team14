const express = require("express");

const occCheck = require("../middleware/occ.middleware");
const tokenVerification = require("../middleware/auth.middleware");

const {
  commandHealth,
  createShipment,
  moveShipment,
  recordTemperature,
  arriveShipment,
} = require("./command.controller");

const router = express.Router();

router.get("/health", commandHealth);

router.post("/shipment/create", tokenVerification, createShipment);

router.post(
  "/shipment/:id/move",
  tokenVerification,
  occCheck,
  moveShipment
);

router.post(
  "/shipment/:id/temperature",
  tokenVerification,
  occCheck,
  recordTemperature
);

router.post(
  "/shipment/:id/arrive",
  tokenVerification,
  occCheck,
  arriveShipment
);

module.exports = router;