const User = require("../models/user");
const { err500, err404, err400 } = require("../utils/errors");
const bcrypt = require("bcryptjs");

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
        return res.status(err404.status).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(err400.status).send({ message: err400.message });
      }
      return res.status(err500.status).send({ message: err500.message });
    });
};

// POST /users - create new user

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  // Check if the email already exists
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(400)
          .send({ message: "User with this email already exists" });
      }

      // Hash password
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
        .then(() => res.status(201).send({ name, avatar, email }))
        .catch((err) => {
          if (err.code === 11000) {
            res
              .status(400)
              .send({ message: "User with this email already exists" });
          } else if (err.name === "ValidationError") {
            res.status(400).send({ message: "Check required fields" });
          } else {
            res.status(500).send({ message: "Internal Server Error" });
          }
        }),
    );
};

module.exports = { getUsers, getUserByID, createUser };
