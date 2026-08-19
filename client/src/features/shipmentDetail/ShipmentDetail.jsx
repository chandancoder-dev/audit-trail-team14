import React from "react";

const mockShipment = {
  shipmentId: "SHIP-001",
  containerId: "CONT-001",
  status: "In Transit",
  location: "Arabian Sea",
  temperature: 24,
  version: 2,
};

function ShipmentDetail() {
  return (
    <div>
      <h1>Shipment Details</h1>

      <p>
        Shipment ID: <strong>{mockShipment.shipmentId}</strong>
      </p>

      <p>
        Container ID: <strong>{mockShipment.containerId}</strong>
      </p>

      <p>
        Status: <strong>{mockShipment.status}</strong>
      </p>

      <p>
        Current Location: <strong>{mockShipment.location}</strong>
      </p>

      <p>
        Temperature: <strong>{mockShipment.temperature}°C</strong>
      </p>

      <p>
        Version: <strong>{mockShipment.version}</strong>
      </p>
    </div>
  );
}

export default ShipmentDetail;