import "../styles/historicalState.css";

function HistoricalState() {
  return (
    <div className="historical-page">
      <header className="history-header">
        <div>
          <p className="page-label">AUDIT TRAIL</p>
          <h1>Historical State</h1>
          <p className="page-description">
            View the reconstructed shipment state at any point in time.
          </p>
        </div>

        <div className="shipment-badge">
          Shipment ID: <strong>SHIP-001</strong>
        </div>
      </header>

      <main className="history-content">
        <section className="state-card">
          <div className="section-heading">
            <div>
              <h2>Reconstructed State</h2>
              <p>Shipment state at the selected point in time.</p>
            </div>

            <span className="status-badge">IN TRANSIT</span>
          </div>

          <div className="state-grid">
            <div className="state-item">
              <span>Selected Time</span>
              <strong>12:30</strong>
            </div>

            <div className="state-item">
              <span>Status</span>
              <strong>In Transit</strong>
            </div>

            <div className="state-item">
              <span>Location</span>
              <strong>Port A</strong>
            </div>

            <div className="state-item">
              <span>Temperature</span>
              <strong>22°C</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HistoricalState;