const mongoose = require('mongoose');
const Event = require('../models/Event');
const ShipmentView = require('../projections/ShipmentView');

const TEMPERATURE_THRESHOLD = -15;

// Aggregation $match does NOT auto-cast strings to ObjectId (unlike .find()).
// req.id from the JWT is a string, so cast it for any aggregate pipeline.
function toObjectId(id) {
  if (!id) return id;
  try {
    return new mongoose.Types.ObjectId(id);
  } catch {
    return id;
  }
}

async function getTemperatureAnalytics(userId, shipmentId) {
  // Fetch all events for this shipment sorted by version.
  // We do NOT filter by userId here — the event log is per-shipment and
  // shipmentId is globally unique. Filtering by userId would break state
  // reconstruction for shipments touched by more than one user.
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

  // Build event markers — every event as a marker for the chart + timeline list
  const eventMarkers = events.map((event) => {
    const payload = event.payload || {};
    return {
      time: event.recordedAt,
      eventType: event.eventType,
      version: event.version,
      label: event.eventType.replace(/_/g, ' '),
      location: payload.location || payload.port || '',
      temperature:
        payload.temperature !== undefined && payload.temperature !== null
          ? Number(payload.temperature)
          : null,
    };
  });

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
  // Event log is per-shipment; shipmentId is globally unique, so we don't
  // filter by userId (same reasoning as getTemperatureAnalytics).
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

// Count of events grouped by type — always meaningful regardless of timing,
// unlike per-day grouping (a shipment's whole lifecycle can occur within seconds).
async function getEventTypeBreakdown(userId, shipmentId) {
  const events = await Event.find({ shipmentId })
    .sort({ version: 1 })
    .lean();

  if (events.length === 0) return [];

  const counts = {};
  for (const event of events) {
    counts[event.eventType] = (counts[event.eventType] || 0) + 1;
  }

  // Preserve a sensible lifecycle order for display.
  const ORDER = [
    'SHIPMENT_CREATED',
    'LOADED_ON_SHIP',
    'TEMPERATURE_SPIKE',
    'ARRIVED_AT_PORT',
  ];

  return Object.entries(counts)
    .map(([eventType, count]) => ({ eventType, count }))
    .sort((a, b) => {
      const ia = ORDER.indexOf(a.eventType);
      const ib = ORDER.indexOf(b.eventType);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
}

// Lifecycle timing + cold-chain compliance — all computed from real events.
// Returns null-ish fields when the relevant milestone hasn't occurred yet, so
// the UI never shows fabricated values.
async function getShipmentInsights(userId, shipmentId) {
  const events = await Event.find({ shipmentId })
    .sort({ version: 1 })
    .lean();

  if (events.length === 0) return null;

  const firstOf = (type) => events.find((e) => e.eventType === type);

  const createdEvt = firstOf('SHIPMENT_CREATED') || events[0];
  const loadedEvt = firstOf('LOADED_ON_SHIP');
  const arrivedEvt = firstOf('ARRIVED_AT_PORT');

  const ms = (evt) => (evt ? new Date(evt.recordedAt).getTime() : null);

  const createdAt = ms(createdEvt);
  const loadedAt = ms(loadedEvt);
  const arrivedAt = ms(arrivedEvt);
  const lastAt = new Date(events[events.length - 1].recordedAt).getTime();

  // Durations in ms (null when the milestone pair is incomplete).
  const transitMs =
    loadedAt != null && arrivedAt != null ? arrivedAt - loadedAt : null;
  const timeToLoadMs =
    createdAt != null && loadedAt != null ? loadedAt - createdAt : null;
  const totalLifespanMs = createdAt != null ? lastAt - createdAt : null;

  // Cold-chain compliance — real threshold comparison across temperature events.
  const threshold = TEMPERATURE_THRESHOLD;
  const tempReadings = events
    .filter(
      (e) =>
        e.payload &&
        e.payload.temperature !== undefined &&
        e.payload.temperature !== null
    )
    .map((e) => Number(e.payload.temperature));

  const breaches = tempReadings.filter((t) => t > threshold);
  const compliance = {
    threshold,
    totalReadings: tempReadings.length,
    breachCount: breaches.length,
    // "maintained" only means something once we actually have readings.
    maintained: tempReadings.length > 0 ? breaches.length === 0 : null,
    worstTemperature: breaches.length > 0 ? Math.max(...breaches) : null,
  };

  return {
    milestones: {
      createdAt: createdEvt ? createdEvt.recordedAt : null,
      loadedAt: loadedEvt ? loadedEvt.recordedAt : null,
      arrivedAt: arrivedEvt ? arrivedEvt.recordedAt : null,
    },
    durations: { timeToLoadMs, transitMs, totalLifespanMs },
    compliance,
    eventCount: events.length,
    firstVersion: events[0].version,
    lastVersion: events[events.length - 1].version,
  };
}

// Fleet-level overview across ALL of a user's shipments — status distribution,
// totals, event-type composition and recent activity. Read from ShipmentView
// (fast) + Event (for the event-type breakdown). All real aggregation.
async function getFleetOverview(userId) {
  const viewFilter = userId ? { userId } : {};
  // countDocuments auto-casts, but aggregate does not — use a cast id for both.
  const eventFilter = userId ? { userId: toObjectId(userId) } : {};

  const [views, eventTypeAgg, totalEvents] = await Promise.all([
    ShipmentView.find(viewFilter)
      .select('shipmentId status currentLocation origin destination lastTemperature hasTemperatureAlert lastEventType lastEventAt eventCount')
      .sort({ lastEventAt: -1 })
      .lean(),
    Event.aggregate([
      { $match: eventFilter },
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]),
    Event.countDocuments(eventFilter),
  ]);

  // Status distribution
  const statusCounts = { created: 0, in_transit: 0, arrived: 0, alert: 0 };
  for (const v of views) {
    if (statusCounts[v.status] !== undefined) statusCounts[v.status] += 1;
  }

  const activeAlerts = views.filter((v) => v.hasTemperatureAlert).length;

  // Event-type totals as an ordered array
  const ORDER = ['SHIPMENT_CREATED', 'LOADED_ON_SHIP', 'TEMPERATURE_SPIKE', 'ARRIVED_AT_PORT'];
  const eventsByType = eventTypeAgg
    .map((e) => ({ eventType: e._id, count: e.count }))
    .sort((a, b) => {
      const ia = ORDER.indexOf(a.eventType);
      const ib = ORDER.indexOf(b.eventType);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  return {
    totals: {
      shipments: views.length,
      events: totalEvents,
      activeAlerts,
    },
    statusCounts,
    eventsByType,
    // Lightweight recent list (already sorted by lastEventAt desc)
    shipments: views.map((v) => ({
      shipmentId: v.shipmentId,
      status: v.status,
      origin: v.origin,
      destination: v.destination,
      currentLocation: v.currentLocation,
      lastTemperature: v.lastTemperature,
      hasTemperatureAlert: v.hasTemperatureAlert,
      lastEventType: v.lastEventType,
      lastEventAt: v.lastEventAt,
      eventCount: v.eventCount,
    })),
  };
}

async function getDashboardSummary(userId) {  const userFilter = userId ? { userId } : {};
  const [totalShipments, totalEvents, alertShipments] = await Promise.all([
    ShipmentView.countDocuments(userFilter),
    Event.countDocuments(userFilter),
    ShipmentView.countDocuments({ ...userFilter, hasTemperatureAlert: true }),
  ]);

  // Average temperature across the user's shipments that have a reading.
  // aggregate $match needs a cast ObjectId (strings aren't auto-cast).
  const aggMatch = userId
    ? { userId: toObjectId(userId), lastTemperature: { $ne: null } }
    : { lastTemperature: { $ne: null } };
  const tempAgg = await ShipmentView.aggregate([
    { $match: aggMatch },
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
  getEventTypeBreakdown,
  getShipmentInsights,
  getFleetOverview,
  getDashboardSummary,
};

