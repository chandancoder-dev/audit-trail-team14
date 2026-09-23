# Event Store Immutability

The event store (`events` collection) is **append-only**: once an event is
written, it can never be modified or deleted. This is a core guarantee of the
event-sourcing architecture — the audit trail is only trustworthy if history
cannot be rewritten.

Immutability is enforced with **defense in depth** across three layers.

---

## Layer 1 — Schema / versioning (structural)

`server/src/models/Event.js`

- Every event has a monotonically increasing `version` per `shipmentId`.
- A **unique compound index** `{ shipmentId: 1, version: 1 }` makes it
  physically impossible to insert a duplicate or overwriting version.

```js
eventSchema.index({ shipmentId: 1, version: 1 }, { unique: true });
```

This guarantees append-only *ordering*: you can only ever add the next version.

---

## Layer 2 — Application guard (Mongoose plugin)

`server/src/models/plugins/appendOnly.js`, applied via `eventSchema.plugin(appendOnly)`.

Rejects, at the Mongoose layer, every path that could mutate an event:

- `save()` on an already-persisted document
- `updateOne`, `updateMany`, `update`, `replaceOne`, `findOneAndUpdate`,
  `findOneAndReplace`, `findByIdAndUpdate`
- `deleteOne`, `deleteMany`, `findOneAndDelete`, `findByIdAndDelete`,
  `findOneAndRemove`, `remove`
- `bulkWrite` operations containing any update/replace/delete

Inserts (`create`, `insertMany`, `new Event().save()`) and all reads are allowed.

Violations throw an `AppendOnlyViolationError` (code `APPEND_ONLY_VIOLATION`).

**Limit:** this only protects code that goes *through the Mongoose model*. It
does **not** stop the native driver, `mongosh`, or another service using the
same DB credentials. That gap is closed by Layer 3.

### Tests

`server/tests/appendOnly.test.js` — asserts every mutation/delete path is
rejected and that inserts still pass. Run with `npm test`.

### Live proof

```bash
cd server
npm run audit:immutability
```

Connects to the real DB, attempts updates/deletes on an existing event, and
shows each one rejected with the event left unchanged.

---

## Layer 3 — Database least privilege (system guarantee)

`server/scripts/setupAppendOnlyRole.js`

The true system-level guarantee: restrict the application's **database user** so
it has only `insert` + `find` on the `events` collection — no `update`, no
`remove`. Then immutability holds even if:

- application code is bypassed (native driver, migrations),
- the app is compromised,
- someone connects with the app credentials via `mongosh`.

### Self-managed / dedicated clusters

```bash
ADMIN_MONGO_URI="mongodb+srv://<admin>:<pass>@cluster/..." \
APP_DB_USER="<app_user>" \
node scripts/setupAppendOnlyRole.js
```

This creates a custom role `appendOnlyEvents` with:

```
resource: { db: <dbName>, collection: "events" }
actions:  ["insert", "find"]   // deliberately NO update / remove
```

and grants it to the application user.

### MongoDB Atlas (shared tiers)

Custom roles on Atlas are created via the Atlas UI/API, not `createRole`.
In **Database Access → Custom Roles**, create a role with the same privilege
set (insert + find on `events`, no update/remove) and assign it to the app user.

---

## Summary

| Layer | Mechanism | Protects against | Bypassable by |
|-------|-----------|------------------|---------------|
| 1. Structural | Unique `{shipmentId, version}` index | Overwriting/duplicating a version | — (DB-enforced) |
| 2. Application | `appendOnly` Mongoose plugin | App code doing update/delete/replace | Native driver / mongosh |
| 3. Database | Least-privilege role (insert+find only) | Any client using app credentials | Only an admin with elevated role |

Together these make the event store immutable as a **system property**, not a
convention or a demo trick.
