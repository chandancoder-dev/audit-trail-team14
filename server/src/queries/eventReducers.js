function applyContainerCreated(state, payload) {
  state.status = payload.status || "Created";
  state.currentLocation = payload.location || "";
  state.origin = payload.origin || "";
  state.destination = payload.destination || "";

  if (payload.temperature !== undefined) {
    state.temperature = payload.temperature;
  }

  return state;
}

function applyLoadedOnShip(state, payload) {
  state.status = payload.status || "In Transit";
  state.currentLocation = payload.location || state.currentLocation;

  if (payload.temperature !== undefined) {
    state.temperature = payload.temperature;
  }

  return state;
}

function applyTemperatureSpike(state, payload) {
  state.status = payload.status || "Temperature Alert";
  state.currentLocation = payload.location || state.currentLocation;

  if (payload.temperature !== undefined) {
    state.temperature = payload.temperature;
  }

  return state;
}

function applyArrivedAtPort(state, payload) {
  state.status = payload.status || "Arrived";
  state.currentLocation = payload.location || state.currentLocation;

  // Keep the previous temperature if the arrival event
  // does not contain a new temperature.
  if (payload.temperature !== undefined) {
    state.temperature = payload.temperature;
  }

  return state;
}

function applyEvent(state, event) {
  const payload = event.payload || {};

  switch (event.eventType) {
    case "CONTAINER_CREATED":
      return applyContainerCreated(state, payload);

    case "LOADED_ON_SHIP":
      return applyLoadedOnShip(state, payload);

    case "TEMPERATURE_SPIKE":
      return applyTemperatureSpike(state, payload);

    case "ARRIVED_AT_PORT":
      return applyArrivedAtPort(state, payload);

    default:
      if (payload.status) {
        state.status = payload.status;
      }

      if (payload.location) {
        state.currentLocation = payload.location;
      }

      if (payload.temperature !== undefined) {
        state.temperature = payload.temperature;
      }

      return state;
  }
}

module.exports = {
  applyContainerCreated,
  applyLoadedOnShip,
  applyTemperatureSpike,
  applyArrivedAtPort,
  applyEvent,
};
