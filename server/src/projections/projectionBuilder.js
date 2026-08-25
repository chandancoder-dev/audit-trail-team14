const ShipmentView = require('../projections/ShipmentView');

/**
 * Projection Builder
 *
 * Handles each event type from the Event Store and updates the ShipmentView
 * read model accordingly. Called by the projection worker after every new event.
 *
 * Each handler:
 *   1. Extracts relevant fields from event.payload
 *   2. Calls ShipmentView.upsert() to write the updated state
 *   3. Calls ShipmentView.recordEvent() to increment eventCount + update tracking
 *
 * Event types handled:
 *   CONTAINER_CREATED   → creates the ShipmentView document
 *   LOADED_ON_SHIP      → updates location, vessel, status → in_transit
 *   TEMPERATURE_SPIKE   → updates temperature, flags alert, status → alert
 *   ARRIVED_AT_PORT     → updates port, clears alert flag, status → arrived
 */

// ── Handlers ──────────────────────────────────────────────────────────────────

/**
 * CONTAINER_CREATED
 * Initialises a new ShipmentView document.
 */
async function handleContainerCreated(event) {
  const { shipmentId, payload, recordedAt, version } = event;
  const { origin = '', destination = '', location = '', notes = '' } = payload || {};

  await ShipmentView.upsert(shipmentId, {
    shipmentId,
    status: 'created',
    origin,
    destination,
    currentLocation: location || origin,
    vessel: '',
    port: '',
    lastTemperature: null,
    temperatureThreshold: null,
    hasTemperatureAlert: false,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
    eventCount: 1,
  });
}

/**
 * LOADED_ON_SHIP
 * Updates location, vessel name, and sets status to in_transit.
 */
async function handleLoadedOnShip(event) {
  const { shipmentId, payload, recordedAt, version } = event;
  const { location = '', vessel = '' } = payload || {};

  await ShipmentView.upsert(shipmentId, {
    status: 'in_transit',
    currentLocation: location,
    vessel,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
  });

  await ShipmentView.recordEvent(shipmentId, event.eventType, recordedAt, version);
}

/**
 * TEMPERATURE_SPIKE
 * Records the temperature reading, sets alert flag, and updates status to alert.
 */
async function handleTemperatureSpike(event) {
  const { shipmentId, payload, recordedAt, version } = event;
  const { temperature = null, threshold = null, location = '' } = payload || {};

  const fields = {
    status: 'alert',
    lastTemperature: temperature,
    hasTemperatureAlert: true,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
  };

  if (threshold !== null) fields.temperatureThreshold = threshold;
  if (location) fields.currentLocation = location;

  await ShipmentView.upsert(shipmentId, fields);
  await ShipmentView.recordEvent(shipmentId, event.eventType, recordedAt, version);
}

/**
 * ARRIVED_AT_PORT
 * Records port arrival, clears temperature alert flag, sets status to arrived.
 */
async function handleArrivedAtPort(event) {
  const { shipmentId, payload, recordedAt, version } = event;
  const { port = '', location = '' } = payload || {};

  await ShipmentView.upsert(shipmentId, {
    status: 'arrived',
    port,
    currentLocation: location || port,
    hasTemperatureAlert: false,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
  });

  await ShipmentView.recordEvent(shipmentId, event.eventType, recordedAt, version);
}

// ── Handler Registry ──────────────────────────────────────────────────────────

const HANDLERS = {
  CONTAINER_CREATED: handleContainerCreated,
  LOADED_ON_SHIP:    handleLoadedOnShip,
  TEMPERATURE_SPIKE: handleTemperatureSpike,
  ARRIVED_AT_PORT:   handleArrivedAtPort,
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * project(event)
 *
 * Main entry point. Dispatches an event to its handler.
 * Skips unknown event types with a warning instead of throwing.
 *
 * @param {Object} event - Mongoose Event document or plain object
 * @returns {Promise<void>}
 */
async function project(event) {
  const handler = HANDLERS[event.eventType];

  if (!handler) {
    console.warn(`[ProjectionBuilder] No handler for event type: ${event.eventType}`);
    return;
  }

  try {
    await handler(event);
  } catch (err) {
    console.error(`[ProjectionBuilder] Failed to process event ${event.eventType} (v${event.version}) for ${event.shipmentId}:`, err.message);
    throw err;
  }
}

/**
 * projectMany(events)
 *
 * Process an ordered array of events sequentially.
 * Used by the projection worker during catch-up / rebuild.
 *
 * @param {Object[]} events - Array of events sorted by version ascending
 * @returns {Promise<void>}
 */
async function projectMany(events) {
  for (const event of events) {
    await project(event);
  }
}

module.exports = { project, projectMany };
