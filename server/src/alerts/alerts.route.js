const express = require('express');
const { getAlerts, getShipmentAlerts } = require('./alerts.controller');
const tokenVerification = require("../middleware/auth.middleware")
const router = express.Router();

// GET /api/queries/alerts
router.get('/alerts',tokenVerification, getAlerts);

// GET /api/queries/shipment/:id/alerts
router.get('/shipment/:id/alerts',tokenVerification, getShipmentAlerts);

module.exports = router;
