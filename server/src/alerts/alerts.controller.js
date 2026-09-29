const Alert = require('./Alert');

// GET /api/queries/alerts — paginated, filterable alerts for the current user.
// Query params: severity, shipmentId, acknowledged, page, limit.
const getAlerts = async (req, res) => {
  try {
    const {
      severity,
      shipmentId,
      acknowledged,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    filter.userId = req.id;
    if (severity) {
      const validSeverities = ['critical', 'warning', 'info'];
      if (!validSeverities.includes(severity)) {
        return res.status(400).json({
          message: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`,
        });
      }
      filter.severity = severity;
    }

    if (shipmentId) {
      filter.shipmentId = shipmentId;
    }

    if (acknowledged !== undefined) {
      filter.acknowledged = acknowledged === 'true';
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [alerts, total] = await Promise.all([
      Alert.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Alert.countDocuments(filter),
    ]);

    return res.status(200).json({
      alerts,
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error('[AlertsController] Error fetching alerts:', error);
    return res.status(500).json({ message: 'Failed to fetch alerts' });
  }
};

// GET /api/queries/shipment/:id/alerts — a shipment's alerts, newest first.
// Query params: severity, acknowledged.
const getShipmentAlerts = async (req, res) => {
  try {
    const { id } = req.params;
    const { severity, acknowledged } = req.query;

    const filter = {userId : req.id ,shipmentId: id };

    if (severity) {
      const validSeverities = ['critical', 'warning', 'info'];
      if (!validSeverities.includes(severity)) {
        return res.status(400).json({
          message: `Invalid severity. Must be one of: ${validSeverities.join(', ')}`,
        });
      }
      filter.severity = severity;
    }

    if (acknowledged !== undefined) {
      filter.acknowledged = acknowledged === 'true';
    }

    const alerts = await Alert.find(filter)
      .sort({ timestamp: -1 })
      .lean();

    return res.status(200).json({ shipmentId: id, alerts, total: alerts.length });
  } catch (error) {
    console.error('[AlertsController] Error fetching shipment alerts:', error);
    return res.status(500).json({ message: 'Failed to fetch shipment alerts' });
  }
};

module.exports = { getAlerts, getShipmentAlerts };
