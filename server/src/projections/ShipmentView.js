const mongoose = require('mongoose');

/**
 * ShipmentView — Read Model (Projection)
 *
 * This is the denormalized read model built by replaying events from the Event Store.
 * It provides fast query access for the dashboard and shipment detail pages.
 *
 * Updated by the projection builder whenever a new event is appended.
 * Never written to directly by command handlers (CQRS separation).
 */
const shipmentViewSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['created', 'in_transit', 'arrived', 'alert'],
      default: 'created',
      index: true,
    },
    currentLocation: {
      type: String,
      default: '',
    },
    origin: {
      type: String,
      default: '',
    },
    destination: {
      type: String,
      default: '',
    },
    lastTemperature: {
      type: Number,
      default: null,
    },
    eventCount: {
      type: Number,
      default: 0,
    },
    lastEventAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: 'shipment_views',
  }
);

// Compound index for dashboard queries (status + last event time)
shipmentViewSchema.index({ status: 1, lastEventAt: -1 });

// Text index for search by shipmentId or location
shipmentViewSchema.index({ shipmentId: 'text', currentLocation: 'text', origin: 'text', destination: 'text' });

const ShipmentView = mongoose.model('ShipmentView', shipmentViewSchema);

module.exports = ShipmentView;
