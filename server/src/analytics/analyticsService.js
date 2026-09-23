const Event = require('../models/Event');
const ShipmentView = require('../projections/ShipmentView');

const TEMPERATURE_THRESHOLD = -15;

async function getTemperatureAnalytics(userId, shipmentId) {
  // Fetch all events for this shipment sorted by version
  const events = await Event.find({ shipmentId })
    .sort({ version: 1 })
    .lean();

  if (events.length === 0) {
    return {
      timeSeries: [],
      stats: { min: null, max: null, avg: null, spikeCount: 0, totalReadings: 0 },
      spikes: [],
      eventMarkers: [],
    };
  }

  // Build time-series from all events that carry a temperature reading
  const timeSeries = [];
  const spikes = [];

  for (const event of events) {
    const payload = event.payload || {};
    if (payload.temperature !== undefined && payload.temperature !== null) {
      const point = {
        time: event.recordedAt,
        temperature: Number(payload.temperature),
        eventType: event.eventType,
        version: event.version,
        location: payload.location || '',
      };
      timeSeries.push(point);

      if (event.eventType === 'TEMPERATURE_SPIKE') {
        spikes.push(point);
      }
    }
  }

  // Calculate stats
  let min = null, max = null, avg = null;
  if (timeSeries.length > 0) {
    const temps = timeSeries.map((p) => p.temperature);
    min = Math.min(...temps);
    max = Math.max(...temps);
    avg = Number((temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2));
  }

  // Build event markers — every event as a marker for the chart
  const eventMarkers = events.map((event) => ({
    time: event.recordedAt,
    eventType: event.eventType,
    version: event.version,
    label: event.eventType.replace(/_/g, ' '),
  }));

  return {
    timeSeries,
    stats: {
      min,
      max,
      avg,
      spikeCount: spikes.length,
      totalReadings: timeSeries.length,
      threshold: TEMPERATURE_THRESHOLD,
    },
    spikes,
    eventMarkers,
  };
}

async function getEventFrequency(userId, shipmentId) {
  const events = await Event.find({ shipmentId })
    .sort({ recordedAt: 1 })
    .lean();

  if (events.length === 0) return [];

  // Group by date
  const byDate = {};
  for (const event of events) {
    const date = new Date(event.recordedAt).toISOString().slice(0, 10); // YYYY-MM-DD
    if (!byDate[date]) {
      byDate[date] = { date, count: 0, breakdown: {} };
    }
    byDate[date].count += 1;
    byDate[date].breakdown[event.eventType] =
      (byDate[date].breakdown[event.eventType] || 0) + 1;
  }

  return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
}

async function getDashboardSummary() {
  const [totalShipments, totalEvents, alertShipments] = await Promise.all([
    ShipmentView.countDocuments(),
    Event.countDocuments(),
    ShipmentView.countDocuments({ hasTemperatureAlert: true }),
  ]);

  // Average temperature across all shipments that have a reading
  const tempAgg = await ShipmentView.aggregate([
    { $match: { lastTemperature: { $ne: null } } },
    { $group: { _id: null, avg: { $avg: '$lastTemperature' } } },
  ]);

  const avgTemperature =
    tempAgg.length > 0 ? Number(tempAgg[0].avg.toFixed(2)) : null;

  return {
    totalShipments,
    totalEvents,
    activeAlerts: alertShipments,
    avgTemperature,
  };
}

module.exports = {
  getTemperatureAnalytics,
  getEventFrequency,
  getDashboardSummary,
};

