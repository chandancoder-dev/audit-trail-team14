const {
  getTemperatureAnalytics,
  getEventFrequency,
  getDashboardSummary,
} = require('../analytics/analyticsService');

const getShipmentAnalytics = async (req, res) => {
  try {
    const { id } = req.params;

    const [temperatureData, frequencyData] = await Promise.all([
      getTemperatureAnalytics(id),
      getEventFrequency(id),
    ]);

    if (
      temperatureData.timeSeries.length === 0 &&
      frequencyData.length === 0
    ) {
      return res.status(404).json({
        message: 'No analytics data found for this shipment',
      });
    }

    return res.status(200).json({
      shipmentId: id,
      temperature: temperatureData,
      frequency: frequencyData,
    });
  } catch (error) {
    console.error('Error fetching shipment analytics:', error);
    return res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

const getDashboard = async (req, res) => {
  try {
    const summary = await getDashboardSummary();
    return res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return res.status(500).json({ message: 'Failed to fetch dashboard summary' });
  }
};

module.exports = { getShipmentAnalytics, getDashboard };
