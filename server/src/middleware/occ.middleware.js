const Event = require('../models/Event');

async function occCheck(req, res, next) {
  const { expectedVersion } = req.body;

  if (expectedVersion === undefined || expectedVersion === null) {
    return next();
  }

  const shipmentId = req.params.id;
  const expected = Number(expectedVersion);

  if (isNaN(expected)) {
    return res.status(400).json({
      status: 'error',
      message: 'expectedVersion must be a number',
    });
  }

  try {
    const lastEvent = await Event
      .findOne({ shipmentId })
      .sort({ version: -1 })
      .select('version')
      .lean();

    if (!lastEvent) return next();

    const currentVersion = lastEvent.version;

    if (currentVersion !== expected) {
      return res.status(409).json({
        status: 'conflict',
        message: `Shipment has been modified. Expected v${expected} but current is v${currentVersion}. Please refresh and try again.`,
        expectedVersion: expected,
        currentVersion,
      });
    }

    next();
  } catch (err) {
    console.error('[OCC] Version check error:', err.message);
    next();
  }
}

module.exports = occCheck;
