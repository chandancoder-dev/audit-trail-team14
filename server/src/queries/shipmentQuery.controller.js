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

module.exports = {
  getShipmentEvents,
  getShipmentHistoricalState,
};
