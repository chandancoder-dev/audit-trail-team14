const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require('./src/app');
const mongoose = require("mongoose");
require('dotenv').config();
const projectionWorker = require('./src/projections/projectionWorker');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("db connected");
  projectionWorker.start();

  // Only start accepting requests once the DB is connected.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((e) => {
  console.error("Failed to connect to MongoDB:", e.message);
  process.exit(1);
});