const ShipmentView = require('../projections/ShipmentView');
const { generateAlertFromEvent } = require('../alerts/alertService');

// Projection Builder — maps each event type to a ShipmentView read-model update.
// Called by the projection worker per event: upsert() writes state, recordEvent()
// bumps eventCount and tracking fields.

// SHIPMENT_CREATED — initialise a new ShipmentView document.
async function handleShipmentCreated(event) {
  const {
    userId,
    shipmentId,
    payload,
    recordedAt,
    version,
  } = event;

  const {
    origin = '',
    destination = '',
    location = '',
  } = payload || {};

  await ShipmentView.upsert(userId, shipmentId, {
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
  });

  await ShipmentView.recordEvent(
    userId,
    shipmentId,
    event.eventType,
    recordedAt,
    version
  );
}

// LOADED_ON_SHIP — update location + vessel, status → in_transit.
async function handleLoadedOnShip(event) {
  const {
    userId,
    shipmentId,
    payload,
    recordedAt,
    version,
  } = event;

  const {
    location = '',
    vessel = '',
    temperature = null,
  } = payload || {};

  const fields = {
    status: 'in_transit',
    currentLocation: location,
    vessel,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
  };

  if (temperature !== null && temperature !== undefined) {
    fields.lastTemperature = temperature;
  }

  await ShipmentView.upsert(userId, shipmentId, fields);

  // FIX:
  // recordEvent() expects:
  // userId, shipmentId, eventType, recordedAt, version
  await ShipmentView.recordEvent(
    userId,
    shipmentId,
    event.eventType,
    recordedAt,
    version
  );
}

// TEMPERATURE_SPIKE — record temperature, flag alert, status → alert.
async function handleTemperatureSpike(event) {
  const {
    userId,
    shipmentId,
    payload,
    recordedAt,
    version,
  } = event;

  const {
    temperature = null,
    threshold = null,
    location = '',
  } = payload || {};

  const fields = {
    status: 'alert',
    lastTemperature: temperature,
    hasTemperatureAlert: true,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
  };

  if (threshold !== null) {
    fields.temperatureThreshold = threshold;
  }

  if (location) {
    fields.currentLocation = location;
  }

  await ShipmentView.upsert(userId, shipmentId, fields);

  await ShipmentView.recordEvent(
    userId,
    shipmentId,
    event.eventType,
    recordedAt,
    version
  );

  // Generate an alert if the temperature exceeds or approaches the threshold
  await generateAlertFromEvent(event).catch((err) =>
    console.error(
      '[ProjectionBuilder] Alert generation failed:',
      err.message
    )
  );
}

// ARRIVED_AT_PORT — record port, clear alert flag, status → arrived.
async function handleArrivedAtPort(event) {
  const {
    userId,
    shipmentId,
    payload,
    recordedAt,
    version,
  } = event;

  const {
    port = '',
    location = '',
  } = payload || {};

  await ShipmentView.upsert(userId, shipmentId, {
    status: 'arrived',
    port,
    currentLocation: location || port,
    hasTemperatureAlert: false,
    lastEventType: event.eventType,
    lastEventAt: recordedAt,
    lastVersion: version,
  });

  await ShipmentView.recordEvent(
    userId,
    shipmentId,
    event.eventType,
    recordedAt,
    version
  );
}

// ── Handler Registry ──────────────────────────────────────────────────────────

const HANDLERS = {
  SHIPMENT_CREATED: handleShipmentCreated,
  LOADED_ON_SHIP: handleLoadedOnShip,
  TEMPERATURE_SPIKE: handleTemperatureSpike,
  ARRIVED_AT_PORT: handleArrivedAtPort,
};

// ── Public API ────────────────────────────────────────────────────────────────

// project(event) — dispatch one event to its handler; unknown types are skipped.
async function project(event) {
  const handler = HANDLERS[event.eventType];

  if (!handler) {
    console.warn(
      `[ProjectionBuilder] No handler for event type: ${event.eventType}`
    );
    return;
  }

  try {
    await handler(event);
  } catch (err) {
    console.error(
      `[ProjectionBuilder] Failed to process event ${event.eventType} ` +
        `(v${event.version}) for ${event.shipmentId}:`,
      err.message
    );

    throw err;
  }
}

// projectMany(events) — process an ordered (by version asc) array sequentially.
async function projectMany(events) {
  for (const event of events) {
    await project(event);
  }
}

module.exports = {
  project,
  projectMany,
};