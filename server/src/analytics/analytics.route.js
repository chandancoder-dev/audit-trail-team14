const express = require('express');
const { getShipmentAnalytics, getDashboard } = require('./analytics.controller');
const tokenVerification = require("../middleware/auth.middleware");
const router = express.Router();

// GET /api/queries/shipment/:id/analytics
router.get('/shipment/:id/analytics',tokenVerification, getShipmentAnalytics);

// GET /api/queries/dashboard/summary
router.get('/dashboard/summary',tokenVerification, getDashboard);

module.exports = router;
