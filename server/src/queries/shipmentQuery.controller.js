const Event = require("../models/Event");
const { getHistoricalState } = require("./historicalState.service");

const getShipmentEvents = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await Event.find({
      shipmentId: id,
    })
      .sort({ recordedAt: 1 })
      .lean();

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching shipment events:", error);

    res.status(500).json({
      message: "Failed to fetch shipment events",
    });
  }
};

const getShipmentHistoricalState = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const state = await getHistoricalState(id, date);

    if (!state) {
      return res.status(404).json({
        message: "No events found for this shipment at the selected time",
      });
    }

    res.status(200).json(state);
  } catch (error) {
    console.error("Error reconstructing historical state:", error);

    if (error.message === "Invalid date") {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    res.status(500).json({
      message: "Failed to reconstruct historical state",
    });
  }
};

const getShipment = async (req, res) => {
  try {
    const { id } = req.params;

    const latestEvent = await Event.findOne({
      shipmentId: id,
    })
      .sort({ version: -1 })
      .select("shipmentId version eventType recordedAt payload")
      .lean();

    if (!latestEvent) {
      return res.status(404).json({
        message: "Shipment not found",
      });
    }

    return res.status(200).json({
      shipmentId: latestEvent.shipmentId,
      version: latestEvent.version,
      eventType: latestEvent.eventType,
      recordedAt: latestEvent.recordedAt,
      payload: latestEvent.payload,
    });
  } catch (error) {
    console.error("Error fetching shipment:", error);

    return res.status(500).json({
      message: "Failed to fetch shipment",
    });
  }
};

const getShipments = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const skip = (page - 1) * limit;

    const shipments = await Event.find({ userid: req.body.id })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      shipments,
    });
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = {
  getShipmentEvents,
  getShipmentHistoricalState,
  getShipment,
  getShipments,
};
