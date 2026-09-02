const express = require("express");
const occCheck = require("../middleware/occ.middleware");

const {
  commandHealth,
  createShipment,
  moveShipment,
  recordTemperature,
  arriveShipment,
} = require("./command.controller");

const tokenVerification = require("../middleware/auth.middleware")

const router = express.Router();

router.get("/health", commandHealth);

router.post("/shipment/create", tokenVerification,createShipment);

router.post("/shipment/:id/move", occCheck, moveShipment);

router.post("/shipment/:id/temperature", occCheck, recordTemperature);

router.post("/shipment/:id/arrive", occCheck, arriveShipment);

module.exports = router;