const { getTimeline } = require("./eventStore");

async function getShipmentTimeline(req, res) {
  try {
    const events = await getTimeline(req.params.id);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getShipmentTimeline };