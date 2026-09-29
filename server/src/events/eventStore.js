const Event = require("../models/Event");

async function appendEvent({ shipmentId, eventType, userId, payload, metadata }) {
  const lastEvent = await Event.findOne({ shipmentId }).sort({ version: -1 });
  const nextVersion = lastEvent ? lastEvent.version + 1 : 1;

  const event = new Event({
    shipmentId,
    eventType,
    userId,
    version: nextVersion,
    payload,
    metadata,
    recordedAt: new Date(),
  });

  return event.save();
}

async function getTimeline(shipmentId) {
  return Event.find({ shipmentId }).sort({ version: -1 });
}

module.exports = { appendEvent, getTimeline };