/**
 * setupAppendOnlyRole — provisions DB-layer append-only enforcement.
 *
 * This is the SYSTEM-level guarantee: it creates a MongoDB custom role that can
 * INSERT and FIND on the `events` collection but CANNOT update or remove. Assign
 * this role to the application's database user so that even the native driver,
 * mongosh, a compromised process, or a buggy migration cannot mutate the event
 * log. Immutability then holds regardless of application code.
 *
 * WHY THIS MATTERS:
 *   The Mongoose appendOnly plugin protects code that goes through the model.
 *   This role protects the collection at the database boundary — defense in depth.
 *
 * REQUIREMENTS:
 *   - You must run this with an admin user that has userAdmin/dbAdmin privileges.
 *     (The regular app user cannot create roles.)
 *   - Set ADMIN_MONGO_URI to an admin connection string, and APP_DB_USER to the
 *     application user that should receive the append-only role.
 *
 * USAGE:
 *   ADMIN_MONGO_URI="mongodb+srv://admin:pass@cluster/..." \
 *   APP_DB_USER="audit_app" \
 *   node scripts/setupAppendOnlyRole.js
 *
 * NOTE (MongoDB Atlas):
 *   On Atlas M0/M10 shared tiers, custom roles are created via the Atlas UI/API
 *   rather than createRole. This script targets self-managed / dedicated clusters.
 *   For Atlas, replicate the same privilege set (insert + find, no update/remove)
 *   as a Custom Role in the Atlas "Database Access" screen. See docs/IMMUTABILITY.md.
 */

require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");

const ADMIN_URI = process.env.ADMIN_MONGO_URI;
const APP_USER = process.env.APP_DB_USER;
const ROLE_NAME = "appendOnlyEvents";
const EVENTS_COLLECTION = "events";

async function main() {
  if (!ADMIN_URI) {
    console.error(
      "ADMIN_MONGO_URI is required (an admin connection string that can create roles)."
    );
    process.exit(1);
  }

  await mongoose.connect(ADMIN_URI);
  const db = mongoose.connection.db;
  const dbName = mongoose.connection.name;
  console.log("Connected as admin to:", dbName);

  // 1) Create (or update) a custom role: insert + find on events, nothing else.
  const roleDefinition = {
    createRole: ROLE_NAME,
    privileges: [
      {
        resource: { db: dbName, collection: EVENTS_COLLECTION },
        // NOTE: 'insert' and 'find' only. No 'update', no 'remove'.
        actions: ["insert", "find"],
      },
    ],
    roles: [],
  };

  try {
    await db.command(roleDefinition);
    console.log(`✅ Created role "${ROLE_NAME}" (insert + find on ${EVENTS_COLLECTION}).`);
  } catch (err) {
    if (err.codeName === "DuplicateKey" || /already exists/i.test(err.message)) {
      // Update the existing role's privileges to be safe.
      await db.command({
        updateRole: ROLE_NAME,
        privileges: roleDefinition.privileges,
        roles: [],
      });
      console.log(`✅ Updated existing role "${ROLE_NAME}".`);
    } else {
      throw err;
    }
  }

  // 2) Optionally grant the role to the application user.
  if (APP_USER) {
    await db.command({ grantRolesToUser: APP_USER, roles: [ROLE_NAME] });
    console.log(`✅ Granted "${ROLE_NAME}" to user "${APP_USER}".`);
    console.log(
      "   The app user can now insert+read events but cannot update or delete them."
    );
  } else {
    console.log(
      "ℹ️  APP_DB_USER not set — role created but not granted. " +
        "Grant it with: db.grantRolesToUser('<appUser>', ['" + ROLE_NAME + "'])"
    );
  }

  await mongoose.disconnect();
  console.log("\nDone. Event store is now append-only at the database layer.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Setup failed:", err.message);
  console.error(
    "If this is MongoDB Atlas shared tier, create the role via the Atlas UI instead " +
      "(see docs/IMMUTABILITY.md)."
  );
  process.exit(1);
});
