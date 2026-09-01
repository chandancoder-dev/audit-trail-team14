const { reconstructState } = require("../src/queries/historicalState.service");

describe("Historical State Reconstruction", () => {
  const events = [
    {
      shipmentId: "SHIP-001",
      eventType: "CONTAINER_CREATED",
      version: 1,
      recordedAt: "2026-08-22T10:44:05.359Z",
      payload: {
        status: "Created",
        location: "Warehouse",
        temperature: 22,
      },
    },
    {
      shipmentId: "SHIP-001",
      eventType: "LOADED_ON_SHIP",
      version: 2,
      recordedAt: "2026-08-25T12:53:08.562Z",
      payload: {
        status: "In Transit",
        location: "Port A",
        temperature: 22,
      },
    },
    {
      shipmentId: "SHIP-001",
      eventType: "TEMPERATURE_SPIKE",
      version: 3,
      recordedAt: "2026-08-26T06:34:48.162Z",
      payload: {
        status: "Temperature Alert",
        location: "At Sea",
        temperature: 31,
      },
    },
    {
      shipmentId: "SHIP-001",
      eventType: "ARRIVED_AT_PORT",
      version: 4,
      recordedAt: "2026-08-27T12:47:08.056Z",
      payload: {
        port: "Port B",
        location: "Port B",
      },
    },
  ];

  test("reconstructs the final shipment state from all events", () => {
    const state = reconstructState(events);

    expect(state).toEqual({
      shipmentId: "SHIP-001",
      status: "Arrived",
      currentLocation: "Port B",
      origin: "",
      destination: "",
      temperature: 31,
      lastEventAt: "2026-08-27T12:47:08.056Z",
      lastVersion: 4,
      eventCount: 4,
    });
  });

  test("reconstructs state after the shipment was created", () => {
    const state = reconstructState(events.slice(0, 1));

    expect(state.status).toBe("Created");
    expect(state.currentLocation).toBe("Warehouse");
    expect(state.temperature).toBe(22);
    expect(state.lastVersion).toBe(1);
    expect(state.eventCount).toBe(1);
  });

  test("reconstructs state after loading the shipment", () => {
    const state = reconstructState(events.slice(0, 2));

    expect(state.status).toBe("In Transit");
    expect(state.currentLocation).toBe("Port A");
    expect(state.temperature).toBe(22);
    expect(state.lastVersion).toBe(2);
    expect(state.eventCount).toBe(2);
  });

  test("reconstructs state after temperature spike", () => {
    const state = reconstructState(events.slice(0, 3));

    expect(state.status).toBe("Temperature Alert");
    expect(state.currentLocation).toBe("At Sea");
    expect(state.temperature).toBe(31);
    expect(state.lastVersion).toBe(3);
    expect(state.eventCount).toBe(3);
  });

  test("carries forward the previous temperature when arrival has no temperature", () => {
    const state = reconstructState(events);

    expect(state.status).toBe("Arrived");
    expect(state.currentLocation).toBe("Port B");
    expect(state.temperature).toBe(31);
  });

  test("returns null when there are no events", () => {
    expect(reconstructState([])).toBeNull();
  });
});
