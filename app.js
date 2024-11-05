const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Connect to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

// Middleware
app.use((req, res, next) => {
  req.user = { _id: "6729155c33bb8bf38b5a2820" };
  next();
});

// JSON body parsing
app.use(express.json());

app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
