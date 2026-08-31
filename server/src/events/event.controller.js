const { appendEvent, getTimeline } = require("./eventStore");

async function getShipmentTimeline(req, res) {
  try {
    const events = await getTimeline(req.params.id);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createEvent(req, res) {
  try {
    const event = await appendEvent({
      shipmentId: req.params.id,
      ...req.body,
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getShipmentTimeline, createEvent };