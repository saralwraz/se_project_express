const express = require("express");
const app = express();
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on port 3001`);
});

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
