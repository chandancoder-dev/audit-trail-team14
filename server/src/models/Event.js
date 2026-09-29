const mongoose = require("mongoose");
const appendOnly = require("./plugins/appendOnly");

const eventSchema = new mongoose.Schema(
  {
    userId:{
       type : mongoose.Schema.Types.ObjectId,
       ref : "User",
       required : true,
       index : true,
    },
    shipmentId: {
      type: String,
      required: true,
      index: true,
    },

    eventType: {
      type: String,
      required: true,
      index: true,
    },

    version: {
      type: Number,
      required: true,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "events",
  },
);

eventSchema.index({ shipmentId: 1, recordedAt: 1 });
eventSchema.index({ shipmentId: 1, version: 1 }, { unique: true });

// ── Immutability Guard (application layer) ─────────────────────────────────────
// The event store is append-only. This plugin rejects every update/replace/delete
// path at the Mongoose layer. For DB-layer enforcement (native driver / mongosh),
// pair with the least-privilege role from scripts/setupAppendOnlyRole.js.
eventSchema.plugin(appendOnly);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
