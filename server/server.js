const app = require('./src/app');
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(()=> console.log("db connected"))
.catch((e)=>console.log(e));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
