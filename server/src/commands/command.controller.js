const Event = require("../models/Event");

const commandHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Command controller is working",
  });
};

const createShipment = async (req, res) => {
  try {
    const { shipmentId, origin, destination } = req.body;

    if (!shipmentId || !origin || !destination) {
      return res.status(400).json({
        status: "error",
        message: "shipmentId, origin and destination are required",
      });
    }

    const existingEvent = await Event.findOne({ shipmentId });

    if (existingEvent) {
      return res.status(409).json({
        status: "error",
        message: "Shipment already exists",
      });
    }

    const event = await Event.create({
      shipmentId,
      eventType: "SHIPMENT_CREATED",
      version: 1,
      payload: {
        origin,
        destination,
      },
      metadata: {
        source: "command-api",
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Shipment created successfully",
      event,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create shipment",
    });
  }
};

module.exports = {
  commandHealth,
  createShipment,
};