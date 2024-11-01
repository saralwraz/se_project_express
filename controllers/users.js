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
  const { userID } = req.params;
  User.findById(userID)
    .then((user) => res.status(200).send(user))
    .orFail()
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(err404.status).send({ message: err.message });
      } else if (err.name === "RequestError") {
        res.status(err400.status).send({ message: err.message });
      } else {
        res.status(err500.status).send({ message: err.message });
      }
      return err;
    });
};

// POST /users - create new user

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(err400.status).send({ message: err.message });
      }
      return res.status(err500.status).send({ message: err.message });
    });
};

module.exports = { getUsers, getUserByID, createUser };
