const mongoose = require("mongoose");
const {
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  FORBIDDEN_ERROR,
} = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

// Error handling
const handleErrors = (err, res) => {
  console.error(err);
  res.setHeader("Content-Type", "application/json");
  if (err.name === "ValidationError") {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Invalid data provided" });
  }
  if (
    err.name === "DocumentNotFoundError" ||
    err.message === "DocumentNotFoundError"
  ) {
    return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
  }
  if (err.name === "Forbidden") {
    return res
      .status(FORBIDDEN_ERROR)
      .send({ message: "Forbidden: You cannot delete this item" });
  }
  // Default return for unexpected errors
  return res
    .status(DEFAULT_ERROR)
    .send({ message: "An unexpected error occurred" });
};

// Define isValidObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /items - Get all items
const getItems = (req, res) =>
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => handleErrors(err, res));

// POST /items - Create a new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Missing required fields for item creation" });
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => handleErrors(err, res));
};

// DELETE /items/:itemId - Delete an item by ID
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Invalid or missing item ID" });
  }

  return clothingItem
    .findById(itemId)
    .orFail(() => new Error("DocumentNotFoundError"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        const err = new Error("You cannot delete this item");
        err.name = "Forbidden";
        throw err;
      }
      return item.remove();
    })
    .then(() => res.status(200).send({ message: "Item successfully deleted" }))
    .catch((err) => handleErrors(err, res));
};

// PUT /items/:itemId/likes - Like an item
const likeItem = (req, res) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Invalid or missing item ID" });
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((item) =>
      item
        ? res.status(200).send(item)
        : res.status(NOT_FOUND_ERROR).send({ message: "Item not found" }),
    )
    .catch((err) => handleErrors(err, res));
};

// DELETE /items/:itemId/likes - Unlike an item
const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    return res
      .status(INVALID_DATA_ERROR)
      .send({ message: "Invalid or missing item ID" });
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((item) =>
      item
        ? res.status(200).send(item)
        : res.status(NOT_FOUND_ERROR).send({ message: "Item not found" }),
    )
    .catch((err) => handleErrors(err, res));
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
