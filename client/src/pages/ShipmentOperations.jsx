import { commandAPI } from "../services/api";
import { useState } from "react";

function ShipmentOperations() {
  // -----------------------------
  // Create Shipment State
  // -----------------------------
  const [shipmentId, setShipmentId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // -----------------------------
  // Move Shipment State
  // -----------------------------
  const [moveShipmentId, setMoveShipmentId] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [moveDestination, setMoveDestination] = useState("");

  const [moveErrors, setMoveErrors] = useState({});
  const [moveSuccessMessage, setMoveSuccessMessage] = useState("");

  // -----------------------------
  // Temperature Event State
  // -----------------------------
  const [temperatureShipmentId, setTemperatureShipmentId] = useState("");
  const [temperature, setTemperature] = useState("");

  const [temperatureErrors, setTemperatureErrors] = useState({});
  const [temperatureSuccessMessage, setTemperatureSuccessMessage] =
    useState("");

  // -----------------------------
  // Arrival Event State
  // -----------------------------
  const [arrivalShipmentId, setArrivalShipmentId] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");

  const [arrivalErrors, setArrivalErrors] = useState({});
  const [arrivalSuccessMessage, setArrivalSuccessMessage] =
    useState("");

  // -----------------------------
  // Create Shipment
  // -----------------------------
const handleCreateShipment = async () => {
  setErrors({});
  setSuccessMessage("");

  const newErrors = {};

  if (shipmentId.trim() === "") {
    newErrors.shipmentId = "Shipment ID is required";
  }

  if (origin.trim() === "") {
    newErrors.origin = "Origin is required";
  }

  if (destination.trim() === "") {
    newErrors.destination = "Destination is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const response = await commandAPI.createShipment({
      shipmentId: shipmentId.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
    });

    setSuccessMessage(
      response.message || "Shipment created successfully."
    );
  } catch (error) {
    setErrors({
      shipmentId: error.message || "Failed to create shipment.",
    });
  }
};

  // -----------------------------
  // Move Shipment
  // -----------------------------
  const handleMoveShipment = async () => {
  setMoveErrors({});
  setMoveSuccessMessage("");

  const newErrors = {};

  if (moveShipmentId.trim() === "") {
    newErrors.moveShipmentId = "Shipment ID is required";
  }

  if (currentLocation.trim() === "") {
    newErrors.currentLocation = "Current location is required";
  }

  if (moveDestination.trim() === "") {
    newErrors.moveDestination = "Destination is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setMoveErrors(newErrors);
    return;
  }

  try {
    const response = await commandAPI.moveShipment(
      moveShipmentId.trim(),
      {
        location: moveDestination.trim(),
      }
    );

    setMoveSuccessMessage(
      response.message || "Shipment moved successfully."
    );
  } catch (error) {
    setMoveErrors({
      moveShipmentId: error.message || "Failed to move shipment.",
    });
  }
};

  // -----------------------------
  // Temperature Event
  // -----------------------------
  const handleTemperatureEvent = async () => {
  setTemperatureErrors({});
  setTemperatureSuccessMessage("");

  const newErrors = {};

  if (temperatureShipmentId.trim() === "") {
    newErrors.temperatureShipmentId = "Shipment ID is required";
  }

  if (temperature.trim() === "") {
    newErrors.temperature = "Temperature is required";
  } else if (isNaN(Number(temperature))) {
    newErrors.temperature = "Temperature must be a valid number";
  }

  if (Object.keys(newErrors).length > 0) {
    setTemperatureErrors(newErrors);
    return;
  }

  try {
    const response = await commandAPI.recordTemperature(
      temperatureShipmentId.trim(),
      {
        temperature: Number(temperature),
      }
    );

    setTemperatureSuccessMessage(
      response.message || "Temperature recorded successfully."
    );
  } catch (error) {
    setTemperatureErrors({
      temperatureShipmentId:
        error.message || "Failed to record temperature event.",
    });
  }
};

  // -----------------------------
  // Arrival Event
  // -----------------------------
  const handleArrivalEvent = async () => {
  setArrivalErrors({});
  setArrivalSuccessMessage("");

  const newErrors = {};

  if (arrivalShipmentId.trim() === "") {
    newErrors.arrivalShipmentId = "Shipment ID is required";
  }

  if (arrivalLocation.trim() === "") {
    newErrors.arrivalLocation = "Arrival location is required";
  }

  if (Object.keys(newErrors).length > 0) {
    setArrivalErrors(newErrors);
    return;
  }

  try {
    const response = await commandAPI.arriveShipment(
      arrivalShipmentId.trim(),
      {
        port: arrivalLocation.trim(),
        location: arrivalLocation.trim(),
      }
    );

    setArrivalSuccessMessage(
      response.message || "Shipment arrival recorded successfully."
    );
  } catch (error) {
    setArrivalErrors({
      arrivalShipmentId:
        error.message || "Failed to record arrival event.",
    });
  }
};

  return (
    <div className="min-h-screen bg-[#18181B] px-5 py-10 font-sans">
      <div className="mx-auto max-w-4xl">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#FAFAFA]">
            Shipment Operations
          </h1>

          <p className="text-sm text-[#A1A1AA]">
            Create and manage shipment lifecycle events.
          </p>
        </div>

        {/* =====================================================
            CREATE SHIPMENT
        ====================================================== */}
        <div className="mb-8 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 shadow-lg">

          <h2 className="mb-2 text-2xl font-semibold text-[#FAFAFA]">
            Create Shipment
          </h2>

          <p className="mb-7 text-sm text-[#A1A1AA]">
            Start a new shipment and create its initial event stream.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E]">
              {successMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Shipment ID
            </label>

            <input
              type="text"
              placeholder="Enter shipment ID"
              value={shipmentId}
              onChange={(e) => {
                setShipmentId(e.target.value);

                if (errors.shipmentId) {
                  setErrors((previous) => ({
                    ...previous,
                    shipmentId: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                errors.shipmentId
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {errors.shipmentId && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {errors.shipmentId}
              </p>
            )}
          </div>

          {/* Origin */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Origin
            </label>

            <input
              type="text"
              placeholder="Enter origin location"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);

                if (errors.origin) {
                  setErrors((previous) => ({
                    ...previous,
                    origin: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                errors.origin
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {errors.origin && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {errors.origin}
              </p>
            )}
          </div>

          {/* Destination */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Destination
            </label>

            <input
              type="text"
              placeholder="Enter destination location"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);

                if (errors.destination) {
                  setErrors((previous) => ({
                    ...previous,
                    destination: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                errors.destination
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {errors.destination && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {errors.destination}
              </p>
            )}
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={handleCreateShipment}
            className="w-full rounded-lg bg-[#3B82F6] px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
          >
            Create Shipment
          </button>
        </div>

        {/* =====================================================
            MOVE SHIPMENT
        ====================================================== */}
        <div className="mb-8 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 shadow-lg">

          <h2 className="mb-2 text-2xl font-semibold text-[#FAFAFA]">
            Move Shipment
          </h2>

          <p className="mb-7 text-sm text-[#A1A1AA]">
            Move an existing shipment to its next lifecycle stage.
          </p>

          {/* Success Message */}
          {moveSuccessMessage && (
            <div className="mb-6 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E]">
              {moveSuccessMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Shipment ID
            </label>

            <input
              type="text"
              placeholder="Enter shipment ID"
              value={moveShipmentId}
              onChange={(e) => {
                setMoveShipmentId(e.target.value);

                if (moveErrors.moveShipmentId) {
                  setMoveErrors((previous) => ({
                    ...previous,
                    moveShipmentId: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                moveErrors.moveShipmentId
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {moveErrors.moveShipmentId && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {moveErrors.moveShipmentId}
              </p>
            )}
          </div>

          {/* Current Location */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Current Location
            </label>

            <input
              type="text"
              placeholder="Enter current location"
              value={currentLocation}
              onChange={(e) => {
                setCurrentLocation(e.target.value);

                if (moveErrors.currentLocation) {
                  setMoveErrors((previous) => ({
                    ...previous,
                    currentLocation: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                moveErrors.currentLocation
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {moveErrors.currentLocation && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {moveErrors.currentLocation}
              </p>
            )}
          </div>

          {/* Destination */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Destination
            </label>

            <input
              type="text"
              placeholder="Enter destination"
              value={moveDestination}
              onChange={(e) => {
                setMoveDestination(e.target.value);

                if (moveErrors.moveDestination) {
                  setMoveErrors((previous) => ({
                    ...previous,
                    moveDestination: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                moveErrors.moveDestination
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {moveErrors.moveDestination && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {moveErrors.moveDestination}
              </p>
            )}
          </div>

          {/* Move Button */}
          <button
            type="button"
            onClick={handleMoveShipment}
            className="w-full rounded-lg bg-[#3B82F6] px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
          >
            Move Shipment
          </button>
        </div>

        {/* =====================================================
            TEMPERATURE EVENT
        ====================================================== */}
        <div className="mb-8 rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 shadow-lg">

          <h2 className="mb-2 text-2xl font-semibold text-[#FAFAFA]">
            Temperature Event
          </h2>

          <p className="mb-7 text-sm text-[#A1A1AA]">
            Record a temperature event for an existing shipment.
          </p>

          {/* Success Message */}
          {temperatureSuccessMessage && (
            <div className="mb-6 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E]">
              {temperatureSuccessMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Shipment ID
            </label>

            <input
              type="text"
              placeholder="Enter shipment ID"
              value={temperatureShipmentId}
              onChange={(e) => {
                setTemperatureShipmentId(e.target.value);

                if (temperatureErrors.temperatureShipmentId) {
                  setTemperatureErrors((previous) => ({
                    ...previous,
                    temperatureShipmentId: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                temperatureErrors.temperatureShipmentId
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {temperatureErrors.temperatureShipmentId && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {temperatureErrors.temperatureShipmentId}
              </p>
            )}
          </div>

          {/* Temperature */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Temperature (°C)
            </label>

            <input
              type="number"
              step="0.1"
              placeholder="Enter temperature"
              value={temperature}
              onChange={(e) => {
                setTemperature(e.target.value);

                if (temperatureErrors.temperature) {
                  setTemperatureErrors((previous) => ({
                    ...previous,
                    temperature: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                temperatureErrors.temperature
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {temperatureErrors.temperature && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {temperatureErrors.temperature}
              </p>
            )}
          </div>

          {/* Temperature Button */}
          <button
            type="button"
            onClick={handleTemperatureEvent}
            className="w-full rounded-lg bg-[#3B82F6] px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
          >
            Record Temperature Event
          </button>
        </div>

        {/* =====================================================
            ARRIVAL EVENT
        ====================================================== */}
        <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 shadow-lg">

          <h2 className="mb-2 text-2xl font-semibold text-[#FAFAFA]">
            Arrival Event
          </h2>

          <p className="mb-7 text-sm text-[#A1A1AA]">
            Record the arrival of an existing shipment.
          </p>

          {/* Success Message */}
          {arrivalSuccessMessage && (
            <div className="mb-6 rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#22C55E]">
              {arrivalSuccessMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Shipment ID
            </label>

            <input
              type="text"
              placeholder="Enter shipment ID"
              value={arrivalShipmentId}
              onChange={(e) => {
                setArrivalShipmentId(e.target.value);

                if (arrivalErrors.arrivalShipmentId) {
                  setArrivalErrors((previous) => ({
                    ...previous,
                    arrivalShipmentId: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                arrivalErrors.arrivalShipmentId
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {arrivalErrors.arrivalShipmentId && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {arrivalErrors.arrivalShipmentId}
              </p>
            )}
          </div>

          {/* Arrival Location */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-[#D4D4D8]">
              Arrival Location
            </label>

            <input
              type="text"
              placeholder="Enter arrival location"
              value={arrivalLocation}
              onChange={(e) => {
                setArrivalLocation(e.target.value);

                if (arrivalErrors.arrivalLocation) {
                  setArrivalErrors((previous) => ({
                    ...previous,
                    arrivalLocation: "",
                  }));
                }
              }}
              className={`w-full rounded-lg border bg-[#202023] px-4 py-3 text-sm text-[#FAFAFA] outline-none placeholder:text-[#71717A] focus:ring-2 focus:ring-[#3B82F6]/20 ${
                arrivalErrors.arrivalLocation
                  ? "border-[#EF4444] focus:border-[#EF4444]"
                  : "border-[#3F3F46] focus:border-[#3B82F6]"
              }`}
            />

            {arrivalErrors.arrivalLocation && (
              <p className="mt-2 text-sm text-[#EF4444]">
                {arrivalErrors.arrivalLocation}
              </p>
            )}
          </div>

          {/* Arrival Button */}
          <button
            type="button"
            onClick={handleArrivalEvent}
            className="w-full rounded-lg bg-[#3B82F6] px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40"
          >
            Record Arrival
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShipmentOperations;