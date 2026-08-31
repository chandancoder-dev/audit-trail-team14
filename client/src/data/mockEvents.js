// Mock data shaped exactly like what GET /api/shipments/:id/timeline
// will eventually return. Build and demo the UI against this first —
// swap in the real fetch later without changing any component code.

export const mockEvents = [
  {
    _id: 'evt_1',
    eventType: 'SHIPMENT_CREATED',
    version: 1,
    payload: { origin: 'Los Angeles, CA', destination: 'Denver, CO' },
    metadata: { source: 'web-portal', createdBy: 'user_482' },
    recordedAt: '2026-08-10T09:15:00Z',
  },
  {
    _id: 'evt_2',
    eventType: 'LOCATION_UPDATED',
    version: 2,
    payload: { lat: 34.05, lng: -118.24, label: 'LA Distribution Center' },
    metadata: { source: 'gps-tracker', deviceId: 'trk_9981' },
    recordedAt: '2026-08-11T14:32:00Z',
  },
  {
    _id: 'evt_3',
    eventType: 'TEMPERATURE_RECORDED',
    version: 3,
    payload: { temperature: 4.2, unit: 'C' },
    metadata: { source: 'sensor', sensorId: 'sn_221' },
    recordedAt: '2026-08-12T02:00:00Z',
  },
  {
    _id: 'evt_4',
    eventType: 'SHIPMENT_EXCEPTION',
    version: 4,
    payload: { reason: 'Temperature threshold exceeded', temperature: 9.8 },
    metadata: { source: 'sensor', severity: 'high' },
    recordedAt: '2026-08-12T02:45:00Z',
  },
  {
    _id: 'evt_5',
    eventType: 'STATUS_CHANGED',
    version: 5,
    payload: { from: 'IN_TRANSIT', to: 'DELAYED' },
    metadata: { source: 'ops-team', changedBy: 'user_117' },
    recordedAt: '2026-08-12T03:10:00Z',
  },
  {
    _id: 'evt_6',
    eventType: 'SHIPMENT_DELIVERED',
    version: 6,
    payload: { deliveredTo: 'Denver, CO', signedBy: 'J. Alvarez' },
    metadata: { source: 'driver-app' },
    recordedAt: '2026-08-13T16:20:00Z',
  },
];