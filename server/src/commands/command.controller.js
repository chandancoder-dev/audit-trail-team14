const Event = require("../models/Event");

const commandHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Command controller is working",
  });
};

const createShipment = async (req, res) => {
  try {
    console.log(req.body);
    const {id, shipmentId, origin, destination } = req.body;

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
      userId : req.id,
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

const moveShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, temperature } = req.body;

    if (!location) {
      return res.status(400).json({
        status: "error",
        message: "location is required",
      });
    }

    const lastEvent = await Event.findOne({ shipmentId: id }).sort({
      version: -1,
    });

    if (!lastEvent) {
      return res.status(404).json({
        status: "error",
        message: "Shipment not found",
      });
    }

    const nextVersion = lastEvent.version + 1;

    const event = await Event.create({
      shipmentId: id,
      eventType: "LOADED_ON_SHIP",
      version: nextVersion,
      payload: {
        status: "In Transit",
        location,
        ...(temperature !== undefined && { temperature }),
      },
      metadata: {
        source: "command-api",
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Shipment moved successfully",
      event,
    });
  } catch (error) {
    console.error("Error moving shipment:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to move shipment",
    });
  }
};

const recordTemperature = async (req, res) => {
  try {
    const { id } = req.params;
    const { temperature, location } = req.body;

    if (temperature === undefined || temperature === null) {
      return res.status(400).json({
        status: "error",
        message: "temperature is required",
      });
    }

    const lastEvent = await Event.findOne({ shipmentId: id }).sort({
      version: -1,
    });

    if (!lastEvent) {
      return res.status(404).json({
        status: "error",
        message: "Shipment not found",
      });
    }

    const nextVersion = lastEvent.version + 1;

    const event = await Event.create({
      shipmentId: id,
      eventType: "TEMPERATURE_SPIKE",
      version: nextVersion,
      payload: {
        status: "Temperature Alert",
        location: location || "At Sea",
        temperature: Number(temperature),
      },
      metadata: {
        source: "command-api",
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Temperature recorded successfully",
      event,
    });
  } catch (error) {
    console.error("Error recording temperature:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to record temperature",
    });
  }
};

const arriveShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { port, location } = req.body;

    if (!port) {
      return res.status(400).json({
        status: "error",
        message: "port is required",
      });
    }

    const lastEvent = await Event.findOne({ shipmentId: id }).sort({
      version: -1,
    });

    if (!lastEvent) {
      return res.status(404).json({
        status: "error",
        message: "Shipment not found",
      });
    }

    const nextVersion = lastEvent.version + 1;

    const event = await Event.create({
      shipmentId: id,
      eventType: "ARRIVED_AT_PORT",
      version: nextVersion,
      payload: {
        port,
        location: location || port,
      },
      metadata: {
        source: "command-api",
      },
    });

    return res.status(201).json({
      status: "success",
      message: "Shipment arrival recorded successfully",
      event,
    });
  } catch (error) {
    console.error("Error recording shipment arrival:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to record shipment arrival",
    });
  }
};

module.exports = {
  commandHealth,
  createShipment,
  moveShipment,
  recordTemperature,
  arriveShipment,
};