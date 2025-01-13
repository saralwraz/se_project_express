const mongoose = require("mongoose");
const clothingItem = require("../models/clothingItem");
const ValidationError = require("../utils/errors/ValidationError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ForbiddenError = require("../utils/errors/ForbiddenError");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!name || !weather || !imageUrl) {
    throw new ValidationError("Missing required fields for item creation");
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    throw new ValidationError("Invalid or missing item ID");
  }

  return clothingItem
    .findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You cannot delete this item");
      }
      return item.remove();
    })
    .then(() => res.send({ message: "Item successfully deleted" }))
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    throw new ValidationError("Invalid or missing item ID");
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send(item))
    .catch(next);
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId || !isValidObjectId(itemId)) {
    throw new ValidationError("Invalid or missing item ID");
  }

  return clothingItem
    .findByIdAndUpdate(
      itemId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send(item))
    .catch(next);
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
