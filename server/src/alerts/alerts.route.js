const express = require('express');
const { getAlerts, getShipmentAlerts } = require('./alerts.controller');

const router = express.Router();

// GET /api/queries/alerts
router.get('/alerts', getAlerts);

// GET /api/queries/shipment/:id/alerts
router.get('/shipment/:id/alerts', getShipmentAlerts);

module.exports = router;
