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

module.exports = router;
