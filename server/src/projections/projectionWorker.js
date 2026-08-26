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

// ── Catch-up: replay missed events on startup ─────────────────────────────────

async function catchUp() {
  console.log('[ProjectionWorker] Starting catch-up...');

  const shipmentIds = await Event.distinct('shipmentId');

  if (shipmentIds.length === 0) {
    console.log('[ProjectionWorker] No events to catch up on.');
    return;
  }

  let processed = 0;
  let upToDate  = 0;

  for (const shipmentId of shipmentIds) {
    const view = await ShipmentView.findOne({ shipmentId }).select('lastVersion').lean();
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

  lastCaughtUpAt = new Date();
  console.log(`[ProjectionWorker] Catch-up done — processed: ${processed}, already up-to-date: ${upToDate}`);
}

// ── Poll: pick up new events every N seconds ──────────────────────────────────

async function poll() {
  if (!lastCaughtUpAt) {
    await catchUp();
    return;
  }

  const newEvents = await Event.find({
    recordedAt: { $gt: lastCaughtUpAt },
  })
    .sort({ recordedAt: 1, version: 1 })
    .lean();

  if (newEvents.length === 0) return;

  console.log(`[ProjectionWorker] Poll: ${newEvents.length} new event(s)`);

  for (const event of newEvents) {
    await projectWithRetry(event);
  }

  lastCaughtUpAt = newEvents[newEvents.length - 1].recordedAt;
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
