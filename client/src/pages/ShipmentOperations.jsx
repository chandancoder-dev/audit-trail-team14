function ShipmentOperations() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1
            style={{
              color: "#1E3A8A",
              fontSize: "32px",
              marginBottom: "8px",
            }}
          >
            Shipment Operations
          </h1>

          <p
            style={{
              color: "#64748B",
              fontSize: "15px",
            }}
          >
            Create and manage shipment lifecycle events.
          </p>
        </div>

        {/* Create Shipment Card */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
          }}
        >
          <h2
            style={{
              color: "#1E293B",
              fontSize: "22px",
              marginBottom: "8px",
            }}
          >
            Create Shipment
          </h2>

          <p
            style={{
              color: "#64748B",
              fontSize: "14px",
              marginBottom: "25px",
            }}
          >
            Start a new shipment and create its initial event stream.
          </p>

          {/* Shipment ID */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#334155",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Shipment ID
            </label>

            <input
              type="text"
              placeholder="Enter shipment ID"
              style={{
                width: "100%",
                padding: "13px 14px",
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
                color: "#1E293B",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Origin */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#334155",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Origin
            </label>

            <input
              type="text"
              placeholder="Enter origin location"
              style={{
                width: "100%",
                padding: "13px 14px",
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
                color: "#1E293B",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Destination */}
          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                color: "#334155",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Destination
            </label>

            <input
              type="text"
              placeholder="Enter destination location"
              style={{
                width: "100%",
                padding: "13px 14px",
                border: "1px solid #CBD5E1",
                borderRadius: "8px",
                outline: "none",
                fontSize: "15px",
                color: "#1E293B",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Create Button */}
          <button
            type="button"
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(37, 99, 235, 0.18)",
            }}
          >
            Create Shipment
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShipmentOperations;