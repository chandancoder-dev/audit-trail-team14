const mongoose = require('mongoose');

/**
 * ShipmentView — Read Model (Projection)
 *
 * Denormalized read model built by replaying events from the Event Store.
 * Provides fast query access without replaying all events on every read.
 *
 * CQRS rule: only the projection builder writes to this collection.
 * Command handlers and query handlers must never write directly.
 *
 * Aligned with Event schema fields:
 *   shipmentId   → event.shipmentId
 *   lastVersion  → event.version
 *   lastEventAt  → event.recordedAt
 *   currentLocation, vessel, port → event.payload.*
 *   lastTemperature, temperatureThreshold → event.payload.temperature / threshold
 */
const shipmentViewSchema = new mongoose.Schema(
  {
    userId:{
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true,
      index : true,
    },
    // ── Identity ──────────────────────────────────────────────────────────────
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ── Lifecycle Status ──────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['created', 'in_transit', 'arrived', 'alert'],
      default: 'created',
      index: true,
    },

    // ── Location ──────────────────────────────────────────────────────────────
    origin: {
      type: String,
      default: '',
    },
    destination: {
      type: String,
      default: '',
    },
    currentLocation: {
      type: String,
      default: '',
    },
    vessel: {
      type: String,
      default: '',
    },
    port: {
      type: String,
      default: '',
    },

    // ── Temperature ───────────────────────────────────────────────────────────
    lastTemperature: {
      type: Number,
      default: null,
    },
    temperatureThreshold: {
      type: Number,
      default: null,
    },
    hasTemperatureAlert: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ── Event Tracking ────────────────────────────────────────────────────────
    eventCount: {
      type: Number,
      default: 0,
    },
    lastEventType: {
      type: String,
      default: null,
    },
    lastEventAt: {
      type: Date,
      default: null,
    },

    // ── Projection Tracking ───────────────────────────────────────────────────
    // Mirrors event.version — lets projection builder detect and skip already-processed events
    lastVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,           // Mongoose manages createdAt + updatedAt automatically
    collection: 'shipment_views',
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────

// Dashboard list: filter by status, sorted by most recent activity
shipmentViewSchema.index({ status: 1, lastEventAt: -1 });

// Alert dashboard: find all shipments with active temperature alerts
shipmentViewSchema.index({ hasTemperatureAlert: 1, lastEventAt: -1 });

// Full-text search: search by ID, location, origin, destination
shipmentViewSchema.index(
  { shipmentId: 'text', currentLocation: 'text', origin: 'text', destination: 'text' },
  { name: 'shipment_text_search' }
);

// ── Static Methods ────────────────────────────────────────────────────────────

/**
 * upsert()
 * Create or update a ShipmentView document by shipmentId.
 * Used by projection builder for all event types.
 *@param {string} userId
 * @param {string} shipmentId
 * @param {Object} fields - Fields to merge into the document
 * @returns {Promise<ShipmentView>}
 */
shipmentViewSchema.statics.upsert = function (userId,shipmentId, fields) {
  return this.findOneAndUpdate(
    {userId, shipmentId},
    { $set: {
        userId,
        shipmentId,
        ...fields
    } 
  },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

/**
 * recordEvent()
 * Atomically increment eventCount and update tracking fields.
 * Called on every new event processed by the projection builder.
 * @param {string} userId
 * @param {string} shipmentId
 * @param {string} eventType
 * @param {Date} recordedAt
 * @param {number} version
 * @returns {Promise<ShipmentView>}
 */
shipmentViewSchema.statics.recordEvent = function (userId,shipmentId, eventType, recordedAt, version) {
  return this.findOneAndUpdate(
    {userId, shipmentId },
    {
      $inc: { eventCount: 1 },
      $set: {
        lastEventType: eventType,
        lastEventAt: recordedAt,
        lastVersion: version,
      },
    },
    { new: true }
  );
};

/**
 * paginate()
 * Get a paginated, filtered list of shipments sorted by most recent activity.
 * Used by GET /api/queries/shipments for the dashboard list.
 *
 * @param {Object} filter - Mongoose filter (e.g. { status: 'alert' })
 * @param {number} page
 * @param {number} limit
 * @returns {Promise<{ shipments, total, page, limit, pages }>}
 */
shipmentViewSchema.statics.paginate = async function (filter = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const [shipments, total] = await Promise.all([
    this.find(filter).sort({ lastEventAt: -1 }).skip(skip).limit(limit).lean(),
    this.countDocuments(filter),
  ]);
  return { shipments, total, page, limit, pages: Math.ceil(total / limit) };
};

const ShipmentView = mongoose.model('ShipmentView', shipmentViewSchema);

module.exports = ShipmentView;
