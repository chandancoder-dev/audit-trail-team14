const Event = require('../models/Event');
const ShipmentView = require('../projections/ShipmentView');
const { project } = require('../projections/projectionBuilder');

const POLL_INTERVAL_MS = parseInt(process.env.PROJECTION_POLL_MS, 10) || 5000;
const MAX_RETRIES      = 3;
const RETRY_DELAY_MS   = 1000;

let isRunning      = false;
let pollTimer      = null;
let lastCaughtUpAt = null;

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function projectWithRetry(event, attempt = 1) {
  try {
    await project(event);
  } catch (err) {
    if (attempt >= MAX_RETRIES) {
      console.error(
        `[ProjectionWorker] Giving up on ${event.eventType} v${event.version} ` +
        `(${event.shipmentId}) after ${MAX_RETRIES} attempts: ${err.message}`
      );
      return;
    }
    const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
    console.warn(`[ProjectionWorker] Retry ${attempt}/${MAX_RETRIES} in ${delay}ms`);
    await sleep(delay);
    await projectWithRetry(event, attempt + 1);
  }
}

// ── Per-shipment sync: replay events beyond each view's lastVersion ───────────
// This is the authoritative catch-up mechanism. It compares each shipment's
// ShipmentView.lastVersion against the event log and replays only the gap, in
// version order. It is idempotent and safe to run repeatedly (used by both
// startup catch-up and the periodic poll), and — unlike a global timestamp
// watermark — it cannot skip events that share the same recordedAt millisecond.
async function syncPendingEvents(label) {
  const shipmentIds = await Event.distinct('shipmentId');

  if (shipmentIds.length === 0) {
    return { processed: 0, upToDate: 0 };
  }

  let processed = 0;
  let upToDate = 0;

  for (const shipmentId of shipmentIds) {
    const view = await ShipmentView.findOne({ shipmentId })
      .select('lastVersion')
      .lean();
    const lastVersion = view ? view.lastVersion : 0;

    const pendingEvents = await Event.find({
      shipmentId,
      version: { $gt: lastVersion },
    })
      .sort({ version: 1 })
      .lean();

    if (pendingEvents.length === 0) {
      upToDate++;
      continue;
    }

    console.log(
      `[ProjectionWorker] ${shipmentId}: replaying ${pendingEvents.length} event(s) from v${lastVersion + 1}`
    );

    for (const event of pendingEvents) {
      await projectWithRetry(event);
      processed++;
    }
  }

  return { processed, upToDate };
}

// ── Catch-up: replay missed events on startup ─────────────────────────────────

async function catchUp() {
  console.log('[ProjectionWorker] Starting catch-up...');

  const { processed, upToDate } = await syncPendingEvents('catch-up');

  lastCaughtUpAt = new Date();
  console.log(
    `[ProjectionWorker] Catch-up done — processed: ${processed}, already up-to-date: ${upToDate}`
  );
}

// ── Poll: pick up new events every N seconds ──────────────────────────────────
// Uses per-shipment lastVersion gap detection (not a global timestamp), so
// concurrent or same-millisecond events are never skipped.

async function poll() {
  if (!lastCaughtUpAt) {
    await catchUp();
    return;
  }

  const { processed } = await syncPendingEvents('poll');

  if (processed > 0) {
    console.log(`[ProjectionWorker] Poll: projected ${processed} new event(s)`);
    lastCaughtUpAt = new Date();
  }
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

async function start() {
  if (isRunning) {
    console.warn('[ProjectionWorker] Already running.');
    return;
  }

  isRunning = true;
  console.log(`[ProjectionWorker] Starting (poll every ${POLL_INTERVAL_MS}ms)`);

  try {
    await catchUp();
  } catch (err) {
    console.error('[ProjectionWorker] Catch-up error:', err.message);
  }

  pollTimer = setInterval(async () => {
    try {
      await poll();
    } catch (err) {
      console.error('[ProjectionWorker] Poll error:', err.message);
    }
  }, POLL_INTERVAL_MS);

  console.log('[ProjectionWorker] Running.');
}

function stop() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  isRunning = false;
  console.log('[ProjectionWorker] Stopped.');
}

async function rebuild() {
  console.log('[ProjectionWorker] Rebuilding all projections...');
  await ShipmentView.deleteMany({});
  lastCaughtUpAt = null;
  await catchUp();
  console.log('[ProjectionWorker] Rebuild complete.');
}

module.exports = { start, stop, rebuild };
