const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

// createItem
router.post("/", createItem);

// getItems
router.get("/", getItems);

// deleteItem
router.delete("/:itemId", deleteItem);

// Handling non-existent resources
router.use((req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
