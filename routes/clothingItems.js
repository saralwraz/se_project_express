const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// createItem
router.post("/", createItem, auth);

// getItems
router.get("/", getItems);

// deleteItem
router.delete("/:itemId", deleteItem, auth);

// likeItem
router.put("/:itemId/likes", likeItem, auth);

// unlikeItem
router.delete("/:itemId/likes", unlikeItem, auth);

module.exports = router;
