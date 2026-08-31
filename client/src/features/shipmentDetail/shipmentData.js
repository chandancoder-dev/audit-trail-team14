export const mockShipment = {
  shipmentId: "SHIP-001",
  containerId: "CONT-001",
  status: "In Transit",
  location: "Arabian Sea",
  temperature: 24,
  version: 2,
};

export const shipmentEvents = [
  {
    id: 1,
    eventType: "CONTAINER_CREATED",
    title: "Container Created",
    timestamp: "2026-08-25 09:30 AM",
    description: "Container CONT-001 was created and registered in the system.",
    location: "Mumbai Port",
    version: 1,
  },
  {
    id: 2,
    eventType: "LOADED_ON_SHIP",
    title: "Loaded on Ship",
    timestamp: "2026-08-25 02:15 PM",
    description: "Container CONT-001 was loaded onto the shipment vessel.",
    location: "Mumbai Port",
    version: 2,
  },
  {
    id: 3,
    eventType: "TEMPERATURE_SPIKE",
    title: "Temperature Spike",
    timestamp: "2026-08-26 11:45 AM",
    description: "Temperature increased above the normal threshold.",
    location: "Arabian Sea",
    temperature: 31,
    version: 3,
  },
  {
    id: 4,
    eventType: "ARRIVED_AT_PORT",
    title: "Arrived at Port",
    timestamp: "2026-08-27 06:20 PM",
    description: "Shipment arrived at the destination port.",
    location: "Dubai Port",
    version: 4,
  },
];