const Event = require("../models/Event");
const { applyEvent } = require("./eventReducers");

/**
 * Reconstruct shipment state by replaying events
 * in chronological/version order.
 *
 * @param {Array} events
 * @returns {Object|null}
 */
function reconstructState(events) {
  if (!events || events.length === 0) {
    return null;
  }

  const firstEvent = events[0];

  const state = {
    shipmentId: firstEvent.shipmentId,
    status: "created",
    currentLocation: "",
    origin: "",
    destination: "",
    temperature: null,
    lastEventAt: null,
    lastVersion: 0,
    eventCount: 0,
  };

  for (const event of events) {
    applyEvent(state, event);

    state.lastEventAt = event.recordedAt;
    state.lastVersion = event.version;
    state.eventCount += 1;
  }

  return state;
}

/**
 * Reconstruct the shipment state at a specific point in time.
 * @param {string} userId
 * @param {string} shipmentId
 * @param {string|Date} date
 * @returns {Object|null}
 */
async function getHistoricalState(userId, shipmentId, date) {
  const selectedDate = new Date(date);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date");
  }

  // Get all events for this shipment up to the selected time.
  const events = await Event.find({
    userId,
    shipmentId,
    recordedAt: { $lte: selectedDate },
  }).sort({ recordedAt: 1, version: 1 });

  // Reconstruct state from the filtered events.
  return reconstructState(events);
}

module.exports = {
  getHistoricalState,
  reconstructState,
};
