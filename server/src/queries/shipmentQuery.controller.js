const Event = require("../models/Event");

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

module.exports = {
  getShipmentEvents,
};
