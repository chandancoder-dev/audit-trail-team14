const Event = require("../models/Event");

async function appendEvent({ shipmentId, eventType, payload, metadata }) {
  const lastEvent = await Event.findOne({ shipmentId }).sort({ version: -1 });
  const nextVersion = lastEvent ? lastEvent.version + 1 : 1;

  const event = new Event({
    shipmentId,
    eventType,
    version: nextVersion,
    payload,
    metadata,
    recordedAt: new Date(),
  });

  return event.save();
}

async function getEvents(shipmentId) {
  return Event.find({ shipmentId }).sort({ version: 1 });
}

async function getTimeline(shipmentId) {
  return Event.find({ shipmentId }).sort({ version: -1 });
}

module.exports = { appendEvent, getEvents, getTimeline };