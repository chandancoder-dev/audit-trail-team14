import { useState } from "react";

function ShipmentOperations() {
  const [shipmentId, setShipmentId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateShipment = () => {
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

    setSuccessMessage(
      `Shipment ${shipmentId} is ready to be created.`
    );
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

        {/* Create Shipment Card */}
        <div className="rounded-2xl border border-[#3F3F46] bg-[#27272A] p-8 shadow-lg">

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
      </div>
    </div>
  );
}

export default ShipmentOperations;