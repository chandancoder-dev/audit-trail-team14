const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = require('./src/app');
const mongoose = require("mongoose");
require('dotenv').config();
const projectionWorker = require('./src/projections/projectionWorker');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("db connected");
  projectionWorker.start();
})
.catch((e) => console.log(e));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});