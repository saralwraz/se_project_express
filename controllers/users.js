const User = require("../models/user");
const { err500, err404, err400 } = require("../utils/errors");

//GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(err500.status).send({ message: err.message });
    });
};

// GET /users/:userId
const getUserByID = (req, res) => {
  console.log(req.params);
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.message === "NotFound") {
        return res.status(err404.status).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(err400.status).send({ message: "Invalid user ID" });
      }
      return res.status(err500.status).send({ message: "An error occurred" });
    });
};

// POST /users - create new user

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.message === "NotFound") {
        return res.status(err404.status).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = { getUsers, getUserByID, createUser };
