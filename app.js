const express = require("express");
const app = express();
const { getUsers, getUserByID, createUser } = require("./controllers/users");
const { PORT = 3001 } = process.env;
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`Server is running on port 3001`);
});

app.use((req, res, next) => {
  req.user = {
    _id: "6729155c33bb8bf38b5a2820",
  };
  next();
});

app.use(express.json());
app.get("/users", getUsers);
app.get("/users/:id", getUserByID);
app.post("/users", createUser);
