const Event = require("../models/Event");

async function occCheck(req, res, next) {
  const { expectedVersion } = req.body;
  const shipmentId = req.params.id;

  // expectedVersion is optional
  if (expectedVersion === undefined || expectedVersion === null) {
    return next();
  }

  // Validate expectedVersion
  const expected = Number(expectedVersion);

  if (!Number.isInteger(expected) || expected < 1) {
    return res.status(400).json({
      status: "error",
      message: "expectedVersion must be a positive integer",
    });
  }

  try {
    const lastEvent = await Event.findOne({ shipmentId })
      .sort({ version: -1 })
      .select("version")
      .lean();

    // Shipment does not exist
    if (!lastEvent) {
      return res.status(404).json({
        status: "error",
        message: "Shipment not found",
      });
    }

    const currentVersion = lastEvent.version;

    // Stale command detected
    if (currentVersion !== expected) {
      return res.status(409).json({
        status: "conflict",
        message: `Shipment has been modified. Expected v${expected} but current is v${currentVersion}. Please refresh and try again.`,
        expectedVersion: expected,
        currentVersion,
      });
    }

    // Version is correct
    next();
  } catch (err) {
    console.error("[OCC] Version check error:", err.message);

    return res.status(500).json({
      status: "error",
      message: "Failed to verify shipment version",
    });
  }
}

module.exports = occCheck;