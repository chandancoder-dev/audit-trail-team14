const {
  getTemperatureAnalytics,
  getEventFrequency,
  getEventTypeBreakdown,
  getShipmentInsights,
  getFleetOverview,
  getDashboardSummary,
} = require('../analytics/analyticsService');

const getOverview = async (req, res) => {
  try {
    const overview = await getFleetOverview(req.id);
    return res.status(200).json(overview);
  } catch (error) {
    console.error('Error fetching fleet overview:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics overview' });
  }
};

const getShipmentAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const [temperatureData, frequencyData, byTypeData, insights] = await Promise.all([
      getTemperatureAnalytics(req.id, id),
      getEventFrequency(req.id, id),
      getEventTypeBreakdown(req.id, id),
      getShipmentInsights(req.id, id),
    ]);

    // Always return 200 — let the frontend handle empty states.
    // A shipment with no temperature readings yet is still valid; 404 is wrong.
    return res.status(200).json({
      shipmentId: id,
      temperature: temperatureData,
      frequency: frequencyData,
      byType: byTypeData,
      insights,
    });
  } catch (error) {
    console.error('Error fetching shipment analytics:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.id);
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard summary' });
  }
};

module.exports = { getShipmentAnalytics, getDashboard, getOverview };
