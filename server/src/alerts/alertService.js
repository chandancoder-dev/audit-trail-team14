const Alert = require('./Alert');

const TEMPERATURE_THRESHOLD = -15;
const WARNING_BUFFER = 2;

async function generateAlertFromEvent(event) {
  if (event.eventType !== 'TEMPERATURE_SPIKE') return null;

  const { userId, shipmentId, payload = {}, version, recordedAt } = event;
  const temperature = payload.temperature;

  if (temperature === undefined || temperature === null) return null;

  const temp = Number(temperature);
  const threshold = payload.threshold ?? TEMPERATURE_THRESHOLD;
  const location = payload.location || 'Unknown';

  let severity;
  if (temp > threshold) {
    severity = 'critical';
  } else if (temp > threshold - WARNING_BUFFER) {
    severity = 'warning';
  } else {
    return null;
  }

  const existing = await Alert.findOne({
    userId,
    shipmentId,
    'metadata.eventVersion': version,
  }).lean();

  if (existing) return null;

  const message = severity === 'critical'
    ? `Temperature spike detected: ${temp}°C exceeds threshold of ${threshold}°C for shipment ${shipmentId} at ${location}.`
    : `Temperature approaching threshold: ${temp}°C is within ${WARNING_BUFFER}°C of threshold (${threshold}°C) for shipment ${shipmentId} at ${location}.`;

  const alert = await Alert.create({
    userId,
    shipmentId,
    type: 'TEMPERATURE_SPIKE',
    message,
    severity,
    timestamp: recordedAt || new Date(),
    acknowledged: false,
    metadata: { temperature: temp, threshold, location, eventVersion: version },
  });

  console.log(`[AlertService] ${severity.toUpperCase()} alert for ${shipmentId} v${version}: ${temp}°C`);

  return alert;
}

module.exports = { generateAlertFromEvent };
