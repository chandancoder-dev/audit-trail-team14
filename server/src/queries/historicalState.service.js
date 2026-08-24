const Event = require("../models/Event");

/**
 * Reconstruct the shipment state at a specific point in time.
 *
 * @param {string} shipmentId
 * @param {string|Date} date
 * @returns {Object}
 */
async function getHistoricalState(shipmentId, date) {
  const selectedDate = new Date(date);

  if (Number.isNaN(selectedDate.getTime())) {
    throw new Error("Invalid date");
  }

  // Get all events for this shipment up to the selected time.
  const events = await Event.find({
    shipmentId,
    recordedAt: { $lte: selectedDate },
  }).sort({ recordedAt: 1, version: 1 });

  // No event means there was no shipment state at that time.
  if (events.length === 0) {
    return null;
  }

  // Start with an empty state.
  const state = {
    shipmentId,
    status: "created",
    currentLocation: "",
    origin: "",
    destination: "",
    temperature: null,
    lastEventAt: null,
    lastVersion: 0,
    eventCount: 0,
  };

  // Replay events in chronological order.
  for (const event of events) {
    const payload = event.payload || {};

    switch (event.eventType) {
      case "CONTAINER_CREATED":
        state.status = payload.status || "Created";
        state.currentLocation = payload.location || "";
        state.origin = payload.origin || "";
        state.destination = payload.destination || "";
        state.temperature =
          payload.temperature !== undefined
            ? payload.temperature
            : state.temperature;
        break;

      case "LOADED_ON_SHIP":
        state.status = payload.status || "In Transit";
        state.currentLocation = payload.location || state.currentLocation;
        state.temperature =
          payload.temperature !== undefined
            ? payload.temperature
            : state.temperature;
        break;

      case "TEMPERATURE_SPIKE":
        state.status = payload.status || "Temperature Alert";
        state.currentLocation = payload.location || state.currentLocation;
        state.temperature =
          payload.temperature !== undefined
            ? payload.temperature
            : state.temperature;
        break;

      case "ARRIVED_AT_PORT":
        state.status = payload.status || "Arrived";
        state.currentLocation = payload.location || state.currentLocation;
        state.temperature =
          payload.temperature !== undefined
            ? payload.temperature
            : state.temperature;
        break;

      default:
        // For an event type we haven't defined yet,
        // apply common fields when they exist.
        if (payload.status) {
          state.status = payload.status;
        }

        if (payload.location) {
          state.currentLocation = payload.location;
        }

        if (payload.temperature !== undefined) {
          state.temperature = payload.temperature;
        }
    }

    state.lastEventAt = event.recordedAt;
    state.lastVersion = event.version;
    state.eventCount += 1;
  }

  return state;
}

module.exports = {
  getHistoricalState,
};
