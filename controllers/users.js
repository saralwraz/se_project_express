const User = require("../models/user");
const { err500, err404, err400 } = require("../utils/errors");

//GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(err500.status).send({ message: err500.message });
    });
};

// GET /users/:userId
const getUserByID = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error("DocumentNotFoundError"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.message === "DocumentNotFoundError") {
        return res.status(404).send({ message: err404.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err400.message });
      }
      return res.status(500).send({ message: err500.message });
    });
};

// POST /users - create new user

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.message === "DocumentNotFoundError") {
        return res.status(err404.status).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err400.message });
      }
      return res.status(500).send({ message: err500.message });
    });
};

module.exports = { getUsers, getUserByID, createUser };
