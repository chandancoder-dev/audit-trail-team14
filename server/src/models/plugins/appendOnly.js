/**
 * appendOnly — Mongoose plugin that enforces an append-only collection.
 *
 * Applying this plugin to a schema makes its documents immutable after insert:
 * inserts are allowed, but every update / replace / delete path is rejected at
 * the application (Mongoose) layer.
 *
 * IMPORTANT — layers of defense:
 *   This plugin enforces immutability for code that goes THROUGH the Mongoose
 *   model. It does NOT stop the native driver, mongosh, or another service using
 *   the same DB credentials. For a true system guarantee, pair this with
 *   DB-layer least privilege (see scripts/setupAppendOnlyRole.js) so the app's
 *   database user has insert+find but not update/remove on the collection.
 *
 * What it blocks:
 *   - doc.save() on an already-persisted document
 *   - Query updates: update, updateOne, updateMany, findOneAndUpdate,
 *     findByIdAndUpdate, replaceOne
 *   - Query deletes: remove, deleteOne, deleteMany, findOneAndDelete,
 *     findByIdAndDelete, findOneAndRemove
 *   - bulkWrite operations that update/replace/delete
 *   - updateOne/updateMany used with upsert (to prevent update-as-write abuse)
 *
 * What it allows:
 *   - Model.create(...) / new Model(...).save() for NEW documents
 *   - insertMany(...) for new documents
 *   - All reads (find, findOne, aggregate, countDocuments, distinct, ...)
 */

class AppendOnlyViolationError extends Error {
  constructor(operation) {
    super(
      `Append-only collection: "${operation}" is not permitted. ` +
        `Events are immutable once written.`
    );
    this.name = "AppendOnlyViolationError";
    this.code = "APPEND_ONLY_VIOLATION";
    this.operation = operation;
  }
}

const UPDATE_OPS = [
  "update",
  "updateOne",
  "updateMany",
  "replaceOne",
  "findOneAndUpdate",
  "findOneAndReplace",
  "findByIdAndUpdate",
];

const DELETE_OPS = [
  "remove",
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
  "findByIdAndDelete",
  "findOneAndRemove",
];

// Bulk operations that mutate existing documents.
const MUTATING_BULK_OPS = new Set([
  "updateOne",
  "updateMany",
  "replaceOne",
  "deleteOne",
  "deleteMany",
]);

function appendOnly(schema) {
  // 0) Block modifying an existing document as early as possible (before
  //    validation) so the append-only error is the one surfaced.
  schema.pre("validate", function (next) {
    if (!this.isNew) {
      return next(new AppendOnlyViolationError("save (modify existing)"));
    }
    next();
  });

  // 1) Block re-saving an existing document (doc.save() on a non-new doc).
  schema.pre("save", function (next) {
    if (!this.isNew) {
      return next(new AppendOnlyViolationError("save (modify existing)"));
    }
    next();
  });

  // 2) Block all query-level update operations.
  UPDATE_OPS.forEach((op) => {
    schema.pre(op, function (next) {
      next(new AppendOnlyViolationError(op));
    });
  });

  // 3) Block all query-level delete operations. These are query middleware.
  DELETE_OPS.forEach((op) => {
    schema.pre(op, { document: false, query: true }, function (next) {
      next(new AppendOnlyViolationError(op));
    });
  });

  // 4) Block mutating bulkWrite operations (insertOnly is allowed).
  schema.pre("bulkWrite", function (next, ops) {
    // `ops` is the array passed to Model.bulkWrite([...]).
    const operations = Array.isArray(ops) ? ops : [];
    const hasMutation = operations.some((entry) =>
      Object.keys(entry || {}).some((key) => MUTATING_BULK_OPS.has(key))
    );
    if (hasMutation) {
      return next(new AppendOnlyViolationError("bulkWrite (mutating)"));
    }
    next();
  });
}

module.exports = appendOnly;
module.exports.AppendOnlyViolationError = AppendOnlyViolationError;
module.exports.UPDATE_OPS = UPDATE_OPS;
module.exports.DELETE_OPS = DELETE_OPS;
