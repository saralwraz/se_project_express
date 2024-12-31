const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();
const { PORT = 3001 } = process.env;

//Cors
app.use(cors());

// Connect to the database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

// JSON body parsing
app.use(express.json());

app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//error handling
app.use(errorHandler);

module.exports = app;
