const express = require('express');
const cors = require('cors');
const authRouter = require("./auth/auth.route");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",authRouter);
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
