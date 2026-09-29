const express = require('express');
const { getShipmentAnalytics, getDashboard, getOverview } = require('./analytics.controller');
const tokenVerification = require("../middleware/auth.middleware");
const router = express.Router();

// GET /api/queries/analytics/overview — fleet-wide analytics
router.get('/analytics/overview', tokenVerification, getOverview);

// GET /api/queries/shipment/:id/analytics
router.get('/shipment/:id/analytics',tokenVerification, getShipmentAnalytics);

// GET /api/queries/dashboard/summary
router.get('/dashboard/summary',tokenVerification, getDashboard);

module.exports = router;
