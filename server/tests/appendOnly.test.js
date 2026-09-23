// Unit tests for the append-only immutability plugin.
// These verify the guard rejects every mutation/delete path and allows inserts,
// WITHOUT needing a live MongoDB connection (we assert on the pre-hook behavior).

const mongoose = require("mongoose");
const appendOnly = require("../src/models/plugins/appendOnly");
const { AppendOnlyViolationError } = appendOnly;

// Build a throwaway model with the plugin applied.
const testSchema = new mongoose.Schema({
  name: String,
  value: Number,
});
testSchema.plugin(appendOnly);

// Use a unique model name to avoid clashing with the real Event model.
const AppendOnlyThing =
  mongoose.models.AppendOnlyThing ||
  mongoose.model("AppendOnlyThing", testSchema);

describe("appendOnly plugin — query-level mutations are rejected", () => {
  const updateOps = [
    "updateOne",
    "updateMany",
    "replaceOne",
    "findOneAndUpdate",
    "findByIdAndUpdate",
  ];

  const deleteOps = [
    "deleteOne",
    "deleteMany",
    "findOneAndDelete",
    "findByIdAndDelete",
  ];

  test.each(updateOps)("%s() rejects with AppendOnlyViolationError", async (op) => {
    // findByIdAndUpdate needs an id-shaped arg; others take a filter.
    const args =
      op === "findByIdAndUpdate"
        ? [new mongoose.Types.ObjectId(), { value: 1 }]
        : [{ name: "x" }, { value: 1 }];

    await expect(AppendOnlyThing[op](...args).exec()).rejects.toThrow(
      AppendOnlyViolationError
    );
  });

  test.each(deleteOps)("%s() rejects with AppendOnlyViolationError", async (op) => {
    const args =
      op === "findByIdAndDelete"
        ? [new mongoose.Types.ObjectId()]
        : [{ name: "x" }];

    await expect(AppendOnlyThing[op](...args).exec()).rejects.toThrow(
      AppendOnlyViolationError
    );
  });
});

describe("appendOnly plugin — mutating bulkWrite is rejected", () => {
  const mutatingBulk = [
    ["updateOne", [{ updateOne: { filter: { name: "x" }, update: { value: 1 } } }]],
    ["updateMany", [{ updateMany: { filter: {}, update: { value: 1 } } }]],
    ["replaceOne", [{ replaceOne: { filter: { name: "x" }, replacement: { name: "y" } } }]],
    ["deleteOne", [{ deleteOne: { filter: { name: "x" } } }]],
    ["deleteMany", [{ deleteMany: { filter: {} } }]],
  ];

  test.each(mutatingBulk)("bulkWrite with %s rejects", async (_label, ops) => {
    await expect(AppendOnlyThing.bulkWrite(ops)).rejects.toThrow(
      AppendOnlyViolationError
    );
  });
});

describe("appendOnly plugin — save() on an existing document is rejected", () => {
  test("re-saving a non-new document rejects", async () => {
    const doc = new AppendOnlyThing({ name: "a", value: 1 });
    // Simulate a persisted document (Mongoose marks isNew=false after save).
    doc.isNew = false;
    doc.$__.saved = true;

    await expect(doc.save()).rejects.toThrow(AppendOnlyViolationError);
  });
});

describe("appendOnly plugin — inserts are still allowed (hook passes)", () => {
  test("save() on a NEW document does not trip the guard", async () => {
    const doc = new AppendOnlyThing({ name: "a", value: 1 });
    expect(doc.isNew).toBe(true);

    // Run only the pre('save') hooks and confirm none reject for a new doc.
    // We call the internal hook runner via validate->save pre chain by invoking
    // the registered pre hooks directly through Mongoose's hooks API.
    const hooks = testSchema.s.hooks;
    await expect(
      new Promise((resolve, reject) => {
        hooks.execPre("save", doc, [], (err) => (err ? reject(err) : resolve()));
      })
    ).resolves.toBeUndefined();
  });

  test("non-mutating bulkWrite (insertOne only) passes the guard", async () => {
    const hooks = testSchema.s.hooks;
    const ops = [{ insertOne: { document: { name: "z", value: 2 } } }];

    await expect(
      new Promise((resolve, reject) => {
        hooks.execPre("bulkWrite", AppendOnlyThing, [ops], (err) =>
          err ? reject(err) : resolve()
        );
      })
    ).resolves.toBeUndefined();
  });
});
