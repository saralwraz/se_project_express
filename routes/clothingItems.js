const express = require("express");
const auth = require("../middlewares/auth");
const {
  validateCreateItem,
  validateItemId,
} = require("../middlewares/validation");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

const router = express.Router();

router.post("/", auth, validateCreateItem, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, validateItemId, deleteItem);
router.put("/:itemId/likes", auth, validateItemId, likeItem);
router.delete("/:itemId/likes", auth, validateItemId, unlikeItem);

module.exports = router;
