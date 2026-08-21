const SEVERITY_CONFIG = {
  critical: {
    icon: '🔴',
    label: 'Critical',
    borderColor: 'border-l-error',
    badgeClass: 'bg-red-500/15 text-error',
  },
  warning: {
    icon: '🟡',
    label: 'Warning',
    borderColor: 'border-l-warning',
    badgeClass: 'bg-yellow-500/15 text-warning',
  },
  info: {
    icon: '🔵',
    label: 'Info',
    borderColor: 'border-l-primary',
    badgeClass: 'bg-blue-500/15 text-primary',
  },
};

function AlertCard({ alert }) {
  const { severity, message, timestamp, shipmentId, acknowledged } = alert;
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.info;

  const formattedTime = new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div
      className={`bg-bg-card border border-border rounded-lg p-4 border-l-4 ${config.borderColor} transition-all hover:border-border/80 ${acknowledged ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left — icon + content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">
            {config.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-text-heading font-medium text-sm leading-snug">
              {message}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Severity badge */}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded ${config.badgeClass}`}
              >
                {config.label}
              </span>

              {/* Timestamp */}
              <span className="text-xs text-text-secondary">{formattedTime}</span>

              {/* Shipment link */}
              {shipmentId && (
                <a
                  href={`/shipment/${shipmentId}`}
                  className="text-xs font-mono text-primary hover:text-primary-hover transition-colors"
                >
                  {shipmentId} →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right — acknowledged indicator */}
        {acknowledged && (
          <span className="text-xs text-text-placeholder flex-shrink-0" title="Acknowledged">
            ✓ Ack
          </span>
        )}
      </div>
    </div>
  );
}

export default AlertCard;
