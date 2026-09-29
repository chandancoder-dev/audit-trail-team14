// Benchmark: compares event-replay query time vs read-model (ShipmentView) query time.
// Run: node server/scripts/benchmark.js

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Event = require('../src/models/Event');
const ShipmentView = require('../src/projections/ShipmentView');
const { reconstructState } = require('../src/queries/historicalState.service');

const RUNS = 5; // number of timed iterations per approach

async function timeIt(label, fn) {
  const times = [];
  for (let i = 0; i < RUNS; i++) {
    const t = Date.now();
    await fn();
    times.push(Date.now() - t);
  }
  const avg = (times.reduce((a, b) => a + b, 0) / RUNS).toFixed(1);
  const min = Math.min(...times);
  const max = Math.max(...times);
  console.log(`  ${label.padEnd(30)} avg: ${avg}ms  min: ${min}ms  max: ${max}ms`);
  return Number(avg);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected:', mongoose.connection.name);

  // Get all shipment IDs
  const shipmentIds = await Event.distinct('shipmentId');

  if (shipmentIds.length === 0) {
    console.log('No shipments in DB — add events first then re-run.');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`\nBenchmarking ${shipmentIds.length} shipment(s), ${RUNS} runs each:\n`);

  // Approach 1: Event Replay — fetch all events AND fold them into current state
  const replayAvg = await timeIt('Event replay (all shipments)', async () => {
    for (const id of shipmentIds) {
      const events = await Event.find({ shipmentId: id }).sort({ version: 1 }).lean();
      // Reconstruct state — this is the real cost the read model avoids.
      reconstructState(events);
    }
  });

  // Approach 2: Read Model — single find per shipment on ShipmentView
  const readModelAvg = await timeIt('Read model (ShipmentView)', async () => {
    for (const id of shipmentIds) {
      await ShipmentView.findOne({ shipmentId: id }).lean();
    }
  });

  // Summary
  const speedup = replayAvg > 0 ? (replayAvg / readModelAvg).toFixed(1) : 'N/A';
  console.log('\n── Summary ──────────────────────────────');
  console.log(`  Event replay avg : ${replayAvg}ms`);
  console.log(`  Read model avg   : ${readModelAvg}ms`);
  console.log(`  Read model is    : ${speedup}x faster`);
  console.log('─────────────────────────────────────────');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Benchmark failed:', err.message);
  process.exit(1);
});
