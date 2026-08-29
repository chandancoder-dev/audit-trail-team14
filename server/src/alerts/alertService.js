const Alert = require('./Alert');

/**
 * alertService.js
 *
 * Generates Alert documents in response to specific events.
 * Called by the projection builder whenever a qualifying event is processed.
 *
 * Rules:
 *   TEMPERATURE_SPIKE → creates a 'critical' alert when temperature > threshold
 *                     → creates a 'warning' alert when temperature is within 2°C of threshold
 */

const TEMPERATURE_THRESHOLD = -15; // °C — above this triggers a critical alert
const WARNING_BUFFER = 2;          // °C — within this range of threshold → warning

/**
 * generateAlertFromEvent(event)
 *
 * Inspects the event and, if it meets alert criteria, persists an Alert document.
 * Idempotent: checks whether an alert for this exact event version already exists
 * before inserting to avoid duplicates during projection rebuilds.
 *
 * @param {Object} event - Mongoose Event document or plain object
 * @returns {Promise<Alert|null>} The created Alert, or null if no alert was warranted
 */
async function generateAlertFromEvent(event) {
  if (event.eventType !== 'TEMPERATURE_SPIKE') {
    return null;
  }

  const { shipmentId, payload = {}, version, recordedAt } = event;
  const temperature = payload.temperature;
  const location = payload.location || 'Unknown';

  if (temperature === undefined || temperature === null) {
    return null;
  }

  const temp = Number(temperature);
  const threshold = payload.threshold ?? TEMPERATURE_THRESHOLD;

  // Determine severity
  let severity;
  if (temp > threshold) {
    severity = 'critical';
  } else if (temp > threshold - WARNING_BUFFER) {
    severity = 'warning';
  } else {
    // Temperature is safely below threshold — no alert needed
    return null;
  }

  // Idempotency: skip if an alert already exists for this shipment + version
  const existing = await Alert.findOne({
    shipmentId,
    'metadata.eventVersion': version,
  }).lean();

  if (existing) {
    return null; // already generated during a previous projection run
  }

  const message =
    severity === 'critical'
      ? `Temperature spike detected: ${temp}°C exceeds threshold of ${threshold}°C for shipment ${shipmentId} at ${location}.`
      : `Temperature approaching threshold: ${temp}°C is within ${WARNING_BUFFER}°C of threshold (${threshold}°C) for shipment ${shipmentId} at ${location}.`;

  const alert = await Alert.create({
    shipmentId,
    type: 'TEMPERATURE_SPIKE',
    message,
    severity,
    timestamp: recordedAt || new Date(),
    acknowledged: false,
    metadata: {
      temperature: temp,
      threshold,
      location,
      eventVersion: version,
    },
  });

  console.log(
    `[AlertService] ${severity.toUpperCase()} alert created for ${shipmentId} ` +
    `(v${version}): ${temp}°C vs threshold ${threshold}°C`
  );

  return alert;
}

module.exports = { generateAlertFromEvent };
