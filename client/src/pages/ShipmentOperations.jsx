import { commandAPI, queryAPI } from "../services/api";
import { useEffect, useState } from "react";

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
  const [moveVersion, setMoveVersion] = useState(null);

  // -----------------------------
  // Temperature Event State
  // -----------------------------
  const [temperatureShipmentId, setTemperatureShipmentId] = useState("");
  const [temperature, setTemperature] = useState("");

  const [temperatureErrors, setTemperatureErrors] = useState({});
  const [temperatureSuccessMessage, setTemperatureSuccessMessage] =
    useState("");
  const [temperatureVersion, setTemperatureVersion] = useState(null);

  // -----------------------------
  // Arrival Event State
  // -----------------------------
  const [arrivalShipmentId, setArrivalShipmentId] = useState("");
  const [arrivalLocation, setArrivalLocation] = useState("");

  const [arrivalErrors, setArrivalErrors] = useState({});
  const [arrivalSuccessMessage, setArrivalSuccessMessage] = useState("");
  const [arrivalVersion, setArrivalVersion] = useState(null);

  // -----------------------------
  // OCC - Fetch Move Shipment Version
  // -----------------------------
  useEffect(() => {
    const fetchMoveVersion = async () => {
      const id = moveShipmentId.trim();

      if (!id) {
        setMoveVersion(null);
        return;
      }

      try {
        const shipment = await queryAPI.getShipment(id);
        setMoveVersion(shipment.version);
      } catch (error) {
        setMoveVersion(null);
      }
    };

    fetchMoveVersion();
  }, [moveShipmentId]);

  // -----------------------------
  // OCC - Fetch Temperature Version
  // -----------------------------
  useEffect(() => {
    const fetchTemperatureVersion = async () => {
      const id = temperatureShipmentId.trim();

      if (!id) {
        setTemperatureVersion(null);
        return;
      }

      try {
        const shipment = await queryAPI.getShipment(id);
        setTemperatureVersion(shipment.version);
      } catch (error) {
        setTemperatureVersion(null);
      }
    };

    fetchTemperatureVersion();
  }, [temperatureShipmentId]);

  // -----------------------------
  // OCC - Fetch Arrival Version
  // -----------------------------
  useEffect(() => {
    const fetchArrivalVersion = async () => {
      const id = arrivalShipmentId.trim();

      if (!id) {
        setArrivalVersion(null);
        return;
      }

      try {
        const shipment = await queryAPI.getShipment(id);
        setArrivalVersion(shipment.version);
      } catch (error) {
        setArrivalVersion(null);
      }
    };

    fetchArrivalVersion();
  }, [arrivalShipmentId]);

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

      setSuccessMessage(response.message || "Shipment created successfully.");
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

    if (moveVersion === null) {
      setMoveErrors({
        moveShipmentId:
          "Unable to get the current shipment version. Please check the shipment ID.",
      });
      return;
    }

    try {
      const response = await commandAPI.moveShipment(moveShipmentId.trim(), {
        location: moveDestination.trim(),
        expectedVersion: moveVersion,
      });

      setMoveSuccessMessage(response.message || "Shipment moved successfully.");

      const updatedShipment = await queryAPI.getShipment(moveShipmentId.trim());

      setMoveVersion(updatedShipment.version);
    } catch (error) {
      if (error.status === 409) {
        setMoveErrors({
          moveShipmentId:
            error.message ||
            "Shipment has been modified. Please refresh and try again.",
        });

        if (error.currentVersion !== undefined) {
          setMoveVersion(error.currentVersion);
        }

        return;
      }

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

    if (temperatureVersion === null) {
      setTemperatureErrors({
        temperatureShipmentId:
          "Unable to get the current shipment version. Please check the shipment ID.",
      });
      return;
    }

    try {
      const response = await commandAPI.recordTemperature(
        temperatureShipmentId.trim(),
        {
          temperature: Number(temperature),
          expectedVersion: temperatureVersion,
        },
      );

      setTemperatureSuccessMessage(
        response.message || "Temperature recorded successfully.",
      );

      const updatedShipment = await queryAPI.getShipment(
        temperatureShipmentId.trim(),
      );

      setTemperatureVersion(updatedShipment.version);
    } catch (error) {
      if (error.status === 409) {
        setTemperatureErrors({
          temperatureShipmentId:
            error.message ||
            "Shipment has been modified. Please refresh and try again.",
        });

        if (error.currentVersion !== undefined) {
          setTemperatureVersion(error.currentVersion);
        }

        return;
      }

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

    if (arrivalVersion === null) {
      setArrivalErrors({
        arrivalShipmentId:
          "Unable to get the current shipment version. Please check the shipment ID.",
      });
      return;
    }

    try {
      const response = await commandAPI.arriveShipment(
        arrivalShipmentId.trim(),
        {
          port: arrivalLocation.trim(),
          location: arrivalLocation.trim(),
          expectedVersion: arrivalVersion,
        },
      );

      setArrivalSuccessMessage(
        response.message || "Shipment arrival recorded successfully.",
      );

      const updatedShipment = await queryAPI.getShipment(
        arrivalShipmentId.trim(),
      );

      setArrivalVersion(updatedShipment.version);
    } catch (error) {
      if (error.status === 409) {
        setArrivalErrors({
          arrivalShipmentId:
            error.message ||
            "Shipment has been modified. Please refresh and try again.",
        });

        if (error.currentVersion !== undefined) {
          setArrivalVersion(error.currentVersion);
        }

        return;
      }

      setArrivalErrors({
        arrivalShipmentId: error.message || "Failed to record arrival event.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary px-5 py-10 font-sans">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-text-heading]">
            Shipment Operations
          </h1>

          <p className="text-sm text-text-secondary">
            Create and manage shipment lifecycle events.
          </p>
        </div>

        {/* =====================================================
            CREATE SHIPMENT
        ====================================================== */}
        <div className="mb-8 rounded-2xl border border-border bg-bg-card p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-text-heading">
            Create Shipment
          </h2>

          <p className="mb-7 text-sm text-text-secondary">
            Start a new shipment and create its initial event stream.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              {successMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-input outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-ring/20 ${
                errors.shipmentId
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {errors.shipmentId && (
              <p className="mt-2 text-sm text-error">{errors.shipmentId}</p>
            )}
          </div>

          {/* Origin */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-input outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-ring/20 ${
                errors.origin
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {errors.origin && (
              <p className="mt-2 text-sm text-error">{errors.origin}</p>
            )}
          </div>

          {/* Destination */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
              Destination
            </label>

            <input
              type="text"
              placeholder="Enter destination"
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-input outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-ring/20 ${
                errors.destination
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {errors.destination && (
              <p className="mt-2 text-sm text-error">{errors.destination}</p>
            )}
          </div>

          {/* Create Button */}
          <button
            type="button"
            onClick={handleCreateShipment}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Create Shipment
          </button>
        </div>

        {/* =====================================================
            MOVE SHIPMENT
        ====================================================== */}
        <div className="mb-8 rounded-2xl border border-border bg-bg-card p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-text-heading">
            Move Shipment
          </h2>

          <p className="mb-7 text-sm text-text-heading">
            Move an existing shipment to its next lifecycle stage.
          </p>

          {/* Success Message */}
          {moveSuccessMessage && (
            <div className="mb-6 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              {moveSuccessMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                moveErrors.moveShipmentId
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {moveErrors.moveShipmentId && (
              <p className="mt-2 text-sm text-error">
                {moveErrors.moveShipmentId}
              </p>
            )}
          </div>

          {/* Current Location */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                moveErrors.currentLocation
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {moveErrors.currentLocation && (
              <p className="mt-2 text-sm text-error">
                {moveErrors.currentLocation}
              </p>
            )}
          </div>

          {/* Destination */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                moveErrors.moveDestination
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {moveErrors.moveDestination && (
              <p className="mt-2 text-sm text-error">
                {moveErrors.moveDestination}
              </p>
            )}
          </div>

          {/* Current Version */}
          {moveVersion !== null && (
            <p className="mb-5 text-sm text-text-secondary">
              Expected shipment version:{" "}
              <span className="font-semibold text-text-heading">
                v{moveVersion}
              </span>
            </p>
          )}

          {/* Move Button */}
          <button
            type="button"
            onClick={handleMoveShipment}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Move Shipment
          </button>
        </div>

        {/* =====================================================
            TEMPERATURE EVENT
        ====================================================== */}
        <div className="mb-8 rounded-2xl border border-border bg-bg-card p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-text-heading">
            Temperature Event
          </h2>

          <p className="mb-7 text-sm text-text-secondary">
            Record a temperature event for an existing shipment.
          </p>

          {/* Success Message */}
          {temperatureSuccessMessage && (
            <div className="mb-6 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              {temperatureSuccessMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                temperatureErrors.temperatureShipmentId
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {temperatureErrors.temperatureShipmentId && (
              <p className="mt-2 text-sm text-error">
                {temperatureErrors.temperatureShipmentId}
              </p>
            )}
          </div>

          {/* Temperature */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                temperatureErrors.temperature
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {temperatureErrors.temperature && (
              <p className="mt-2 text-sm text-error">
                {temperatureErrors.temperature}
              </p>
            )}
          </div>

          {/* Current Version */}
          {temperatureVersion !== null && (
            <p className="mb-5 text-sm text-text-secondary">
              Expected shipment version:{" "}
              <span className="font-semibold text-text-heading">
                v{temperatureVersion}
              </span>
            </p>
          )}

          {/* Temperature Button */}
          <button
            type="button"
            onClick={handleTemperatureEvent}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Record Temperature Event
          </button>
        </div>

        {/* =====================================================
            ARRIVAL EVENT
        ====================================================== */}
        <div className="rounded-2xl border border-border bg-bg-card p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-semibold text-text-heading">
            Arrival Event
          </h2>

          <p className="mb-7 text-sm text-text-placeholder">
            Record the arrival of an existing shipment.
          </p>

          {/* Success Message */}
          {arrivalSuccessMessage && (
            <div className="mb-6 rounded-lg border border-success/40 bg-success/10 px-4 py-3 text-sm text-success">
              {arrivalSuccessMessage}
            </div>
          )}

          {/* Shipment ID */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                arrivalErrors.arrivalShipmentId
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {arrivalErrors.arrivalShipmentId && (
              <p className="mt-2 text-sm text-error">
                {arrivalErrors.arrivalShipmentId}
              </p>
            )}
          </div>

          {/* Arrival Location */}
          <div className="mb-7">
            <label className="mb-2 block text-sm font-semibold text-text-normal">
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
              className={`w-full rounded-lg border bg-bg-input px-4 py-3 text-sm text-text-heading outline-none placeholder:text-text-placeholder focus:ring-2 focus:ring-primary/20 ${
                arrivalErrors.arrivalLocation
                  ? "border-border-error focus:border-border-error"
                  : "border-border focus:border-ring"
              }`}
            />

            {arrivalErrors.arrivalLocation && (
              <p className="mt-2 text-sm text-error">
                {arrivalErrors.arrivalLocation}
              </p>
            )}
          </div>

          {/* Current Version */}
          {arrivalVersion !== null && (
            <p className="mb-5 text-sm text-text-secondary">
              Expected shipment version:{" "}
              <span className="font-semibold text-text-heading">
                v{arrivalVersion}
              </span>
            </p>
          )}

          {/* Arrival Button */}
          <button
            type="button"
            onClick={handleArrivalEvent}
            className="w-full rounded-lg bg-primary px-4 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            Record Arrival
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShipmentOperations;
