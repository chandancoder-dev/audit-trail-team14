# 20-Day Commit Plan — M6 (Sumit)

## Scope: Analytics + Alerts + Projection Worker + OCC + Integration Testing

---

## Week 1 — Foundation & Mockups (Days 1–5)

| Day | Commit Message | Work |
|-----|---------------|------|
| **Day 1** | `feat: set up shared API service layer and axios config` | Create `client/src/services/api.js` — axios instance, base URL, request/response interceptors, error handler utility |
| **Day 2** | `feat: scaffold analytics page with Recharts setup` | Install Recharts, create `features/analytics/` folder, build `AnalyticsPage.jsx` with layout (placeholder sections for temperature chart, event markers, stats) |
| **Day 3** | `feat: build temperature chart component with mock data` | Create `TemperatureChart.jsx` using Recharts `LineChart` — X axis (time), Y axis (temperature), threshold reference line, mock data |
| **Day 4** | `feat: scaffold alerts page and alert card component` | Create `features/alerts/` folder, `AlertsPage.jsx` with list layout, `AlertCard.jsx` — severity icon, message, timestamp, shipment link |
| **Day 5** | `feat: design projection and analytics backend structure` | Create `server/src/projections/`, `server/src/analytics/`, `server/src/alerts/` folder structure. Add `ShipmentView.js` model schema, analytics service placeholder, alerts model placeholder |

---

## Week 2 — Projection Worker & Analytics API (Days 6–10)

| Day | Commit Message | Work |
|-----|---------------|------|
| **Day 6** | `feat: implement ShipmentView read model schema` | Define Mongoose schema for `ShipmentView` — `shipmentId`, `status`, `currentLocation`, `lastTemperature`, `eventCount`, `lastEventAt`, `createdAt`, `lastVersion`. Add indexes |
| **Day 7** | `feat: implement projection builder with event handlers` | Create `projectionBuilder.js` — handles each event type (CONTAINER_CREATED → create view, LOADED_ON_SHIP → update location/status, TEMPERATURE_SPIKE → update temp/status, ARRIVED_AT_PORT → update status). Each handler updates ShipmentView |
| **Day 8** | `feat: implement projection worker with recovery support` | Create `projectionWorker.js` — processes events sequentially, tracks last processed version, supports catch-up from last known position. Add error handling and retry logic |
| **Day 9** | `feat: implement analytics query API endpoint` | Create `GET /api/queries/shipment/:id/analytics` — fetch temperature events, calculate min/max/avg, return time-series data for chart, event timestamps for markers |
| **Day 10** | `feat: connect analytics page to real API data` | Wire `AnalyticsPage.jsx` to fetch from analytics endpoint, pass real data to `TemperatureChart`, add loading/error states |

---

## Week 3 — Alerts, OCC & Integration (Days 11–15)

| Day | Commit Message | Work |
|-----|---------------|------|
| **Day 11** | `feat: implement alert model and alert generation logic` | Create `Alert.js` model (shipmentId, type, message, severity, timestamp, acknowledged). Create `alertService.js` — generates alerts on TEMPERATURE_SPIKE events, checks threshold violations |
| **Day 12** | `feat: implement alerts query API endpoints` | Create `GET /api/queries/alerts` (all alerts, paginated, filterable by severity/shipment) and `GET /api/queries/shipment/:id/alerts` (shipment-specific alerts) |
| **Day 13** | `feat: connect alerts page to API and add real-time alert display` | Wire `AlertsPage.jsx` to fetch alerts, filter by severity, show shipment link. Add alert count badge to Navbar (shared component update) |
| **Day 14** | `feat: implement OCC version check in command pipeline` | Create `concurrencyCheck.js` middleware — extract `expectedVersion` from command body, query current version from Event Store, reject with 409 if mismatch. Return conflict details in error response |
| **Day 15** | `feat: implement 409 conflict handling on frontend` | Create `ConflictDialog.jsx` component — shown when API returns 409, displays "Data has changed" message with current version info, offers Refresh/Retry options. Integrate with command forms |

---

## Week 4 — Polish, Testing & Final Integration (Days 16–20)

| Day | Commit Message | Work |
|-----|---------------|------|
| **Day 16** | `feat: add event markers and spike annotations to analytics chart` | Add `EventMarkers.jsx` — vertical reference lines on chart at event timestamps, tooltip with event type. Add spike annotation highlighting. Add event frequency bar chart below main chart |
| **Day 17** | `feat: add analytics statistics cards and temperature summary` | Add stats section to analytics page — total events, spike count, max/min/avg temperature, time since last spike. Add threshold violation percentage |
| **Day 18** | `feat: implement projection recovery and replay-vs-readmodel benchmark` | Add `rebuildProjections.js` script — replays all events to rebuild ShipmentView from scratch. Add benchmark utility comparing event-replay query time vs read-model query time. Document results |
| **Day 19** | `feat: add integration and E2E tests for projection, analytics, alerts and OCC` | Write tests — projection correctly updates on each event type, analytics returns correct calculations, alerts generated on spike, OCC rejects stale version (409), full flow test: create → events → projection → analytics → alert |
| **Day 20** | `feat: final polish, error states, responsive design and documentation` | Add loading skeletons to analytics/alerts pages, responsive Tailwind layout, empty states (no alerts, no analytics data), update README with M6 API documentation, ensure all edge cases handled |

---

## Dependencies

### You Need From Others

| You Need | From | When |
|----------|------|------|
| Event Store `append()` and `getEvents()` working | M4 | By Day 6 |
| At least one command working (create/move) | M2 | By Day 7 |
| Shipment Detail page rendered | M3 | By Day 13 |
| Seed data script | Team | By Day 9 |

### You Provide to Others

| You Provide | To | When |
|-------------|-----|------|
| `ShipmentView` read model populated | M1 (Dashboard), M3 (Detail) | Day 8 |
| Shared API service (`api.js`) | All frontend members | Day 1 |
| OCC middleware | M2 (commands) | Day 14 |
| Integration test suite | All | Day 19 |

---

## Branch Strategy

```
sumit (working branch)
├── sumit/api-service          (Day 1)
├── sumit/analytics-ui         (Days 2-3)
├── sumit/alerts-ui            (Day 4)
├── sumit/projection-backend   (Days 5-8)
├── sumit/analytics-api        (Days 9-10)
├── sumit/alerts-backend       (Days 11-13)
├── sumit/occ                  (Days 14-15)
├── sumit/analytics-polish     (Days 16-17)
├── sumit/projection-recovery  (Day 18)
├── sumit/tests                (Day 19)
└── sumit/final-polish         (Day 20)
```
