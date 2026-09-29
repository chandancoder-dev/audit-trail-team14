// Immutability proof — demonstrates the Event Store is append-only.
// Attempts UPDATE and DELETE operations on the events collection and shows
// that each one is rejected by the model-level immutability guard.
//
// Run: node scripts/proveImmutability.js   (or: npm run audit:immutability)

require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Event = require("../src/models/Event");

function pass(msg) {
  console.log(`  \u2705 REJECTED (as expected): ${msg}`);
}
function fail(msg) {
  console.log(`  \u274C ALLOWED (immutability broken!): ${msg}`);
}

async function expectRejection(label, fn) {
  try {
    await fn();
    fail(label);
    return false;
  } catch (err) {
    pass(`${label} \u2014 ${err.message}`);
    return true;
  }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected:", mongoose.connection.name);

  // Find any existing event to target (read-only lookup).
  const sample = await Event.findOne().lean();

  if (!sample) {
    console.log(
      "\nNo events in the store yet. Create a shipment first, then re-run."
    );
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(
    `\nTargeting event: shipment=${sample.shipmentId} v${sample.version} type=${sample.eventType}\n`
  );

  console.log("Attempting mutations on the append-only Event Store:\n");

  const results = [];

  results.push(
    await expectRejection("Event.updateOne()", () =>
      Event.updateOne({ _id: sample._id }, { $set: { eventType: "HACKED" } })
    )
  );

  results.push(
    await expectRejection("Event.findOneAndUpdate()", () =>
      Event.findOneAndUpdate({ _id: sample._id }, { version: 999 })
    )
  );

  results.push(
    await expectRejection("Event.deleteOne()", () =>
      Event.deleteOne({ _id: sample._id })
    )
  );

  results.push(
    await expectRejection("Event.deleteMany()", () =>
      Event.deleteMany({ shipmentId: sample.shipmentId })
    )
  );

  results.push(
    await expectRejection("doc.save() on existing event", async () => {
      const doc = await Event.findById(sample._id);
      doc.eventType = "TAMPERED";
      return doc.save();
    })
  );

  // Confirm the event is untouched.
  const after = await Event.findById(sample._id).lean();
  const untouched =
    after &&
    after.eventType === sample.eventType &&
    after.version === sample.version;

  console.log("\n\u2500\u2500 Result \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");
  const allRejected = results.every(Boolean);
  console.log(`  Mutations attempted : ${results.length}`);
  console.log(`  All rejected        : ${allRejected ? "YES \u2705" : "NO \u274C"}`);
  console.log(`  Event unchanged     : ${untouched ? "YES \u2705" : "NO \u274C"}`);
  console.log("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500");

  await mongoose.disconnect();
  process.exit(allRejected && untouched ? 0 : 1);
}

main().catch((err) => {
  console.error("Proof script failed:", err.message);
  process.exit(1);
});
