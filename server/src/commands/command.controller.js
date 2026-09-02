const Event = require("../models/Event");

const commandHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Command controller is working",
  });
};

// Create Shipment
const createShipment = async (req, res) => {
  try {
    console.log(req.body);
    const {id, shipmentId, origin, destination } = req.body;

    // Input validation
    if (!shipmentId || shipmentId.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "shipmentId is required",
      });
    }

    if (!origin || origin.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "origin is required",
      });
    }

    if (!destination || destination.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "destination is required",
      });
    }

    const cleanShipmentId = shipmentId.trim();
    const cleanOrigin = origin.trim();
    const cleanDestination = destination.trim();

    // Business validation - prevent duplicate shipment
    const existingEvent = await Event.findOne({
      shipmentId: cleanShipmentId,
    });

    if (existingEvent) {
      return res.status(409).json({
        status: "error",
        message: "Shipment already exists",
      });
    }

    const event = await Event.create({
      userId : req.id,
      shipmentId: cleanShipmentId,
      eventType: "SHIPMENT_CREATED",
      version: 1,
      payload: {
        origin: cleanOrigin,
        destination: cleanDestination,
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
    console.error("Error creating shipment:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create shipment",
    });
  }
};

// Move Shipment
const moveShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, temperature } = req.body;

    // Shipment ID validation
    if (!id || id.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "shipment ID is required",
      });
    }

    // Location validation
    if (!location || location.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "location is required",
      });
    }

    // Optional temperature validation
    if (
      temperature !== undefined &&
      (temperature === null ||
        temperature === "" ||
        Number.isNaN(Number(temperature)))
    ) {
      return res.status(400).json({
        status: "error",
        message: "temperature must be a valid number",
      });
    }

    const shipmentId = id.trim();
    const cleanLocation = location.trim();

    const lastEvent = await Event.findOne({
      shipmentId,
    }).sort({
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
      shipmentId,
      eventType: "LOADED_ON_SHIP",
      version: nextVersion,
      payload: {
        status: "In Transit",
        location: cleanLocation,
        ...(temperature !== undefined && {
          temperature: Number(temperature),
        }),
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

// Record Temperature Event
const recordTemperature = async (req, res) => {
  try {
    const { id } = req.params;
    const { temperature, location } = req.body;

    // Shipment ID validation
    if (!id || id.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "shipment ID is required",
      });
    }

    // Temperature validation
    if (
      temperature === undefined ||
      temperature === null ||
      temperature === ""
    ) {
      return res.status(400).json({
        status: "400",
        message: "temperature is required",
      });
    }

    if (Number.isNaN(Number(temperature))) {
      return res.status(400).json({
        status: "error",
        message: "temperature must be a valid number",
      });
    }

    const shipmentId = id.trim();

    const lastEvent = await Event.findOne({
      shipmentId,
    }).sort({
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
      shipmentId,
      eventType: "TEMPERATURE_SPIKE",
      version: nextVersion,
      payload: {
        status: "Temperature Alert",
        location:
          location && location.trim() !== ""
            ? location.trim()
            : "At Sea",
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

// Record Arrival Event
const arriveShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { port, location } = req.body;

    // Shipment ID validation
    if (!id || id.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "shipment ID is required",
      });
    }

    // Port validation
    if (!port || port.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "port is required",
      });
    }

    const shipmentId = id.trim();
    const cleanPort = port.trim();

    const lastEvent = await Event.findOne({
      shipmentId,
    }).sort({
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
      shipmentId,
      eventType: "ARRIVED_AT_PORT",
      version: nextVersion,
      payload: {
        port: cleanPort,
        location:
          location && location.trim() !== ""
            ? location.trim()
            : cleanPort,
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