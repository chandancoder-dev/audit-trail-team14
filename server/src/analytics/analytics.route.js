const express = require('express');
const { getShipmentAnalytics, getDashboard } = require('./analytics.controller');

const router = express.Router();

// GET /api/queries/shipment/:id/analytics
router.get('/shipment/:id/analytics', getShipmentAnalytics);

// GET /api/queries/dashboard/summary
router.get('/dashboard/summary', getDashboard);

module.exports = router;
