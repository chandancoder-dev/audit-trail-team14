// Rebuild all ShipmentView projections from scratch by replaying the Event Store.
// Run: node server/scripts/rebuildProjections.js

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const ShipmentView = require('../src/projections/ShipmentView');
const { rebuild } = require('../src/projections/projectionWorker');

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected:', mongoose.connection.name);

  const start = Date.now();
  console.log('Rebuilding projections...');

  // Wipe ShipmentViews and replay every event
  await rebuild();

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  const count = await ShipmentView.countDocuments();

  console.log(`Done in ${elapsed}s — ${count} ShipmentView(s) rebuilt`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Rebuild failed:', err.message);
  process.exit(1);
});
