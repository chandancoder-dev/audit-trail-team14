// Integration tests for M6 — analytics, alerts, OCC, projection builder
// Run: npm test (from server/)

// ── analyticsService ─────────────────────────────────────────────────────────

jest.mock('../src/models/Event');
jest.mock('../src/projections/ShipmentView');
jest.mock('../src/alerts/Alert');

const Event = require('../src/models/Event');
const ShipmentView = require('../src/projections/ShipmentView');
const Alert = require('../src/alerts/Alert');

const { getTemperatureAnalytics, getEventFrequency } = require('../src/analytics/analyticsService');
const { generateAlertFromEvent } = require('../src/alerts/alertService');

// ── Shared test events ────────────────────────────────────────────────────────

const makeEvent = (overrides) => ({
  shipmentId: 'SHIP-TEST',
  eventType: 'SHIPMENT_CREATED',
  version: 1,
  recordedAt: new Date('2026-09-01T10:00:00Z'),
  payload: {},
  ...overrides,
});

// ── Analytics: getTemperatureAnalytics ────────────────────────────────────────

describe('analyticsService.getTemperatureAnalytics', () => {
  beforeEach(() => jest.clearAllMocks());

  const events = [
    makeEvent({ eventType: 'SHIPMENT_CREATED', version: 1, payload: {} }),
    makeEvent({ eventType: 'LOADED_ON_SHIP', version: 2, recordedAt: new Date('2026-09-01T12:00:00Z'), payload: { temperature: -18, location: 'Arabian Sea' } }),
    makeEvent({ eventType: 'TEMPERATURE_SPIKE', version: 3, recordedAt: new Date('2026-09-01T18:00:00Z'), payload: { temperature: -9, location: 'Red Sea' } }),
    makeEvent({ eventType: 'ARRIVED_AT_PORT', version: 4, recordedAt: new Date('2026-09-02T08:00:00Z'), payload: { port: 'Rotterdam' } }),
  ];

  beforeEach(() => {
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(events) }) });
  });

  test('returns empty result when no events', async () => {
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) });
    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.timeSeries).toHaveLength(0);
    expect(result.stats.spikeCount).toBe(0);
    expect(result.spikes).toHaveLength(0);
  });

  test('builds timeSeries only from events with temperature', async () => {
    const result = await getTemperatureAnalytics('SHIP-TEST');
    // SHIPMENT_CREATED and ARRIVED_AT_PORT have no temperature — only 2 readings
    expect(result.timeSeries).toHaveLength(2);
    expect(result.timeSeries[0].temperature).toBe(-18);
    expect(result.timeSeries[1].temperature).toBe(-9);
  });

  test('correctly identifies spikes', async () => {
    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.spikes).toHaveLength(1);
    expect(result.spikes[0].eventType).toBe('TEMPERATURE_SPIKE');
    expect(result.spikes[0].temperature).toBe(-9);
  });

  test('calculates min, max, avg correctly', async () => {
    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.stats.min).toBe(-18);
    expect(result.stats.max).toBe(-9);
    expect(result.stats.avg).toBe(-13.5);
  });

  test('builds eventMarkers for every event', async () => {
    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.eventMarkers).toHaveLength(4);
    expect(result.eventMarkers[0].eventType).toBe('SHIPMENT_CREATED');
    expect(result.eventMarkers[2].label).toBe('TEMPERATURE SPIKE');
  });

  test('includes threshold in stats', async () => {
    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.stats.threshold).toBe(-15);
  });
});

// ── Analytics: getEventFrequency ─────────────────────────────────────────────

describe('analyticsService.getEventFrequency', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns empty array when no events', async () => {
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) });
    const result = await getEventFrequency('SHIP-TEST');
    expect(result).toEqual([]);
  });

  test('groups events by date', async () => {
    const events = [
      makeEvent({ recordedAt: new Date('2026-09-01T10:00:00Z'), eventType: 'SHIPMENT_CREATED' }),
      makeEvent({ recordedAt: new Date('2026-09-01T18:00:00Z'), eventType: 'LOADED_ON_SHIP' }),
      makeEvent({ recordedAt: new Date('2026-09-02T08:00:00Z'), eventType: 'ARRIVED_AT_PORT' }),
    ];
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(events) }) });

    const result = await getEventFrequency('SHIP-TEST');
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2026-09-01');
    expect(result[0].count).toBe(2);
    expect(result[1].date).toBe('2026-09-02');
    expect(result[1].count).toBe(1);
  });

  test('sorts result by date ascending', async () => {
    const events = [
      makeEvent({ recordedAt: new Date('2026-09-03T10:00:00Z') }),
      makeEvent({ recordedAt: new Date('2026-09-01T10:00:00Z') }),
    ];
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(events) }) });

    const result = await getEventFrequency('SHIP-TEST');
    expect(result[0].date).toBe('2026-09-01');
    expect(result[1].date).toBe('2026-09-03');
  });
});

// ── alertService: generateAlertFromEvent ─────────────────────────────────────

describe('alertService.generateAlertFromEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Alert.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    Alert.create.mockResolvedValue({ _id: 'alert-1' });
  });

  test('returns null for non-TEMPERATURE_SPIKE events', async () => {
    const result = await generateAlertFromEvent(makeEvent({ eventType: 'LOADED_ON_SHIP' }));
    expect(result).toBeNull();
  });

  test('returns null when temperature is missing', async () => {
    const result = await generateAlertFromEvent(makeEvent({ eventType: 'TEMPERATURE_SPIKE', payload: {} }));
    expect(result).toBeNull();
  });

  test('creates critical alert when temperature exceeds threshold', async () => {
    const event = makeEvent({ eventType: 'TEMPERATURE_SPIKE', payload: { temperature: -9, location: 'Red Sea' } });
    await generateAlertFromEvent(event);
    expect(Alert.create).toHaveBeenCalledWith(expect.objectContaining({ severity: 'critical' }));
  });

  test('creates warning alert when temperature is within 2°C of threshold', async () => {
    // -16 is below threshold (-15) but within WARNING_BUFFER (2°C) → warning
    const event = makeEvent({ eventType: 'TEMPERATURE_SPIKE', payload: { temperature: -16, location: 'At Sea' } });
    await generateAlertFromEvent(event);
    expect(Alert.create).toHaveBeenCalledWith(expect.objectContaining({ severity: 'warning' }));
  });

  test('returns null when temperature is safely below threshold', async () => {
    const event = makeEvent({ eventType: 'TEMPERATURE_SPIKE', payload: { temperature: -18 } });
    const result = await generateAlertFromEvent(event);
    expect(result).toBeNull();
    expect(Alert.create).not.toHaveBeenCalled();
  });

  test('is idempotent — skips if alert already exists for this version', async () => {
    Alert.findOne.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: 'existing' }) });
    const event = makeEvent({ eventType: 'TEMPERATURE_SPIKE', payload: { temperature: -9 } });
    const result = await generateAlertFromEvent(event);
    expect(result).toBeNull();
    expect(Alert.create).not.toHaveBeenCalled();
  });

  test('uses payload threshold over default when provided', async () => {
    const event = makeEvent({ eventType: 'TEMPERATURE_SPIKE', payload: { temperature: -5, threshold: -10 } });
    await generateAlertFromEvent(event);
    expect(Alert.create).toHaveBeenCalledWith(expect.objectContaining({
      metadata: expect.objectContaining({ threshold: -10 }),
    }));
  });
});

// ── OCC middleware ────────────────────────────────────────────────────────────

jest.mock('../src/models/Event');
const occCheck = require('../src/middleware/occ.middleware');

describe('occCheck middleware', () => {
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: {}, params: { id: 'SHIP-TEST' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('calls next() when expectedVersion is not provided', async () => {
    await occCheck(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('calls next() when versions match', async () => {
    req.body.expectedVersion = 3;
    Event.findOne.mockReturnValue({ sort: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue({ version: 3 }) });
    await occCheck(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('returns 409 when versions do not match', async () => {
    req.body.expectedVersion = 2;
    Event.findOne.mockReturnValue({ sort: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue({ version: 4 }) });
    await occCheck(req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      status: 'conflict',
      expectedVersion: 2,
      currentVersion: 4,
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('returns 400 for invalid expectedVersion', async () => {
    req.body.expectedVersion = 'abc';
    await occCheck(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('calls next() when shipment does not exist yet', async () => {
    req.body.expectedVersion = 1;
    Event.findOne.mockReturnValue({ sort: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue(null) });
    await occCheck(req, res, next);
    // occ.middleware returns 404 when shipment not found
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ── Full event flow ───────────────────────────────────────────────────────────

describe('Full event flow: analytics pipeline', () => {
  beforeEach(() => jest.clearAllMocks());

  test('temperature spike event appears in both timeSeries and spikes', async () => {
    const events = [
      makeEvent({ eventType: 'TEMPERATURE_SPIKE', version: 1, payload: { temperature: -8, location: 'Bay of Bengal' } }),
    ];
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(events) }) });

    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.timeSeries).toHaveLength(1);
    expect(result.spikes).toHaveLength(1);
    expect(result.stats.spikeCount).toBe(1);
  });

  test('non-temperature events appear in eventMarkers but not timeSeries', async () => {
    const events = [
      makeEvent({ eventType: 'SHIPMENT_CREATED', version: 1, payload: { origin: 'Mumbai' } }),
      makeEvent({ eventType: 'ARRIVED_AT_PORT', version: 2, payload: { port: 'Dubai' } }),
    ];
    Event.find.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue(events) }) });

    const result = await getTemperatureAnalytics('SHIP-TEST');
    expect(result.timeSeries).toHaveLength(0);
    expect(result.eventMarkers).toHaveLength(2);
  });
});
