/**
 * seedDemo — populates two demo accounts with rich, presentation-ready data.
 *
 *   Accounts:  sumit@gmail.com / chandan@gmail.com   (password: password123)
 *
 * For each account it creates several shipments with full event histories:
 *   SHIPMENT_CREATED -> LOADED_ON_SHIP -> TEMPERATURE_SPIKE(s) -> ARRIVED_AT_PORT
 * so that every page looks good:
 *   - Dashboard: mix of created / in_transit / arrived / alert statuses + counters
 *   - Timeline / Audit Timeline: multi-event chronological histories
 *   - Analytics: multiple temperature readings (charts) + spikes (markers)
 *   - Alerts: both CRITICAL and WARNING alerts generated from spikes
 *
 * Events are inserted via the append-only store, then the projection builder and
 * alert service are run over them — exactly like production — so read models and
 * alerts are consistent.
 *
 * Run:  node scripts/seedDemo.js
 *       node scripts/seedDemo.js --wipe   (also clears existing demo data first)
 */

require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../src/models/User");
const Event = require("../src/models/Event");
const ShipmentView = require("../src/projections/ShipmentView");
const Alert = require("../src/alerts/Alert");
const { project } = require("../src/projections/projectionBuilder");

const WIPE = process.argv.includes("--wipe");

const DEMO_PASSWORD = "password123";

const ACCOUNTS = [
  { name: "Sumit Verma", username: "sumit", email: "sumit@gmail.com" },
  { name: "Chandan K R", username: "chandan", email: "chandan@gmail.com" },
];

// Helper: build a date N days/hours ago from a base, so timelines look real.
function daysAgo(days, hoursOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() + hoursOffset, 0, 0, 0);
  return d;
}

/**
 * Returns an ordered array of event definitions for one shipment.
 * `scenario` controls how far the shipment progresses and what alerts fire.
 */
function buildShipmentEvents(prefix, idx, scenario) {
  const shipmentId = `${prefix}-${String(idx).padStart(3, "0")}`;
  const startDay = 12 - idx; // spread creation dates out
  const events = [];
  let version = 0;

  const push = (eventType, payload, recordedAt) => {
    version += 1;
    events.push({
      shipmentId,
      eventType,
      version,
      payload,
      metadata: { source: "seed", correlationId: `seed-${shipmentId}` },
      recordedAt,
    });
  };

  const routes = [
    { origin: "Mumbai", destination: "Rotterdam", vessel: "MV Nordic Star" },
    { origin: "Shanghai", destination: "Los Angeles", vessel: "MV Pacific Dawn" },
    { origin: "Singapore", destination: "Hamburg", vessel: "MV Orient Breeze" },
    { origin: "Dubai", destination: "New York", vessel: "MV Gulf Runner" },
  ];
  const r = routes[idx % routes.length];

  // 1) Created
  push(
    "SHIPMENT_CREATED",
    { origin: r.origin, destination: r.destination, location: r.origin, temperature: -20 },
    daysAgo(startDay, 0)
  );

  if (scenario === "created") return { shipmentId, events };

  // 2) Loaded on ship (in transit) with a healthy cold-chain temperature
  push(
    "LOADED_ON_SHIP",
    { location: `${r.origin} Port`, vessel: r.vessel, temperature: -19 },
    daysAgo(startDay, 4)
  );

  if (scenario === "in_transit") return { shipmentId, events };

  // 3) A couple of normal temperature readings to make charts rich
  push(
    "TEMPERATURE_SPIKE",
    { location: "Open Sea", temperature: -18, threshold: -15 },
    daysAgo(startDay - 1, 2)
  );

  if (scenario === "warning" || scenario === "critical") {
    // WARNING alert: within 2C of threshold but still below it (-16 > -17, <= -15)
    push(
      "TEMPERATURE_SPIKE",
      { location: "Red Sea", temperature: -16, threshold: -15 },
      daysAgo(startDay - 2, 6)
    );
  }

  if (scenario === "critical" || scenario === "alert") {
    // CRITICAL alert: warmer than threshold (-8 > -15)
    push(
      "TEMPERATURE_SPIKE",
      { location: "Suez Canal", temperature: -8, threshold: -15 },
      daysAgo(startDay - 3, 3)
    );
  }

  if (scenario === "alert") return { shipmentId, events }; // stays in alert state

  // 4) Arrived at destination port
  push(
    "ARRIVED_AT_PORT",
    { port: r.destination, location: r.destination },
    daysAgo(startDay - 4, 5)
  );

  return { shipmentId, events };
}

async function seedAccount(account) {
  console.log(`\n── Seeding ${account.email} ──────────────────`);

  // Upsert the user
  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);
  let user = await User.findOne({ email: account.email });
  if (!user) {
    user = await User.create({
      name: account.name,
      username: account.username,
      email: account.email,
      password: hashed,
    });
    console.log(`  Created user ${account.email}`);
  } else {
    user.password = hashed;
    user.name = account.name;
    user.username = account.username;
    await user.save();
    console.log(`  Updated existing user ${account.email}`);
  }

  const userId = user._id;
  const prefix = account.username === "sumit" ? "SHIP" : "CTNR";

  // A varied set of scenarios so every status/alert type is represented.
  const scenarios = [
    "arrived",   // full lifecycle, ends arrived
    "critical",  // has warning + critical alerts, then arrives
    "alert",     // stays in alert state (critical), good for Alerts page
    "in_transit",// mid-journey
    "warning",   // warning alert then arrives
    "created",   // just created
  ];

  const counters = { total: 0, in_transit: 0, arrived: 0, alert: 0 };
  let eventCount = 0;
  let alertCount = 0;

  for (let i = 1; i <= scenarios.length; i++) {
    const scenario = scenarios[i - 1];
    const { shipmentId, events } = buildShipmentEvents(prefix, i, scenario);

    // Insert each event through the append-only store, then project it.
    for (const ev of events) {
      const created = await Event.create({ userId, ...ev });
      await project({ ...created.toObject() });
      eventCount += 1;
    }

    // Update simple user counters for the dashboard summary cards.
    counters.total += 1;
    const last = events[events.length - 1].eventType;
    if (last === "ARRIVED_AT_PORT") counters.arrived += 1;
    else if (last === "TEMPERATURE_SPIKE") counters.alert += 1;
    else if (last === "LOADED_ON_SHIP") counters.in_transit += 1;

    console.log(`  ${shipmentId.padEnd(10)} (${scenario}) — ${events.length} events`);
  }

  // Persist the summary counters on the user.
  await User.findByIdAndUpdate(userId, { $set: counters });

  alertCount = await Alert.countDocuments({ userId });
  console.log(
    `  Totals → shipments: ${counters.total}, events: ${eventCount}, alerts: ${alertCount}`
  );

  return { userId, ...counters, events: eventCount, alerts: alertCount };
}

async function wipeDemoData() {
  console.log("Wiping existing demo data for the two accounts...");
  const users = await User.find({
    email: { $in: ACCOUNTS.map((a) => a.email) },
  }).lean();
  const userIds = users.map((u) => u._id);

  if (userIds.length) {
    // Delete via native collection to bypass the append-only guard on events.
    await mongoose.connection.collection("events").deleteMany({
      userId: { $in: userIds },
    });
    await ShipmentView.deleteMany({ userId: { $in: userIds } });
    await Alert.deleteMany({ userId: { $in: userIds } });
    console.log(`  Cleared events / views / alerts for ${userIds.length} user(s).`);
  }
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected:", mongoose.connection.name);

  if (WIPE) {
    await wipeDemoData();
  }

  for (const account of ACCOUNTS) {
    await seedAccount(account);
  }

  console.log("\n════════════════════════════════════════");
  console.log("Demo seed complete. Login credentials:");
  ACCOUNTS.forEach((a) => console.log(`  ${a.email}  /  ${DEMO_PASSWORD}`));
  console.log("════════════════════════════════════════");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
