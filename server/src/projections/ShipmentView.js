const mongoose = require('mongoose');

// ShipmentView — denormalized read model built by replaying events.
// CQRS rule: only the projection builder writes here; commands/queries never do.
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

// upsert() — create or update a ShipmentView by (userId, shipmentId).
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

// recordEvent() — atomically increment eventCount and update tracking fields.
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

// paginate() — filtered, paginated list sorted by most recent activity.
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
