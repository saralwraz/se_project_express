const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// createItem
router.post("/", createItem);

// getItems
router.get("/", getItems);

// deleteItem
router.delete("/:itemId", deleteItem);

// likeItem
router.put("/:itemId/likes", likeItem);

// unlikeItem
router.delete("/:itemId/likes", unlikeItem);

// Handling non-existent resources
router.use((req, res) => {
  res.status(404).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
