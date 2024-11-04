const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

// Import controllers
const { getUsers, getUserByID, createUser } = require("./controllers/users");
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("./controllers/clothingItems");

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

// User Routes
app.get("/users", getUsers);
app.get("/users/:id", getUserByID);
app.post("/users", createUser);

// Item Routes
app.get("/items", getItems);
app.post("/items", createItem);
app.delete("/items/:itemId", deleteItem);
app.post("/items/:itemId/likes", likeItem);
app.delete("/items/:itemId/likes", unlikeItem);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
