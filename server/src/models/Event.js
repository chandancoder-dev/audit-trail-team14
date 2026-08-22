const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
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

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
