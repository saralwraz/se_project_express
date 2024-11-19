const mongoose = require("mongoose");
const { err500, err404, err400, err403 } = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

// Error handling
const handleErrors = (err, res) => {
  console.error(err);
  res.setHeader("Content-Type", "application/json");
  if (err.name === "ValidationError") {
    res.status(err400.status).send({ message: err400.message });
  } else if (err.name === "DocumentNotFoundError") {
    res.status(err404.status).send({ message: err404.message });
  } else if (err.name === "Forbidden") {
    res.status(err403.status).send({ message: err403.message });
  } else {
    res.status(err500.status).send({ message: err500.message });
  }
};

// Check valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /items - Get all items
const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => handleErrors(err, res));
};

// POST /items - Create a new item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  // Validate required
  if (!name || !weather || !imageUrl) {
    return res
      .status(err400.status)
      .send({ message: "Missing required fields for item creation" });
  }

  if (!req.user || !req.user._id) {
    return res
      .status(err400.status)
      .send({ message: "User information is missing" });
  }

  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => handleErrors(err, res));
};

// DELETE /items/:itemId - Delete an item by ID
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  // Validate itemId
  if (!itemId || !isValidObjectId(itemId)) {
    return res
      .status(err400.status)
      .send({ message: "Invalid or missing item ID" });
  }

  clothingItem
    .findById(itemId)
    .orFail(new Error("DocumentNotFoundError"))
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
      .status(err400.status)
      .send({ message: "Invalid or missing item ID" });
  }

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((item) => {
      if (!item) {
        return res.status(err404.status).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => handleErrors(err, res));
};

// DELETE /items/:itemId/likes - Unlike an item
const unlikeItem = (req, res) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    return res
      .status(err400.status)
      .send({ message: "Invalid or missing item ID" });
  }

  clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((item) => {
      if (!item) {
        return res.status(err404.status).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => handleErrors(err, res));
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
