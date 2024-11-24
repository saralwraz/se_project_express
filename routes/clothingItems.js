const express = require("express");
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

// createItem
router.post("/", auth, createItem);

// getItems
router.get("/", getItems);

// deleteItem
router.delete("/:itemId", auth, deleteItem);

// likeItem
router.put("/:itemId/likes", auth, likeItem);

// unlikeItem
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
