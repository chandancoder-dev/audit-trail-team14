const express = require("express");
const {
  commandHealth,
  createShipment,
} = require("./command.controller");

const router = express.Router();

router.get("/health", commandHealth);

router.post("/shipments", createShipment);

module.exports = router;